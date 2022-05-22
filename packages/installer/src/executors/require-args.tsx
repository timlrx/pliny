import { Box, Text, Newline, useApp } from 'ink'
import * as React from 'react'
import { EnterToContinue } from '../components/enter-to-continue'
import { useEnterToContinue } from '../utils/use-enter-to-continue'
import { useUserInput } from '../utils/use-user-input'
import { RecipeCLIArgs } from '../types'
import { Executor, executorArgument, ExecutorConfig, getExecutorArgument } from './executor'

export type RequiredArg = {
  name: string
  description: string
}

export interface Config extends ExecutorConfig {
  args: executorArgument<RequiredArg[]>
}

export const type = 'require-args'

const validateArgs = (requiredArgs: RequiredArg[], inputArgs: RecipeCLIArgs): RequiredArg[] => {
  const inputArgsName = new Set(Object.keys(inputArgs))
  return requiredArgs.filter((args) => {
    return !inputArgsName.has(args.name)
  })
}

export const Commit: Executor['Commit'] = ({ cliArgs, cliFlags, onChangeCommitted, step }) => {
  const userInput = useUserInput(cliFlags)
  const generatorArgs = React.useMemo(
    () => ({
      args: getExecutorArgument((step as Config).args, cliArgs),
      stepName: getExecutorArgument((step as Config).stepName, cliArgs),
    }),
    [cliArgs, step]
  )
  const [changeCommited, setChangeCommited] = React.useState(false)

  const handleChangeCommitted = React.useCallback(() => {
    setChangeCommited(true)
    onChangeCommitted(generatorArgs.stepName)
  }, [onChangeCommitted, generatorArgs])

  const childProps: CommitChildProps = {
    changeCommited,
    generatorArgs,
    handleChangeCommitted,
    cliArgs,
  }

  if (userInput) return <CommitWithInput {...childProps} />
  else return <CommitWithoutInput {...childProps} />
}

interface CommitChildProps {
  changeCommited: boolean
  generatorArgs: {
    args: RequiredArg[]
    stepName: string
  }
  handleChangeCommitted: () => void
  cliArgs: RecipeCLIArgs
}

const CommitWithInput = ({
  changeCommited,
  generatorArgs,
  handleChangeCommitted,
  cliArgs,
}: CommitChildProps) => {
  useEnterToContinue(handleChangeCommitted, !changeCommited)
  const { exit } = useApp()
  const unspecifiedArgs = validateArgs(generatorArgs.args, cliArgs)
  const requiredNames = generatorArgs.args.map((arg) => arg.name).join(', ')

  React.useEffect(() => {
    if (unspecifiedArgs.length !== 0) {
      const display = unspecifiedArgs.map((args) => `${args.name}: ${args.description}`).join('\n')
      exit(new Error(`The following required arguments are missing: \n${display}`))
    }
  })

  return (
    <Box flexDirection="column">
      <Text>Checking required arguments...</Text>
      {unspecifiedArgs.length === 0 && <Text>Using {requiredNames} in recipe...</Text>}
      <EnterToContinue />
    </Box>
  )
}

const CommitWithoutInput = ({
  changeCommited,
  generatorArgs,
  handleChangeCommitted,
  cliArgs,
}: CommitChildProps) => {
  const { exit } = useApp()
  const unspecifiedArgs = validateArgs(generatorArgs.args, cliArgs)
  const requiredNames = generatorArgs.args.map((arg) => arg.name).join(', ')

  React.useEffect(() => {
    if (!changeCommited) {
      handleChangeCommitted()
    }
  }, [changeCommited, handleChangeCommitted])

  React.useEffect(() => {
    if (unspecifiedArgs.length !== 0) {
      const display = unspecifiedArgs.map((args) => `${args.name}: ${args.description}`).join('\n')
      exit(new Error(`The following required arguments are missing: \n${display}`))
    }
  })

  return (
    <Box flexDirection="column">
      <Text>Checking required arguments...</Text>
      {unspecifiedArgs.length === 0 && <Text>Using {requiredNames} in recipe...</Text>}
    </Box>
  )
}
