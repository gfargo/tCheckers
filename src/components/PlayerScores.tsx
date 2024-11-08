import chalk from 'chalk'
import { Box, Text } from 'ink'
import React from 'react'
import { PLAYER_COLORS } from '../constants.js'
import { useGame } from '../GameContext.js'

export const PlayerScores = () => {
  const { scores } = useGame()

  const redScore = chalk.red(`Red: ${scores[PLAYER_COLORS.PLAYER_ONE]}`)
  const blueScore = chalk.blue(`Blue: ${scores[PLAYER_COLORS.PLAYER_TWO]}`)

  return (
    <Box>
      <Text>
        {redScore} | {blueScore}
      </Text>
    </Box>
  )
}
