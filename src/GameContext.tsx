import React, { createContext, ReactNode, useContext, useState } from 'react'
import { GAME_STATES, PLAYER_COLORS, PlayerColor } from './constants.js'
import { BoardState, initializeBoard, PieceType } from './helpers/board.js'
import { useScreen } from './ScreenContext.js'

export type MessageState = {
  error: string | null
  success: string | null
}

export interface Move {
  player: PlayerColor
  from: string // Chess notation (e.g., "E3")
  to: string // Chess notation (e.g., "D4")
  captured?: boolean
}

type GameContextType = {
  currentPlayer: PlayerColor
  setCurrentPlayer: (player: PlayerColor) => void

  scores: Record<string, number>
  setScores: (scores: Record<string, number>) => void

  gameMode: 'SINGLE_PLAYER' | 'MULTI_PLAYER'
  setGameMode: (mode: 'SINGLE_PLAYER' | 'MULTI_PLAYER') => void
  boardState: BoardState
  setBoardState: (board: BoardState) => void
  gameState: keyof typeof GAME_STATES
  setGameState: (state: keyof typeof GAME_STATES) => void
  resetGame: (multiplayer?: boolean) => void

  winner: PlayerColor | null
  setWinner: (winner: PlayerColor | null) => void
  checkWinCondition: (board: BoardState) => PlayerColor | null

  moves: Move[]
  setMoves: (moves: Move[]) => void

  messages: MessageState
  clearMessages: () => void
  showError: (error: string) => void
  showSuccess: (success: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { setCurrentScreen} = useScreen()
  const [boardState, setBoardState] = useState<BoardState>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>(
    PLAYER_COLORS.PLAYER_ONE
  )
  const [messages, setMessages] = useState<MessageState>({
    error: null,
    success: null,
  })
  const [scores, setScores] = useState<Record<string, number>>({
    [PLAYER_COLORS.PLAYER_ONE]: 0,
    [PLAYER_COLORS.PLAYER_TWO]: 0,
  })
  const [gameState, setGameState] = useState<keyof typeof GAME_STATES>(
    GAME_STATES.WAITING_FOR_SOURCE
  )
  const [winner, setWinner] = useState<PlayerColor | null>(null)

  const [gameMode, setGameMode] = useState<'SINGLE_PLAYER' | 'MULTI_PLAYER'>(
    'SINGLE_PLAYER'
  )
  const [moves, setMoves] = useState<Move[]>([])

  const clearMessages = () => {
    setMessages({ error: null, success: null })
  }

  const showError = (error: string) => {
    setMessages({ error, success: null })
  }

  const showSuccess = (success: string) => {
    setMessages({ error: null, success })
  }

  const resetGame = (multiplayer = false) => {
    setGameMode(multiplayer ? 'MULTI_PLAYER' : 'SINGLE_PLAYER')
    setBoardState(initializeBoard())
    setCurrentPlayer(PLAYER_COLORS.PLAYER_ONE)
    clearMessages()
    setWinner(null)
    setScores({
      [PLAYER_COLORS.PLAYER_ONE]: 0,
      [PLAYER_COLORS.PLAYER_TWO]: 0,
    })
    setCurrentScreen('GAME')
    setGameState(GAME_STATES.WAITING_FOR_SOURCE)
  }

  const checkWinCondition = (board: BoardState): PlayerColor | null => {
    const redPieces = board
      .flat()
      .filter((piece: PieceType) => piece === PLAYER_COLORS.PLAYER_ONE).length
    const bluePieces = board
      .flat()
      .filter((piece: PieceType) => piece === PLAYER_COLORS.PLAYER_TWO).length

    if (redPieces === 0) return PLAYER_COLORS.PLAYER_TWO
    if (bluePieces === 0) return PLAYER_COLORS.PLAYER_ONE
    return null
  }

  return (
    <GameContext.Provider
      value={{
        gameMode,
        setGameMode,
        currentPlayer,
        setCurrentPlayer,

        scores,
        setScores,

        boardState,
        setBoardState,
        gameState,
        setGameState,
        resetGame,
        winner,
        setWinner,
        checkWinCondition,

        moves,
        setMoves,

        messages,
        clearMessages,
        showError,
        showSuccess,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
