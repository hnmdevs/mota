import { EventConfig, Handlers } from 'mota'
import { z } from 'zod'
import equal from 'deep-equal'

export const config: EventConfig = {
  type: 'event',
  name: 'TestStateCheck',
  description: 'check state change',
  subscribes: ['test-state-check'],
  emits: [],
  input: z.object({
    key: z.string(),
    expected: z.optional(z.unknown()),
  }),
  flows: ['test-state'],
}

export const handler: Handlers['TestStateCheck'] = async (input, { traceId, logger, state }) => {
  logger.info('[Test mota state with TS] received check-state-change event', input)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = await state.get<any>(traceId, input.key)

  if (!equal(value.data, input.expected, { strict: true })) {
    logger.error(`[Test mota state with TS] state value is not as expected`, { value, expected: input.expected })
  } else {
    logger.info(`[Test mota state with TS] state value is as expected 🏁 🟢`)
  }
}
