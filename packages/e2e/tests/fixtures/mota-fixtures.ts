import { test as base } from '@playwright/test'
import { MotaApplicationPage, WorkbenchPage, LogsPage, ApiHelpers } from '../page-objects'
import { TracesPage } from '../page-objects/TracesPage'

export type MotaContext = {
  motaApp: MotaApplicationPage
  workbench: WorkbenchPage
  logsPage: LogsPage
  tracesPage: TracesPage
  api: ApiHelpers
}

export const test = base.extend<MotaContext>({
  motaApp: async ({ page }, use) => {
    const motaApp = new MotaApplicationPage(page)
    await use(motaApp)
  },

  workbench: async ({ page }, use) => {
    const workbench = new WorkbenchPage(page)
    await use(workbench)
  },

  logsPage: async ({ page }, use) => {
    const logsPage = new LogsPage(page)
    await use(logsPage)
  },

  tracesPage: async ({ page }, use) => {
    const tracesPage = new TracesPage(page)
    await use(tracesPage)
  },

  api: async ({ page }, use) => {
    const api = new ApiHelpers(page)
    await use(api)
  },
})

export { expect } from '@playwright/test'
