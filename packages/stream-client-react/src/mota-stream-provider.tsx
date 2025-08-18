import { Stream } from '@imoogle/stream-client-browser'
import React, { useEffect, useState } from 'react'
import { MotaStreamContext } from './mota-stream-context'

type Props = React.PropsWithChildren<{
  /**
   * The address of the stream server.
   *
   * @example
   * ```tsx
   * <MotaStreamProvider address="ws://localhost:3000">
   *   <App />
   * </MotaStreamProvider>
   */
  address: string
}>

export const MotaStreamProvider: React.FC<Props> = ({ children, address }) => {
  const [stream, setStream] = useState<Stream | null>(null)

  useEffect(() => {
    const stream = new Stream(address)
    setStream(stream)

    return () => stream.close()
  }, [address])

  return <MotaStreamContext.Provider value={{ stream }}>{children}</MotaStreamContext.Provider>
}
