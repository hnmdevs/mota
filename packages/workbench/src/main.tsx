import { MotaStreamProvider } from '@imoogle/stream-client-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RootMota } from './components/root-mota'
import '@imoogle/ui/globals.css'
import './index.css'
import { App } from './App'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  const address = window.location.origin.replace('http', 'ws')

  root.render(
    <StrictMode>
      <MotaStreamProvider address={address}>
        <RootMota>
          <App />
        </RootMota>
      </MotaStreamProvider>
    </StrictMode>,
  )
}
