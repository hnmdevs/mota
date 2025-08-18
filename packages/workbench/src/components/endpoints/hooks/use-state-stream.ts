import { useStreamItem } from '@imoogle/stream-client-react'

export const useStateStream = (object: Record<string, any> | undefined) => {
  const { __mota, ...rest } = object || {}
  const { data } = useStreamItem(__mota)
  const originalData = rest || object

  return {
    data: data || originalData,
    originalData,
    isStreamed: !!__mota,
  }
}
