import { MotaStream } from '../types-stream'

export type StreamFactory<TData> = () => MotaStream<TData>
