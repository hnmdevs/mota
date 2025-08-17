export const cloudApiBaseUrl = process.env.MOTIACLOUD_API_BASE_URL || 'https://mota-hub-api.motahub.com'
export const cloudApiWsUrl = process.env.MOTIACLOUD_API_WS_URL || 'wss://ws-mota-hub-api.motahub.com'

export const cloudEndpoints = {
  createDeployment: `${cloudApiBaseUrl}/v1/deployments`,
  startDeployment: `${cloudApiBaseUrl}/v1/deployments/start`,
  upload: `${cloudApiBaseUrl}/v1/deployments/upload`,
}
