import { ApiRouteConfig, Handlers } from 'mota'
import { z } from 'zod'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'TestStateApiTrigger',
  description: 'test state',
  path: '/test-state',
  method: 'POST',
  emits: ['test-state-python'],
  bodySchema: z.object({}),
  flows: ['test-state'],
}

export const handler: Handlers['TestStateApiTrigger'] = async (req, { logger, emit }) => {
  logger.info('[Test mota state] triggering api step', req)

  await emit({
    topic: 'test-state-python',
    data: {},
  })

  return {
    status: 200,
    body: { message: 'test-state topic emitted' },
  }
}
