import chalk from 'chalk'
import { Text } from 'ink'
import React from 'react'
import { PLAYER_COLORS } from '../constants.js'
import { useGame } from '../GameContext.js'

export const CurrentPlayer = () => {
  const { currentPlayer } = useGame()

  const coloredPlayer =
    currentPlayer === PLAYER_COLORS.PLAYER_ONE
      ? chalk.red('Red')
      : chalk.blue('Blue')

  return <Text>Current Player: {coloredPlayer}</Text>
}
