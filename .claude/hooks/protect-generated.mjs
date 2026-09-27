const PROTECTED = ['.velite/', 'public/static/', 'node_modules/', '.next/']

// 훅 입력(JSON)에서 수정 대상 파일 경로를 읽음
const readFilePath = async () => {
  let raw = ''
  for await (const chunk of process.stdin) raw += chunk
  const input = JSON.parse(raw || '{}')
  return input?.tool_input?.file_path ?? ''
}

// 생성물 폴더의 파일을 수정하려고 하면 작업을 막음
const main = async () => {
  const filePath = (await readFilePath()).replaceAll('\\', '/')
  const hit = PROTECTED.find((dir) => filePath.includes(`/${dir}`) || filePath.startsWith(dir))
  if (hit) {
    console.error(`${hit}는 생성물 폴더라 직접 수정할 수 없습니다. 원본(content/, velite.config.ts 등)을 수정하세요.`)
    process.exit(2)
  }
}

main()
