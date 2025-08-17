import React from 'react'
import { MotaStreamContext } from './mota-stream-context'

/**
 * A hook to get the stream context.
 *
 * @example
 * ```tsx
 * const { stream } = useMotaStream()
 * ```
 */
export const useMotaStream = () => {
  const context = React.useContext(MotaStreamContext)

  if (!context) {
    throw new Error('useMotaStream must be used within a MotaStreamProvider')
  }

  return context
}
