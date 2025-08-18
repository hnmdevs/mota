import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { platform } from 'os'

async function globalTeardown() {
  console.log('🧹 Cleaning up E2E test environment...')

  try {
    console.log('🛑 Stopping test project server...')

    const isWindows = platform() === 'win32'
    const motaTestPid = process.env.MOTIA_TEST_PID

    if (!isWindows) {
      try {
        execSync('lsof -ti:3000 | xargs kill -9', { stdio: 'ignore' })
      } catch (error) {}
    } else {
      try {
        execSync('netstat -ano | findstr :3000 | for /f "tokens=5" %a in (\'more\') do taskkill /f /pid %a', { stdio: 'ignore' })
      } catch (error) {}
      
      if (motaTestPid) {
        try {
          execSync(`taskkill /f /pid ${motaTestPid} 2>nul`, { stdio: 'ignore' })
        } catch (error) {}
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const testProjectPath = process.env.TEST_PROJECT_PATH
    if (testProjectPath && existsSync(testProjectPath)) {
      console.log('🗑️  Removing test project directory...')
      
      if (isWindows) {
        await removeDirectoryWithRetry(testProjectPath, 3)
      } else {
        rmSync(testProjectPath, { recursive: true, force: true })
      }
    }

    console.log('✅ E2E test environment cleanup complete!')
  } catch (error) {
    console.error('❌ Failed to cleanup E2E test environment:', error)
  }
}

async function removeDirectoryWithRetry(path: string, maxRetries: number) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      rmSync(path, { recursive: true, force: true })
      console.log(`✅ Successfully removed directory on attempt ${attempt}`)
      return
    } catch (error: any) {
      if (error.code === 'EBUSY' || error.code === 'ENOTEMPTY') {
        console.log(`⏳ Directory busy, waiting before retry ${attempt}/${maxRetries}...`)
        
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
          
          try {
            execSync(`rmdir /s /q "${path}"`, { stdio: 'ignore' })
            console.log(`✅ Successfully removed directory using rmdir command`)
            return
          } catch (cmdError) {
            console.log(`⚠️  rmdir command failed, will retry with rmSync`)
          }
        } else {
          console.error(`❌ Failed to remove directory after ${maxRetries} attempts:`, error)
          throw error
        }
      } else {
        throw error
      }
    }
  }
}

export default globalTeardown
