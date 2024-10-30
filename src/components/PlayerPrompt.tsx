import { Text } from 'ink'
import React from 'react'
import { GAME_STATES } from '../constants.js'
import { useGame } from '../GameContext.js'

type PlayerPromptProps = {
  inputValue?: string
}

export const PlayerPrompt = ({ inputValue = '' }: PlayerPromptProps) => {
  const { gameState, currentPlayer } = useGame() 

  const getPromptText = () => {
    if (gameState === GAME_STATES.WAITING_FOR_SOURCE) {
      return `${currentPlayer}'s turn - Select piece (e.g., E3):`
    } else if (gameState === GAME_STATES.WAITING_FOR_TARGET) {
      return `Select destination for piece:`
    }
    return ''
  }

  return (
    <Text>
      {getPromptText()} {inputValue}
    </Text>
  )
}
