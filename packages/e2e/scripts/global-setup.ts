import { execSync, exec } from 'child_process'
import { existsSync, rmSync } from 'fs'
import path from 'path'

const TEST_PROJECT_NAME = 'mota-e2e-test-project'
const TEST_PROJECT_PATH = path.join(process.cwd(), TEST_PROJECT_NAME)

async function globalSetup() {
  console.log('🚀 Setting up E2E test environment...')

  try {
    if (existsSync(TEST_PROJECT_PATH)) {
      console.log('🧹 Cleaning up existing test project...')
      rmSync(TEST_PROJECT_PATH, { recursive: true, force: true })
    }

    const motaVersion = process.env.MOTIA_VERSION || 'pre-release'
    const template = process.env.TEST_TEMPLATE || 'nodejs'

    console.log(`📦 Creating test project with Mota CLI ${motaVersion} and template ${template}...`)
    let createCommand = `npx mota@${motaVersion} create -n ${TEST_PROJECT_NAME}`
    if (template === 'python') {
      createCommand += ' -t python'
    }
    
    execSync(createCommand, {
      stdio: 'pipe',
      cwd: process.cwd()
    })
    execSync(`npm install --save mota@${motaVersion}`, { cwd: TEST_PROJECT_PATH })

    console.log('🌟 Starting test project server...')
    const serverProcess = exec('npm run dev', { cwd: TEST_PROJECT_PATH, env: {
        MOTIA_ANALYTICS_DISABLED: 'true',
        ...process.env
    } })

    console.log('⏳ Waiting for server to be ready...')
    await waitForServer('http://localhost:3000', 60000)

    console.log('✅ E2E test environment setup complete!')

    process.env.TEST_PROJECT_PATH = TEST_PROJECT_PATH
    process.env.TEST_PROJECT_NAME = TEST_PROJECT_NAME
    process.env.TEST_TEMPLATE = template
    process.env.MOTIA_TEST_PID = serverProcess.pid?.toString() || ''

  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error)
    
    if (existsSync(TEST_PROJECT_PATH)) {
      rmSync(TEST_PROJECT_PATH, { recursive: true, force: true })
    }
    
    throw error
  }
}

async function waitForServer(url: string, timeout: number): Promise<void> {
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch (error) {
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  throw new Error(`Server at ${url} did not start within ${timeout}ms`)
}

export default globalSetup 