import React from 'react'
import { BaseNode, NoopNodeProps } from '@imoogle/workbench'
import { Button } from '@imoogle/ui'

/**
 * For more information on how to override UI nodes, check documentation https://www.mota.imoogle.com/docs/workbench/ui-steps
 */
export const Node: React.FC<NoopNodeProps> = (data) => {
  const start = () => {
    fetch('/default', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return (
    <BaseNode title="Start" variant="noop" {...data} disableTargetHandle>
      <Button data-testid="start-flow-button" onClick={start}>
        Start Flow
      </Button>
    </BaseNode>
  )
}
