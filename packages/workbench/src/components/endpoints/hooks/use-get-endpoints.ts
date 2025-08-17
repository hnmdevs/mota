import { useStreamGroup } from '@imoogle/stream-client-react'
import { ApiEndpoint } from '@/types/endpoint'

export const useGetEndpoints = () => {
  const { data: endpoints } = useStreamGroup<ApiEndpoint>({
    streamName: '__mota.api-endpoints',
    groupId: 'default',
  })

  return endpoints
}
