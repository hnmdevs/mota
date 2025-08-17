import path from 'path'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { ApiRouteConfig, CronConfig, EventConfig, NoopConfig, Step } from '../../types'

export const createApiStep = (config: Partial<ApiRouteConfig> = {}, filePath?: string): Step<ApiRouteConfig> => ({
  config: {
    type: 'api',
    name: 'Start Event',
    description: 'Start the Mota Server Example flow',
    path: '/api/mota-server-example',
    method: 'POST',
    emits: ['ws-server-example.start'],
    flows: ['mota-server'],
    ...config,
  },
  version: '1',
  filePath: filePath ?? path.join(process.cwd(), '/playground/steps/motaServerExample/startServerExample.step.ts'),
})

export const createEventStep = (config: Partial<EventConfig> = {}, filePath?: string): Step<EventConfig> => ({
  config: {
    type: 'event',
    name: 'Processor',
    subscribes: ['ws-server-example.start'],
    emits: ['ws-server-example.processed'],
    input: zodToJsonSchema(z.object({})) as never,
    flows: ['mota-server'],
    ...config,
  },
  version: '1',
  filePath: filePath ?? path.join(process.cwd(), '/playground/steps/motaServerExample/processor.step.ts'),
})

export const createCronStep = (config: Partial<CronConfig> = {}, filePath?: string): Step<CronConfig> => ({
  config: {
    type: 'cron',
    name: 'Cron Job',
    cron: '* * * * *',
    emits: [],
    flows: ['mota-server'],
    ...config,
  },
  version: '1',
  filePath: filePath ?? path.join(process.cwd(), '/playground/steps/motaServerExample/cronJob.step.ts'),
})

export const createNoopStep = (config: Partial<NoopConfig> = {}, filePath?: string): Step<NoopConfig> => ({
  config: {
    type: 'noop',
    name: 'Noop',
    virtualEmits: ['noop-event'],
    virtualSubscribes: ['noop-subscription'],
    flows: ['mota-server'],
    ...config,
  },
  version: '1',
  filePath: filePath ?? path.join(process.cwd(), '/playground/steps/motaServerExample/noop.step.ts'),
})
