/* eslint-disable @typescript-eslint/no-empty-function */
import { expect, describe, it } from 'vitest'
import { render } from 'ink-testing-library'
import React from 'react'
import stripAnsi from 'strip-ansi'
import { Commit as PrintMessageExecutor } from '../../src/executors/print-message-executor'

describe.skip('Executor', () => {
  const executorConfig = {
    stepId: 'printMessage',
    stepName: 'Print message',
    stepType: 'print-message',
    explanation: 'Testing text for a print message',
    message: 'My message',
  }
  it('should render PrintMessageExecutor', () => {
    const { lastFrame } = render(
      <PrintMessageExecutor
        cliArgs={{}}
        cliFlags={{ yesToAll: false }}
        onChangeCommitted={() => {}}
        step={executorConfig}
      />
    )

    expect(stripAnsi(lastFrame() as string)).toMatchSnapshot()
  })

  it('should contain a step name and explanation', () => {
    const { frames } = render(
      <PrintMessageExecutor
        cliArgs={{}}
        cliFlags={{ yesToAll: false }}
        onChangeCommitted={() => {}}
        step={executorConfig}
      />
    )

    expect(frames[0].includes('My message')).toBeTruthy()
  })
})
