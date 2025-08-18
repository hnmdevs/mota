import { Express } from 'express'
import { getProjectIdentifier, getUserIdentifier, isAnalyticsEnabled } from './analytics/utils'

export const analyticsEndpoint = (app: Express, baseDir: string) => {
  app.get('/mota/analytics/user', (req, res) => {
    const analyticsEnabled = isAnalyticsEnabled()

    if (!analyticsEnabled) {
      res.json({
        userId: null,
        projectId: null,
        motaVersion: null,
        analyticsEnabled: false,
      })
      return
    }

    res.json({
      userId: getUserIdentifier(),
      projectId: getProjectIdentifier(baseDir),
      motaVersion: process.env.npm_package_dependencies_mota || 'unknown',
      analyticsEnabled: true,
    })
  })

  app.get('/mota/analytics/status', (req, res) => {
    res.json({
      analyticsEnabled: isAnalyticsEnabled(),
    })
  })
}
