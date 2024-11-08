import React from 'react'

import { GameProvider } from './GameContext.js'

import { Box } from 'ink'
import { SCREEN_WIDTH } from './constants.js'
import { ScreenProvider, useScreen } from './ScreenContext.js'
import { GameBoard } from './screens/GameBoard.js'
import { GameOver } from './screens/GameOver.js'
import { MainMenu } from './screens/MainMenu.js'

export default function App({ isMultiplayer }: { isMultiplayer?: boolean }) {
  return (
    <ScreenProvider>
      <GameProvider>
        <Game isMultiplayer={isMultiplayer} />
      </GameProvider>
    </ScreenProvider>
  )
}

const Game = ({ isMultiplayer }: { isMultiplayer?: boolean }) => {
  const { currentScreen } = useScreen()
  return (
    <Box
      width={SCREEN_WIDTH}
      borderStyle={'round'}
      borderDimColor
      padding={1}
      paddingX={3}
    >
      {currentScreen === 'MAIN_MENU' && (
        <MainMenu defaultSelection={isMultiplayer ? 1 : 0} />
      )}
      {currentScreen === 'GAME' && <GameBoard />}
      {currentScreen === 'GAME_OVER' && <GameOver />}
    </Box>
  )
}
