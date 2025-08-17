# @imoogle/stream-client-react

Mota Stream Client React Package – Responsible for managing streams of data in React applications.

For more information about Mota Streams, please refer to the [Mota Streams documentation](https://motia.dev/docs).

## Overview

`@imoogle/stream-client-react` provides a set of React utilities and hooks for integrating Mota's real-time streaming capabilities into your React applications. It enables you to subscribe to individual stream items, groups, and handle real-time events with idiomatic React patterns.

---

## Installation

```bash
npm install @imoogle/stream-client-react
```

## Exports

- **Stream, StreamItemSubscription, StreamGroupSubscription**  
  (Re-exported from `@imoogle/stream-client-browser`)
- **MotaStreamProvider**  
  React provider for initializing and supplying the stream context.
- **useMotaStream**  
  Hook to access the current stream instance from context.
- **useStreamItem**  
  Hook to subscribe to a single stream item.
- **useStreamGroup**  
  Hook to subscribe to a group of stream items.
- **useStreamEventHandler**  
  Hook to attach event listeners to stream subscriptions.

## Usage

### 1. MotaStreamProvider

Wrap your application (or a subtree) with `MotaStreamProvider` to initialize the stream and provide it via context.

```tsx
import { MotaStreamProvider } from '@imoogle/stream-client-react'

const App = () => {
  return (
    <MotaStreamProvider address="wss://your-stream-server">
      <App />
    </MotaStreamProvider>
  )
}
```

**Props:**

- `address` (string): The WebSocket address of your Mota stream server.

---

### 2. useMotaStream

Access the current stream instance anywhere within the provider.

```tsx
import { useMotaStream } from '@imoogle/stream-client-react'

const { stream } = useMotaStream()
```

---

### 3. useStreamItem

Subscribe to a single item in a stream and receive real-time updates.

```tsx
import { useStreamItem } from '@imoogle/stream-client-react'

const { data, event } = useStreamItem<{ name: string }>({
  /**
   * The stream name from motia Server
   */
  streamName: 'users',
  /**
   * The id of the item to subscribe to
   */
  id: 'user-123',
})
```

- `data`: The current value of the item (typed).
- `event`: The subscription object to subscribe to custom events. Check `useStreamEventHandler` for more information.

---

### 4. useStreamGroup

Subscribe to a group of items in a stream.

```tsx
import { useStreamGroup } from '@imoogle/stream-client-react'

const { data, event } = useStreamGroup<{ name: string }>({
  /**
   * The stream name from motia Server
   */
  streamName: 'users',
  /**
   * The group id to subscribe to
   */
  groupId: 'admins',
})
```

- `data`: Array of current group items.
- `event`: The group subscription object.

---

### 5. useStreamEventHandler

Attach custom event listeners to a stream subscription.

```tsx
import { useStreamEventHandler } from '@imoogle/stream-client-react'

useStreamEventHandler(
  {
    event, // from useStreamItem or useStreamGroup
    type: 'custom-event',
    listener: (eventData) => {
      // handle event
    },
  },
  [
    /* dependencies */
  ],
)
```

---

## API Reference

### MotaStreamProvider

- **Props:**
  - `address: string` – WebSocket address for the stream server.
  - `children: React.ReactNode`

### useMotaStream

- Returns `{ stream }` from context.

### useStreamItem<TData>

- **Args:** `{ streamName: string, id: string }`
- **Returns:** `{ data: TData | null, event: StreamSubscription | null }`

### useStreamGroup<TData>

- **Args:** `{ streamName: string, groupId: string }`
- **Returns:** `{ data: TData[], event: StreamSubscription | null }`

### useStreamEventHandler

- **Args:**
  - `{ event, type, listener }`
  - `dependencies` (array): React dependency list

---

## Example

```tsx
import { MotaStreamProvider, useStreamItem, useStreamEventHandler } from '@imoogle/stream-client-react'

function UserComponent({ userId }) {
  const { data, event } = useStreamItem<{ name: string }>({
    streamName: 'users',
    id: userId,
  })

  useStreamEventHandler(
    {
      event,
      type: 'user-updated',
      listener: (e) => alert('User updated!'),
    },
    [event],
  )

  if (!data) return <div>Loading...</div>
  return <div>{data.name}</div>
}

export default function App() {
  return (
    <MotaStreamProvider address="wss://your-stream-server">
      <UserComponent userId="user-123" />
    </MotaStreamProvider>
  )
}
```

---

## Notes

- All hooks must be used within a `MotaStreamProvider`.
- The library is designed to work seamlessly with Mota's event-driven architecture.
- For advanced stream management, refer to the [@imoogle/stream-client-browser](https://www.npmjs.com/package/@imoogle/stream-client-browser) documentation.

## License

MIT
