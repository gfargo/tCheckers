import chalk from 'chalk'
import { Text } from 'ink'
import React from 'react'
import { PLAYER_COLORS } from '../constants.js'
import { useGame } from '../GameContext.js'

export const PlayerScores = () => {
  const { scores } = useGame()

  const redScore = chalk.red(`Red: ${scores[PLAYER_COLORS.PLAYER_ONE]}`)
  const blueScore = chalk.blue(`Blue: ${scores[PLAYER_COLORS.PLAYER_TWO]}`)

  return (
    <Text>
      Scores - {redScore} | {blueScore}
    </Text>
  )
}
