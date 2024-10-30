import React, { createContext, ReactNode, useContext, useState } from 'react'

export type AppScreen = 'MAIN_MENU' | 'GAME' | 'GAME_OVER'

type ScreenContextType = {
  currentScreen: AppScreen
  setCurrentScreen: (screen: AppScreen) => void
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined)

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('MAIN_MENU')

  return (
    <ScreenContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </ScreenContext.Provider>
  )
}

export const useScreen = () => {
  const context = useContext(ScreenContext)
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider')
  }
  return context
}
