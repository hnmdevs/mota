import { EnrichmentPlugin, Event } from '@amplitude/analytics-types'
import os from 'os'

export class MotaEnrichmentPlugin implements EnrichmentPlugin {
  name = 'mota-enrichment'
  type = 'enrichment' as const

  async setup(): Promise<undefined> {
    return
  }

  async execute(event: Event): Promise<Event> {
    event.app_version = process.env.npm_package_version || 'unknown'

    if (!event.extra) {
      event.extra = {}
    }

    event.extra.mota_version = process.env.npm_package_dependencies_mota || 'unknown'
    event.extra.source = 'backend'
    event.os_name = os.platform() === 'darwin' ? 'macOS' : os.platform() === 'win32' ? 'Windows' : 'Linux'
    event.os_version = os.release()
    event.platform = os.platform()
    event.device_model = os.type()
    event.device_manufacturer = os.machine()
    event.device_brand = os.platform() === 'darwin' ? 'Apple' : os.platform() === 'win32' ? 'Microsoft' : 'Unknown'

    return event
  }
}
