import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'
import { Board } from './components/Board.js'
import { Move, MoveHistory } from './components/MoveHistory.js'
import {
  BOARD_COLORS,
  ERROR_MESSAGES,
  ErrorMessage,
  GAME_STATES,
  notationToPosition,
  PLAYER_COLORS,
  PlayerColor,
  Position,
  positionToNotation,
  SUCCESS_MESSAGES,
  SuccessMessage,
} from './constants.js'
import { BoardState, initializeBoard, PieceType } from './helpers/board.js'
import {
  getCapturedPiecePosition,
  getValidMoves,
  isCaptureMove,
  isValidMove,
} from './helpers/moves.js'
import { GameOver } from './screens/GameOver.js'
import { MainMenu } from './screens/MainMenu.js'

type AppScreen = 'MAIN_MENU' | 'GAME' | 'GAME_OVER'

type MessageState = {
  error: ErrorMessage | null
  success: SuccessMessage | null
}

export default function App({ isMultiplayer }: { isMultiplayer?: boolean }) {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('MAIN_MENU')
  const [menuSelection, setMenuSelection] = useState(0)

  console.log('isMultiplayer', isMultiplayer)

  // Game state
  const [boardState, setBoardState] = useState<BoardState>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>(
    PLAYER_COLORS.PLAYER_ONE
  )
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  )
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameState, setGameState] = useState<keyof typeof GAME_STATES>(
    GAME_STATES.WAITING_FOR_SOURCE
  )
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<MessageState>({
    error: null,
    success: null,
  })
  const [winner, setWinner] = useState<PlayerColor | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [scores, setScores] = useState({
    [PLAYER_COLORS.PLAYER_ONE]: 0,
    [PLAYER_COLORS.PLAYER_TWO]: 0,
  })

  const clearMessages = () => {
    setMessages({ error: null, success: null })
  }

  const showError = (error: ErrorMessage) => {
    setMessages({ error, success: null })
  }

  const showSuccess = (success: SuccessMessage) => {
    setMessages({ error: null, success })
  }

  const resetGame = () => {
    setBoardState(initializeBoard())
    setCurrentPlayer(PLAYER_COLORS.PLAYER_ONE)
    setSelectedPosition(null)
    setValidMoves([])
    setGameState(GAME_STATES.WAITING_FOR_SOURCE)
    setInputValue('')
    clearMessages()
    setWinner(null)
    setMoves([])
    setCurrentScreen('GAME')
  }

  const checkWinCondition = (board: BoardState): PlayerColor | null => {
    const redPieces = board
      .flat()
      .filter(
        (piece: PieceType): piece is PieceType =>
          piece === PLAYER_COLORS.PLAYER_ONE
      ).length
    const bluePieces = board
      .flat()
      .filter((piece: PieceType) => piece === PLAYER_COLORS.PLAYER_TWO).length

    if (redPieces === 0) return PLAYER_COLORS.PLAYER_TWO
    if (bluePieces === 0) return PLAYER_COLORS.PLAYER_ONE
    return null
  }

  // const validateSourceInput = (input: string): ErrorMessage | null => {
  //   const position = notationToPosition(input)
  //   if (!position) {
  //     return ERROR_MESSAGES.INVALID_FORMAT
  //   }
  //   if (
  //     position.row < 0 ||
  //     position.row >= 8 ||
  //     position.col < 0 ||
  //     position.col >= 8
  //   ) {
  //     return ERROR_MESSAGES.OUT_OF_BOUNDS
  //   }

  //   // @ts-ignore
  //   if (!boardState[position.row][position.col]) {
  //     return ERROR_MESSAGES.NO_PIECE
  //   }

  //   // @ts-ignore
  //   if (boardState[position.row][position.col] !== currentPlayer) {
  //     return ERROR_MESSAGES.WRONG_PIECE
  //   }
  //   return null
  // }

  // const validateTargetInput = (input: string): ErrorMessage | null => {
  //   const position = notationToPosition(input)
  //   if (!position) return ERROR_MESSAGES.INVALID_FORMAT
  //   if (
  //     position.row < 0 ||
  //     position.row >= 8 ||
  //     position.col < 0 ||
  //     position.col >= 8
  //   )
  //     return ERROR_MESSAGES.OUT_OF_BOUNDS
  //   if (
  //     !selectedPosition ||
  //     !isValidMove(boardState, selectedPosition, position, currentPlayer)
  //   )
  //     return ERROR_MESSAGES.INVALID_MOVE
  //   return null
  // }

  const generateComputerMove = (): { from: Position; to: Position } | null => {
    const computerPieces: Position[] = []

    // Find all computer pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // @ts-ignore
        if (boardState[row][col] === PLAYER_COLORS.PLAYER_TWO) {
          computerPieces.push({ row, col })
        }
      }
    }

    // Shuffle the pieces to add randomness
    for (let i = computerPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      // @ts-ignore
      ;[computerPieces[i], computerPieces[j]] = [
        computerPieces[j],
        computerPieces[i],
      ]
    }

    // Find a valid move
    for (const piece of computerPieces) {
      const validMoves = getValidMoves(
        boardState,
        piece,
        PLAYER_COLORS.PLAYER_TWO
      )
      if (validMoves.length > 0) {
        const randomMove =
          validMoves[Math.floor(Math.random() * validMoves.length)]
        if (randomMove) {
          return { from: piece, to: randomMove }
        }
      }
    }

    return null // No valid moves found
  }

  const handleValidMove = (position: Position) => {
    const moves = getValidMoves(boardState, position, currentPlayer)
    setSelectedPosition(position)
    setValidMoves(moves)
    setGameState(GAME_STATES.WAITING_FOR_TARGET)
    setInputValue('')

    // Check if any captures are available
    const hasCapture = moves.some((move) => isCaptureMove(position, move))

    showSuccess(
      hasCapture
        ? SUCCESS_MESSAGES.CAPTURE_AVAILABLE
        : SUCCESS_MESSAGES.PIECE_SELECTED
    )
  }

  const handleMove = (targetPosition: Position) => {
    if (!selectedPosition) return

    const makeMove = (from: Position, to: Position) => {
      const newBoard = [...boardState.map((row) => [...row])]

      // @ts-ignore
      newBoard[to.row][to.col] = newBoard[from.row][from.col]
      // @ts-ignore
      newBoard[from.row][from.col] = null

      // Record move
      const isCapture = isCaptureMove(from, to)
      const move: Move = {
        player: currentPlayer,
        from: positionToNotation(from),
        to: positionToNotation(to),
        captured: isCapture,
      }

      // Handle captures
      if (isCapture) {
        const capturedPos = getCapturedPiecePosition(from, to)
        if (capturedPos) {
          // @ts-ignore
          newBoard[capturedPos.row][capturedPos.col] = null
          // Update score
          setScores((prev) => ({
            ...prev,
            [currentPlayer]: prev[currentPlayer] + 1,
          }))
        }
      }

      setBoardState(newBoard)
      setMoves((prevMoves) => [...prevMoves, move])
      setSelectedPosition(null)
      setValidMoves([])
      setGameState(GAME_STATES.WAITING_FOR_SOURCE)
      setInputValue('')
      clearMessages()

      // Check for win condition
      const winner = checkWinCondition(newBoard)
      if (winner) {
        setWinner(winner)
        setCurrentScreen('GAME_OVER')
      } else {
        setCurrentPlayer(
          currentPlayer === PLAYER_COLORS.PLAYER_ONE
            ? PLAYER_COLORS.PLAYER_TWO
            : PLAYER_COLORS.PLAYER_ONE
        )
      }
    }

    makeMove(selectedPosition, targetPosition)

    // If it's single player mode and the computer's turn, generate a move
    if (!isMultiplayer && currentPlayer === PLAYER_COLORS.PLAYER_ONE) {
      setTimeout(() => {
        const computerMove = generateComputerMove()
        if (computerMove) {
          makeMove(computerMove.from, computerMove.to)
        }
      }, 1000) // Add a 1-second delay for the computer's move
    }
  }

  useInput((input, key) => {
    if (currentScreen === 'MAIN_MENU') {
      if (key.upArrow) {
        setMenuSelection((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (key.downArrow) {
        setMenuSelection((prev) => (prev < 2 ? prev + 1 : prev))
      } else if (key.return) {
        if (menuSelection === 0) resetGame()
        else if (menuSelection === 2) process.exit()
      }
    } else if (currentScreen === 'GAME') {
      if (key.return) {
        if (gameState === GAME_STATES.WAITING_FOR_SOURCE) {
          const position = notationToPosition(inputValue)
          if (!position) {
            showError(ERROR_MESSAGES.INVALID_FORMAT)
            return
          }

          if (
            // @ts-ignore
            !boardState[position.row][position.col] as
              | PlayerColor
              | null
              | boolean
          ) {
            showError(ERROR_MESSAGES.NO_PIECE)
            return
          }
          if (
            // @ts-ignore
            (boardState[position.row][position.col] as PlayerColor) !==
            currentPlayer
          ) {
            showError(ERROR_MESSAGES.WRONG_PIECE)
            return
          }
          handleValidMove(position)
        } else if (gameState === GAME_STATES.WAITING_FOR_TARGET) {
          const position = notationToPosition(inputValue)
          if (!position) {
            showError(ERROR_MESSAGES.INVALID_FORMAT)
            return
          }
          if (
            !selectedPosition ||
            !isValidMove(boardState, selectedPosition, position, currentPlayer)
          ) {
            showError(ERROR_MESSAGES.INVALID_MOVE)
            return
          }
          handleMove(position)
          clearMessages()
        }
      } else if (key.escape) {
        setSelectedPosition(null)
        setValidMoves([])
        setGameState(GAME_STATES.WAITING_FOR_SOURCE)
        setInputValue('')
        clearMessages()
      } else if (key.backspace || key.delete) {
        setInputValue((prev) => prev.slice(0, -1))
      } else if (input.match(/^[A-Ha-h1-8]$/)) {
        if (inputValue.length < 2) {
          setInputValue((prev) => prev + input.toUpperCase())
        }
      }
    } else if (currentScreen === 'GAME_OVER') {
      if (input.toLowerCase() === 'r') resetGame()
      else if (input.toLowerCase() === 'q') setCurrentScreen('MAIN_MENU')
    }
  })

  const getPromptText = () => {
    if (gameState === GAME_STATES.WAITING_FOR_SOURCE) {
      return `${currentPlayer}'s turn - Select piece (e.g., E3):`
    } else if (gameState === GAME_STATES.WAITING_FOR_TARGET) {
      return `Select destination for piece:`
    }
    return ''
  }

  if (currentScreen === 'MAIN_MENU') {
    return (
      <MainMenu
        onStartSinglePlayer={resetGame}
        onStartMultiPlayer={() => {
          console.log('Starting multiplayer game')
          resetGame()
        }}
        onQuit={() => process.exit()}
        selectedOption={menuSelection}
      />
    )
  }

  if (currentScreen === 'GAME_OVER' && winner) {
    return (
      <GameOver
        winner={winner}
        onRestart={resetGame}
        onQuit={() => setCurrentScreen('MAIN_MENU')}
      />
    )
  }

  if (currentScreen === 'GAME') {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text>
            Scores - Red: {scores[PLAYER_COLORS.PLAYER_ONE]} Blue:{' '}
            {scores[PLAYER_COLORS.PLAYER_TWO]}
          </Text>
        </Box>
        <Box>
          <Box flexDirection="column">
            <Text>Current Player: {currentPlayer}</Text>
            <Board
              board={boardState}
              currentPlayer={currentPlayer}
              selectedPosition={selectedPosition}
              validMoves={validMoves}
              inputValue={inputValue}
              isSelectingTarget={gameState === GAME_STATES.WAITING_FOR_TARGET}
            />
            <Box marginTop={1} flexDirection="column">
              <Text>
                {getPromptText()} {inputValue}
              </Text>
              {messages.error && (
                <Text color={BOARD_COLORS.ERROR}>⚠ {messages.error}</Text>
              )}
              {messages.success && (
                <Text color={BOARD_COLORS.SUCCESS}>✓ {messages.success}</Text>
              )}
            </Box>
          </Box>
          <MoveHistory moves={moves} />
        </Box>
      </Box>
    )
  }

  return null
}
