import React from 'react'
import { Stream } from '@imoogle/stream-client-browser'

type MotaStreamContextType = {
  stream: Stream | null
}

export const MotaStreamContext = React.createContext<MotaStreamContextType>({
  stream: null,
})
