# RFC: Observability System for Mota Framework

## Status
- **RFC Date**: 2025-06-02
- **Status**: Implemented
- **Authors**: Ytallo Layon
- **Reviewers**: Mota Team

## Summary

This RFC proposes implementing an observability system for Mota that provides comprehensive tracing and real-time monitoring through an intuitive horizontal timeline interface. The system will enable users to track execution traces, monitor performance, and debug issues with detailed insights into their workflow executions, focusing on Mota-specific concepts like **States**, **Emit events**, **Streams**, and **step interactions** through a clean, horizontal visualization.

## Background

Currently, Mota provides basic logging capabilities through:
- Terminal-based logs during development
- Real-time log streaming in the Workbench
- Basic analytics tracking for internal telemetry

However, users lack intuitive observability into their workflow executions, making it difficult to:
- Debug complex multi-step workflows in a visual timeline
- Monitor performance bottlenecks across state and stream operations
- Track execution patterns and event flow between steps
- Understand system behavior with clear step-by-step progression
- Trace how events propagate through steps horizontally over time

## Goals

### Primary Goals
1. **Horizontal Timeline Visualization**: Intuitive left-to-right timeline showing step execution over time
2. **Comprehensive Trace Tracking**: Track execution traces with clean step-by-step progression
3. **Cross-Trace Correlation**: Link related traces across multiple triggers for logical flow visualization
4. **Mota Operations Monitoring**: Track state, emit, and stream operations within each step
5. **Real-time Flow Status**: Live status indicators in the Workbench showing active executions
6. **Enhanced Logging Integration**: Leverage existing logging infrastructure with structured events
7. **Persistent Trace Storage**: Store recent traces (last 50) with efficient retrieval
8. **Clean UI Experience**: Horizontal timeline with operation badges and intuitive navigation
9. **Performance Insights**: Timing and duration metrics for steps and operations
10. **Search and Filter**: Find traces by step, state key, event topic, flow name, or correlation ID

### Secondary Goals
1. **Minimal Performance Impact**: Lightweight tracking through enhanced logging
2. **Developer Experience**: Intuitive interfaces for monitoring and debugging
3. **Extensibility**: Design for future enhancements and integrations
4. **Mobile Responsive**: Adaptive design for different screen sizes

## Cross-Trace Correlation: Critical Requirement

### The Challenge

Real-world workflows often involve **multiple related executions** that form a single logical business process, but individual traces don't capture these relationships:

#### Problem Scenarios
1. **Chat Threads**: Each message creates a separate API trace, but they're all part of one conversation
2. **Mixed API/Event Flows**: Initial API → background processing → external input → continuation API → completion
3. **User Sessions**: Multiple interactions across different endpoints that belong to the same user journey
4. **Order Processing**: Payment confirmation, inventory updates, shipping notifications - all separate triggers, one logical order

### Required Solution
```
✅ Required: Correlated Logical Flows
Chat Thread → [Trace A] → [Trace B] → [Trace C]
             └─────── All part of same conversation ──────┘

Order Flow → [API: Create] → [Event: Process] → [API: Confirm] → [Event: Ship]
            └─────────── Complete business process visibility ────────────┘
```

### Correlation Strategies

#### 1. Automatic Correlation
- **State-based**: Auto-detect traces using similar state key patterns
- **Event-based**: Link traces through shared event topics and data
- **Temporal**: Connect traces with logical timing relationships

#### 2. Manual Correlation
- **Context API**: `await context.correlate('business_process_id')`
- **HTTP Headers**: `X-Mota-Correlation-Id` for API calls

#### 3. Logical Flow Visualization
```
Chat Session: user_123_thread_abc (3 traces, 2 min duration)
├─ Trace 1: "Hello, weather?" (✓ 150ms) - 2 min ago
│  └─ get-weather → format-response → send-reply
├─ ⏱️  [Gap: 45s - user thinking]
├─ Trace 2: "What about tomorrow?" (✓ 200ms) - 1 min ago  
│  └─ get-context → get-forecast → format-response
└─ Trace 3: "Thanks!" (🔄 running) - 10s ago
   └─ process-gratitude → [running]
```

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mota Core System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐ │
│  │  Enhanced       │───►│  Trace Builder   │───►│ Trace      │ │
│  │  Logging        │    │   Service        │    │ Storage    │ │
│  │  (call-step)    │    │                  │    │(In-Memory) │ │
│  └─────────────────┘    └──────────────────┘    └────────────┘ │
│          │                        │                        │   │
│          ▼                        ▼                        ▼   │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐ │
│  │ Structured      │    │  Real-time       │    │ Workbench  │ │
│  │ Log Events      │    │  Updates         │    │ API        │ │
│  └─────────────────┘    └──────────────────┘    └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Workbench UI Layer                           │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │ Traces List │  │ Horizontal      │  │ Real-time Flow     │ │
│  │    Page     │  │  Timeline       │  │   Status           │ │
│  └─────────────┘  └─────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────────┐
│ Step Execution  │
│   (any step)    │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐     ┌──────────────────┐
│ Enhanced Logger │────►│ ObservabilityEvent│
│   (logEvent)    │     │   - step_start    │
└─────────────────┘     │   - step_end      │
      │                 │   - state_op      │
      │                 │   - emit_op       │
      │                 │   - stream_op     │
      ▼                 └──────────────────┘
┌─────────────────┐              │
│ Log Stream      │◄─────────────┘
│ (existing)      │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐     ┌──────────────────┐
│ TraceBuilder    │────►│ Trace            │
│   Service       │     │   - id           │
│ (aggregator)    │     │   - steps[]      │
└─────────────────┘     │   - metadata     │
      │                 └──────────────────┘
      ▼                          │
┌─────────────────┐              │
│ In-Memory       │◄─────────────┘
│ Trace Cache     │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐     ┌──────────────────┐
│ API Endpoints   │────►│ UI Components    │
│ /motia/traces   │     │ - TracesPage     │
│ /motia/traces/:id│     │ - Timeline       │
└─────────────────┘     │ - FlowStatus     │
                        └──────────────────┘
```

## Core Design Components

### 1. Data Models

#### Trace Structure
```typescript
interface Trace {
  id: string
  correlationId?: string        // Links related traces across triggers
  parentTraceId?: string        // For child/continuation traces  
  flowName: string
  status: 'running' | 'completed' | 'failed'
  startTime: number
  duration?: number
  entryPoint: { type: 'api' | 'cron' | 'event', stepName: string }
  steps: Step[]
  metadata: { 
    totalSteps: number, 
    completedSteps: number, 
    errorCount: number,
    traceIndex?: number,        // Position in logical flow sequence
    isChildTrace?: boolean,     // Indicates continuation of another trace
    correlationContext?: any    // Additional correlation metadata
  }
}

interface Step {
  name: string
  status: 'waiting' | 'running' | 'completed' | 'failed'
  startTime?: number
  duration?: number
  operations: { state: number, emit: number, stream: number }
  error?: { message: string, code?: string | number }
}
```

#### Trace Group Structure
```typescript
interface TraceGroup {
  id: string                    // Unique identifier (same as correlationId)
  correlationId: string         // Primary correlation identifier
  name: string                  // Business process name (e.g., "Chat Thread", "Order Processing")
  status: 'active' | 'completed' | 'failed' | 'stalled'
  startTime: number
  lastActivity: number
  totalDuration?: number
  traces: Trace[]               // All related traces in chronological order
  metadata: {
    totalTraces: number,
    completedTraces: number,
    activeTraces: number,
    totalSteps: number,
    averageStepDuration: number,
    gapsCount: number,          // Number of waiting periods between traces
    totalGapDuration: number    // Total time spent waiting between traces
  }
}
```

#### Enhanced Log Event Structure
```typescript
interface ObservabilityEvent extends Log {
  eventType: 'step_start' | 'step_end' | 'state_op' | 'emit_op' | 'stream_op' 
           | 'correlation_start' | 'correlation_continue'  // 🆕 Correlation events
  traceId: string
  correlationId?: string        // 🆕 Links to logical flow
  parentTraceId?: string        // 🆕 For trace relationships
  stepName: string
  duration?: number
  metadata?: {
    operation?: 'get' | 'set' | 'delete' | 'clear'
    key?: string
    topic?: string
    streamName?: string
    success?: boolean
    correlationContext?: any    // 🆕 Additional correlation data
    correlationMethod?: 'automatic' | 'manual' | 'state-based' | 'event-based'  // 🆕
  }
}
```

## Observability Output Example

### Example: User Registration Flow Execution

When a user registration flow executes, the observability system will capture comprehensive data about each step and operation:

#### Before Execution
```
Flow: user-registration
Status: Not Started
Steps: 0/3 completed
```

#### During Execution - Step 1: validate-user
```
Trace ID: trace_abc123_20241230_143052
Flow: user-registration
Status: Running
Current Step: validate-user (started at 143:052ms)

Step Operations:
├─ 🗄️ state.get('user.email') - 15ms ✓
├─ 🗄️ state.set('validation.status', 'pending') - 8ms ✓  
├─ 🗄️ state.set('validation.result', validationData) - 12ms ✓
└─ 📡 emit('user.validated', userData) → triggers save-user - 5ms ✓

Step Result: ✓ Completed in 95ms
Operations: 3 state, 1 emit, 0 stream
```

#### During Execution - Step 2: save-user
```
Current Step: save-user (started at 143:147ms)

Step Operations:
├─ 🗄️ state.get('validation.result') - 8ms ✓
├─ 🌊 stream.set('users', userId, userData) - 45ms ✓
├─ 🗄️ state.set('user.saved', true) - 10ms ✓
└─ 📡 emit('user.saved', { userId, email }) → triggers send-email - 3ms ✓

Step Result: ✓ Completed in 155ms
Operations: 2 state, 1 emit, 1 stream
```

#### During Execution - Step 3: send-email
```
Current Step: send-email (started at 143:302ms)

Step Operations:
├─ 🗄️ state.get('user.saved') - 5ms ✓
├─ 🌊 stream.set('email-queue', emailId, emailData) - 25ms ✓
└─ 🗄️ state.set('email.queued', true) - 8ms ✓

Step Result: ✓ Completed in 75ms
Operations: 2 state, 0 emit, 1 stream
```

#### Final Observability Data Available
```json
{
  "id": "trace_abc123_20241230_143052",
  "flowName": "user-registration",
  "status": "completed",
  "startTime": 1703943052000,
  "duration": 325,
  "entryPoint": {
    "type": "api",
    "stepName": "validate-user"
  },
  "steps": [
    {
      "name": "validate-user",
      "status": "completed",
      "startTime": 0,
      "duration": 95,
      "operations": { "state": 3, "emit": 1, "stream": 0 }
    },
    {
      "name": "save-user", 
      "status": "completed",
      "startTime": 95,
      "duration": 155,
      "operations": { "state": 2, "emit": 1, "stream": 1 }
    },
    {
      "name": "send-email",
      "status": "completed", 
      "startTime": 250,
      "duration": 75,
      "operations": { "state": 2, "emit": 0, "stream": 1 }
    }
  ],
  "metadata": {
    "totalSteps": 3,
    "completedSteps": 3,
    "errorCount": 0
  }
}
```

#### Timeline Visualization Available
```
user-registration (✓ 325ms) - Started 2 minutes ago

Time → 0ms     100ms    200ms    300ms    400ms
       |       |        |        |
       ┌─────┐
       │█████│ validate-user ✓ 95ms
       └──┬──┘ 🗄️(3) 📡(1) 🌊(0)
          │
          ▼
          ┌──────────────┐
          │██████████████│ save-user ✓ 155ms  
          └──────┬───────┘ 🗄️(2) 📡(1) 🌊(1)
                 │
                 ▼
                 ┌─────────┐
                 │█████████│ send-email ✓ 75ms
                 └─────────┘ 🗄️(2) 📡(0) 🌊(1)

Total Operations: 7 state, 2 emit, 2 stream
Performance: All steps < 200ms ✓
```

#### Available Analytics & Insights
- **Flow Performance**: 325ms total execution time
- **Step Breakdown**: validate-user (29%), save-user (48%), send-email (23%)
- **Operation Distribution**: 7 state operations, 2 emit operations, 2 stream operations
- **Bottleneck Identification**: save-user step took longest due to stream operation
- **Event Flow**: user.validated → user.saved (step-to-step communication tracked)
- **State Usage**: 4 unique state keys accessed across the flow
- **Stream Usage**: 2 streams utilized (users, email-queue)

This comprehensive observability data enables developers to understand exactly what happened during the workflow execution, identify performance bottlenecks, debug issues, and optimize their flows.

### 2. Horizontal Timeline Visualization

#### Timeline Layout Concept
```
Time →  0ms     100ms    250ms    400ms    [ongoing]
        |       |        |        |
StepA   [████]  
        |       
        ├─ 🗄️ StateOp(get): user.email (25ms)
        ├─ 📡 EmitOp: user.validated → StepB
        └─ ✓ Complete: 95ms
                |        
                v        
StepB           [████████]
                |        |
                ├─ 🗄️ StateOp(set): validation.result (15ms)
                ├─ 🌊 StreamOp: users.create (35ms)  
                ├─ 📡 EmitOp: user.saved → StepC
                └─ ✓ Complete: 155ms
                         |
                         v
StepC                    [██████]
                         |      |
                         ├─ 🌊 StreamOp: emails.queue (20ms)
                         └─ ✓ Complete: 75ms
```

#### UI Component Architecture
```
TracesPage
├── TracesList (1/3 width)
│   ├── TraceSearch
│   ├── TraceFilters
│   └── TraceItems[]
│       └── TraceListItem
│           ├── Status Indicator
│           ├── Duration & Steps
│           └── Flow Information
└── TraceTimeline (2/3 width)
    ├── TimelineHeader
    │   ├── TraceMetadata
    │   └── TimeAxis
    └── TimelineBody
        └── StepRow[]
            ├── StepLabel
            ├── StepExecutionBar
            ├── OperationBadges[]
            └── DurationInfo
```

### 3. Real-time Integration Architecture

#### Workbench Flow Status
```
┌─────────────────────────────────────────────────────────────────┐
│                    User Registration Flow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  validate-user ────→ save-user ────→ send-email                 │
│      🟢  2             🟡  1           ⚪  0                     │
│   (2 running)      (1 running)    (waiting)                     │
│                                                                 │
│  📊 Live Stats:                                                 │
│  • Active traces: 3                                             │
│  • Avg duration: 245ms                                         │
│  • Success rate: 98.5%                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Real-time Update Flow
```
Step Execution
      │
      ▼
Enhanced Logging ─────► ObservabilityEvent
      │                        │
      ▼                        ▼
Log Stream ──────────► TraceBuilder
      │                        │
      ▼                        ▼
WebSocket ────────────► UI Updates
      │                        │
      ▼                        ▼
Live Status ──────────► Timeline Animation
```

## Integration Points

### 1. Enhanced Logging Integration
- Extend existing `call-step-file.ts` with structured observability events
- Leverage current logging infrastructure without major changes
- Add operation tracking for state, emit, and stream operations
- Maintain backward compatibility with existing log systems

### 2. TraceBuilder Service
- Aggregate log events into meaningful trace objects
- Maintain in-memory cache of recent traces (LRU eviction)
- Provide real-time updates via WebSocket integration
- Support filtering and search across trace data

### 3. Workbench API Extensions
- Add `/motia/traces` endpoints for trace retrieval
- Integrate with existing Workbench authentication
- Provide real-time trace updates via WebSocket
- Support filtering by flow, status, step, and time range

### 4. UI Component Integration
- New dedicated Traces page in Workbench navigation
- Real-time flow status overlay on existing flow visualizations
- Horizontal timeline component with responsive design
- Integration with existing Workbench design system

## Technical Considerations

### Performance Impact
- **Lightweight Logging**: Leverage existing logging infrastructure with minimal overhead
- **Efficient Aggregation**: Process log events asynchronously in background
- **Smart Rendering**: Virtualized timeline for large traces
- **Memory Management**: LRU cache with configurable size limits

### Scalability Considerations
- **Log-based Architecture**: Scales naturally with existing logging system
- **Incremental Updates**: Real-time updates without full trace recomputation
- **Configurable Retention**: Adjustable trace history limits based on usage
- **Horizontal Scaling**: Stateless TraceBuilder service design

### Developer Experience
- **Intuitive Timeline**: Natural left-to-right execution flow visualization
- **Operation Visibility**: Clear visual indicators for Mota operations
- **Quick Navigation**: Fast filtering and search capabilities
- **Mobile Support**: Responsive design for all device sizes

## Success Metrics

### Technical Metrics
- **Performance Overhead**: <2% impact on step execution time
- **UI Responsiveness**: Timeline renders in <100ms for typical traces
- **Memory Usage**: Trace storage under 50MB for 50 traces

### User Experience Metrics
- **Developer Adoption**: Usage metrics from Workbench analytics
- **Error Detection**: Reduced time to identify workflow issues
- **Debugging Efficiency**: Faster resolution of multi-step workflow problems

## Conclusion

This observability system provides comprehensive visibility into Mota workflows through an intuitive horizontal timeline interface. By leveraging the existing logging infrastructure and focusing on clean, performant UI components, we can deliver powerful debugging and monitoring capabilities with minimal complexity and overhead. The architecture prioritizes simplicity, performance, and developer experience while providing the essential observability features needed for complex workflow debugging. 