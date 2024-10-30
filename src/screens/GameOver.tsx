import { Box, Text, useInput } from 'ink'
import React from 'react'
import { PlayerColor } from '../constants.js'

interface GameOverProps {
  winner: PlayerColor
  onRestart: () => void
  onQuit: () => void
}

export const GameOver: React.FC<GameOverProps> = ({
  winner,
  onRestart,
  onQuit,
}) => {
  
  useInput((input) => {
    if (input.toLowerCase() === 'r') {
      onRestart()
    } else if (input.toLowerCase() === 'q') {
      onQuit()
    }
  })

  return (
    <Box flexDirection="column" alignItems="center" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={winner}>
          {winner} Wins!
        </Text>
      </Box>
      <Box>
        <Text>Press </Text>
        <Text bold>R</Text>
        <Text> to restart or </Text>
        <Text bold>Q</Text>
        <Text> to quit</Text>
      </Box>
    </Box>
  )
}

