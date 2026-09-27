import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const FORMATTABLE = /\.(ts|tsx|js|mjs|cjs|jsx|json|css|md|mdx)$/

// 훅 입력(JSON)에서 수정된 파일 경로를 읽음
const readFilePath = async () => {
  let raw = ''
  for await (const chunk of process.stdin) raw += chunk
  const input = JSON.parse(raw || '{}')
  return input?.tool_input?.file_path ?? ''
}

// Prettier가 설치되어 있으면 방금 수정한 파일을 포맷함
const main = async () => {
  const filePath = await readFilePath()
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  const prettier = path.join(root, 'node_modules', '.bin', 'prettier')
  if (!filePath || !FORMATTABLE.test(filePath) || !existsSync(prettier)) return
  spawnSync(prettier, ['--write', '--ignore-unknown', filePath], { cwd: root, stdio: 'ignore' })
}

main()
