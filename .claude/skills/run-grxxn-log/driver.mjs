#!/usr/bin/env node
// grxxn.log 무의존성 브라우저 드라이버: 로컬 Chrome을 헤드리스로 띄우고 CDP(WebSocket)로 조작한다.
// stdin으로 한 줄에 명령 하나씩 받는다. `help` 명령 또는 SKILL.md 참고.
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS_DIR = process.env.SHOTS_DIR ?? join(tmpdir(), "grxxn-log-shots");
const TIMEOUT = Number(process.env.TIMEOUT ?? 30000);

const VIEWPORTS = {
  desktop: { width: 1280, height: 900, mobile: false, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, mobile: true, deviceScaleFactor: 2 },
};

// 사용할 Chrome 실행 파일 경로를 찾음
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found)
    throw new Error(
      "Chrome을 찾지 못함. CHROME_PATH=<chrome 실행 파일> 로 지정할 것",
    );
  return found;
}

// 헤드리스 Chrome을 띄우고 DevTools 브라우저 WebSocket 주소를 반환함
function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), "grxxn-chrome-"));
  const proc = spawn(
    findChrome(),
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--disable-gpu",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  return new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(
      () => reject(new Error("Chrome 기동 타임아웃")),
      15000,
    );
    proc.stderr.on("data", (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve({ proc, profile, wsUrl: m[1] });
      }
    });
    proc.on("exit", (code) =>
      reject(new Error(`Chrome 종료 (code ${code}): ${buf.slice(-500)}`)),
    );
  });
}

// CDP WebSocket에 연결해 send/on 인터페이스를 만듦
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) {
      for (const fn of listeners.get(msg.method) ?? []) fn(msg.params);
    }
  };
  return {
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const mid = ++id;
        pending.set(mid, { resolve, reject });
        ws.send(JSON.stringify({ id: mid, method, params }));
      }),
    on: (method, fn) =>
      listeners.set(method, [...(listeners.get(method) ?? []), fn]),
    close: () => ws.close(),
  };
}

// 조건이 참이 될 때까지 폴링함
async function poll(fn, what) {
  const end = Date.now() + TIMEOUT;
  while (Date.now() < end) {
    if (await fn()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`타임아웃: ${what}`);
}

const { proc, profile, wsUrl } = await launchChrome();
const port = new URL(wsUrl).port;
const targets = await (
  await fetch(`http://127.0.0.1:${port}/json/list`)
).json();
const pageTarget = targets.find((t) => t.type === "page");
const cdp = await connect(pageTarget.webSocketDebuggerUrl);

const errors = [];
cdp.on("Runtime.exceptionThrown", (p) =>
  errors.push(
    `exception: ${p.exceptionDetails.exception?.description ?? p.exceptionDetails.text}`,
  ),
);
cdp.on("Runtime.consoleAPICalled", (p) => {
  if (p.type === "error")
    errors.push(
      `console.error: ${p.args.map((a) => a.value ?? a.description).join(" ")}`,
    );
});
cdp.on("Log.entryAdded", (p) => {
  if (p.entry.level === "error")
    errors.push(`log: ${p.entry.text} ${p.entry.url ?? ""}`);
});
await Promise.all([
  cdp.send("Page.enable"),
  cdp.send("Runtime.enable"),
  cdp.send("Log.enable"),
]);

let viewport = VIEWPORTS.desktop;
await cdp.send("Emulation.setDeviceMetricsOverride", viewport);
await cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true });
mkdirSync(SHOTS_DIR, { recursive: true });

// 페이지에서 JS 식을 평가해 값을 반환함
async function evaluate(expression) {
  const r = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails)
    throw new Error(
      r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
    );
  return r.result.value;
}

// 셀렉터 또는 text=로 요소를 찾는 페이지 내 JS 식을 만듦
function finder(sel) {
  if (sel.startsWith("text=")) {
    const text = JSON.stringify(sel.slice(5));
    return `[...document.querySelectorAll('body *')].find((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.includes(${text})))`;
  }
  return `document.querySelector(${JSON.stringify(sel)})`;
}

// 요소를 화면에 스크롤하고 가운데 좌표를 반환함
async function center(sel) {
  const pos = await evaluate(`(() => {
    const el = ${finder(sel)}
    if (!el) return null
    el.scrollIntoView({ block: 'center' })
    const r = el.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  })()`);
  if (!pos) throw new Error(`요소 없음: ${sel}`);
  return pos;
}

// 키 하나를 눌렀다 뗌
async function pressKey(key) {
  const codes = {
    Tab: 9,
    Enter: 13,
    Escape: 27,
    Space: 32,
    ArrowDown: 40,
    ArrowUp: 38,
  };
  const base = {
    key: key === "Space" ? " " : key,
    code: key,
    windowsVirtualKeyCode: codes[key] ?? 0,
  };
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    ...base,
    ...(key === "Enter" ? { text: "\r" } : {}),
  });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
}

// 지금 화면(또는 전체 페이지)을 PNG로 저장함
async function screenshot(name, full) {
  const file = join(SHOTS_DIR, `${name ?? `shot-${Date.now()}`}.png`);
  const params = { format: "png" };
  const overlay = await evaluate(`(() => {
    const roots = [...document.querySelectorAll('nextjs-portal')].map((p) => p.shadowRoot).filter(Boolean)
    if (${process.env.SHOW_DEV_INDICATOR !== "1"})
      roots.forEach((r) => r.querySelectorAll('[data-nextjs-toast]').forEach((el) => (el.style.display = 'none')))
    const dialog = roots.map((r) => r.querySelector('[data-nextjs-dialog]')).find(Boolean)
    return dialog ? dialog.innerText.slice(0, 300) : null
  })()`);
  if (full) {
    const { cssContentSize } = await cdp.send("Page.getLayoutMetrics");
    params.captureBeyondViewport = true;
    params.clip = {
      x: 0,
      y: 0,
      width: viewport.width,
      height: Math.ceil(cssContentSize.height),
      scale: 1,
    };
  }
  const { data } = await cdp.send("Page.captureScreenshot", params);
  writeFileSync(file, Buffer.from(data, "base64"));
  if (overlay) failed = true;
  return overlay
    ? `${file}\n!! Next 에러 오버레이가 떠 있음:\n${overlay}`
    : file;
}

const commands = {
  // URL 또는 경로로 이동하고 load 이벤트를 기다림
  async nav(arg) {
    const url = arg.startsWith("http")
      ? arg
      : new URL(arg || "/", BASE_URL).href;
    const loaded = new Promise((r) => cdp.on("Page.loadEventFired", r));
    const res = await cdp.send("Page.navigate", { url });
    if (res.errorText) throw new Error(`${url}: ${res.errorText}`);
    await Promise.race([loaded, new Promise((r) => setTimeout(r, TIMEOUT))]);
    return url;
  },
  // 뷰포트를 desktop/mobile 프리셋 또는 "<w> <h>"로 바꿈
  async viewport(arg) {
    const [a, b] = arg.split(/\s+/);
    viewport = VIEWPORTS[a] ?? {
      width: Number(a),
      height: Number(b),
      mobile: false,
      deviceScaleFactor: 1,
    };
    await cdp.send("Emulation.setDeviceMetricsOverride", viewport);
    return JSON.stringify(viewport);
  },
  // 시스템 색 설정(prefers-color-scheme)을 light/dark로 흉내 냄
  async scheme(arg) {
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: arg }],
    });
    await evaluate(
      `Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})))`,
    );
    return arg;
  },
  // 셀렉터나 text=로 요소가 나타날 때까지 기다림
  async "wait-for"(arg) {
    await poll(() => evaluate(`!!(${finder(arg)})`), arg);
    return "ok";
  },
  // 요소 가운데를 실제 마우스로 클릭함
  async click(arg) {
    const { x, y } = await center(arg);
    for (const type of ["mouseMoved", "mousePressed", "mouseReleased"])
      await cdp.send("Input.dispatchMouseEvent", {
        type,
        x,
        y,
        button: "left",
        clickCount: 1,
      });
    return "ok";
  },
  // 요소 위에 마우스를 올림
  async hover(arg) {
    const { x, y } = await center(arg);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    return "ok";
  },
  // 키를 누름 (Tab, Enter, Escape, Space, ArrowDown, ArrowUp)
  async press(arg) {
    await pressKey(arg);
    return "ok";
  },
  // 페이지에서 JS 식을 평가해 결과를 JSON으로 출력함
  async eval(arg) {
    return JSON.stringify(await evaluate(arg), null, 2);
  },
  // 요소의 계산된 스타일과 크기를 출력함 (DESIGN.md 값 대조용)
  async style(arg) {
    const [
      sel,
      props = "color,background-color,font-family,font-size,font-weight,line-height,letter-spacing",
    ] = arg.split(/\s+(?=[a-z-]+(?:,[a-z-]+)*$)/);
    return JSON.stringify(
      await evaluate(`(() => {
        const el = ${finder(sel)}
        if (!el) return null
        const cs = getComputedStyle(el), r = el.getBoundingClientRect()
        const out = { rect: { x: r.x, y: r.y + scrollY, w: r.width, h: r.height } }
        for (const p of ${JSON.stringify(props.split(","))}) out[p] = cs.getPropertyValue(p)
        return out
      })()`),
      null,
      2,
    );
  },
  // 스크린숏을 저장함 (`screenshot <이름> [full]`)
  async screenshot(arg) {
    const [name, full] = arg.split(/\s+/);
    return screenshot(name || undefined, full === "full");
  },
  // 지금까지 모은 콘솔 에러/예외를 출력하고 비움
  async errors() {
    const out = errors.length ? errors.join("\n") : "(에러 없음)";
    errors.length = 0;
    return out;
  },
  // 밀리초만큼 기다림
  async sleep(arg) {
    await new Promise((r) => setTimeout(r, Number(arg) || 500));
    return "ok";
  },
  async help() {
    return Object.keys(commands).join(", ");
  },
};

const rl = createInterface({ input: process.stdin });
let failed = false;
for await (const raw of rl) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  if (line === "quit") break;
  const [cmd, ...rest] = line.split(" ");
  const fn = commands[cmd];
  try {
    if (!fn) throw new Error(`알 수 없는 명령: ${cmd} (help 참고)`);
    console.log(`> ${line}\n${await fn(rest.join(" "))}`);
  } catch (e) {
    failed = true;
    console.log(`> ${line}\n!! ${e.message}`);
  }
}

cdp.close();
proc.kill();
await new Promise((r) => proc.once("exit", r));
rmSync(profile, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
