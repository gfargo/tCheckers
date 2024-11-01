import { Text } from 'ink'
import React from 'react'
import { BOARD_COLORS } from '../constants.js'
import { useGame } from '../GameContext.js'

export const GameMessages = () => {
  const { messages } = useGame()

  return (
    <>
      {messages.error && (
        <Text color={BOARD_COLORS.ERROR}>⚠ {messages.error}</Text>
      )}
      {messages.success && (
        <Text color={BOARD_COLORS.SUCCESS}>✓ {messages.success}</Text>
      )}
    </>
  )
}
