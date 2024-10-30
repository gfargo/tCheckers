import React from 'react'

import { GameProvider } from './GameContext.js'

import { ScreenProvider, useScreen } from './ScreenContext.js'
import { GameBoard } from './screens/GameBoard.js'
import { GameOver } from './screens/GameOver.js'
import { MainMenu } from './screens/MainMenu.js'

export default function App({ isMultiplayer }: { isMultiplayer?: boolean }) {
  console.log('App rendered', { isMultiplayer })

  return (
    <ScreenProvider>
      <GameProvider>
        <Game />
      </GameProvider>
    </ScreenProvider>
  )
}

const Game = ({ isMultiplayer }: { isMultiplayer?: boolean }) => {
  const { currentScreen } = useScreen()

  return (
    <>
      {currentScreen === 'MAIN_MENU' && (
        <MainMenu defaultSelection={isMultiplayer ? 1 : 0} />
      )}
      {currentScreen === 'GAME' && <GameBoard />}
      {currentScreen === 'GAME_OVER' && <GameOver />}
    </>
  )
}
