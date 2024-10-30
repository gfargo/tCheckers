import { Box, Text, useInput } from 'ink'
import React from 'react'
import { useGame } from '../GameContext.js'
import { useScreen } from '../ScreenContext.js'

interface GameOverProps {}

export const GameOver: React.FC<GameOverProps> = ({}) => {
  const { setCurrentScreen } = useScreen()
  const { resetGame, gameMode, winner } = useGame()

  useInput((input) => {
    if (input.toLowerCase() === 'r') {
      resetGame(gameMode === 'MULTI_PLAYER')
    } else if (input.toLowerCase() === 'q') {
      setCurrentScreen('MAIN_MENU')
    }
  })

  return (
    <Box flexDirection="column" alignItems="center" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={winner as string}>
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
