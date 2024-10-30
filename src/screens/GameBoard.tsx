import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'
import { Move, useGame } from '../GameContext.js'
import { useScreen } from '../ScreenContext.js'
import { Board } from '../components/Board.js'
import { CurrentPlayer } from '../components/CurrentPlayer.js'
import { MoveHistory } from '../components/MoveHistory.js'
import { PlayerPrompt } from '../components/PlayerPrompt.js'
import { PlayerScores } from '../components/PlayerScores.js'
import { BOARD_COLORS, BoardPosition, ERROR_MESSAGES, GAME_STATES, notationToPosition, PLAYER_COLORS, PlayerColor, positionToNotation, SUCCESS_MESSAGES } from '../constants.js'
import { generateComputerMove, getCapturedPiecePosition, getValidMoves, isCaptureMove, isValidMove } from '../helpers/moves.js'

export const GameBoard = () => {
  const {
    gameMode,
    boardState,
    setBoardState,
    currentPlayer,
    messages,
    gameState,
    setGameState,
    showError,
    showSuccess,
    clearMessages,
    scores,
    setScores,
    setCurrentPlayer,
    moves,
    setMoves,
    checkWinCondition,
    setWinner,
  } = useGame()
  const { setCurrentScreen } = useScreen()

  const [selectedPosition, setSelectedPosition] =
    useState<BoardPosition | null>(null)
  const [validMoves, setValidMoves] = useState<BoardPosition[]>([])

  const [inputValue, setInputValue] = useState('')

  const handleValidMove = (position: BoardPosition) => {
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

  const handleMove = (targetPosition: BoardPosition) => {
    if (!selectedPosition) return

    const makeMove = (
      from: BoardPosition,
      to: BoardPosition,
      player: PlayerColor
    ) => {
      const newBoard = [...boardState.map((row) => [...row])]

      // @ts-ignore
      newBoard[to.row][to.col] = player
      // @ts-ignore
      newBoard[from.row][from.col] = null

      // Record move
      const isCapture = isCaptureMove(from, to)
      const move: Move = {
        player: player,
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
          const currentScore = scores[player] || 0
          // Update score
          setScores({
            ...scores,
            [player]: currentScore + 1,
          })
        }
      }

      setBoardState(newBoard)
      setMoves([...moves, move])
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
          player === PLAYER_COLORS.PLAYER_ONE
            ? PLAYER_COLORS.PLAYER_TWO
            : PLAYER_COLORS.PLAYER_ONE
        )
      }
    }

    makeMove(selectedPosition, targetPosition, currentPlayer)

    // If it's single player mode and it's the computer's turn after the player's move, generate a move
    if (
      gameMode !== 'MULTI_PLAYER' &&
      currentPlayer === PLAYER_COLORS.PLAYER_ONE
    ) {
      setTimeout(() => {
        const computerMove = generateComputerMove(boardState)
        console.log('Computer move:', computerMove)

        // if (computerMove) {
        //   makeMove(computerMove.from, computerMove.to, PLAYER_COLORS.PLAYER_TWO)
        // }
      }, 2000) // Add a 1-second delay for the computer's move
    }
  }

  useInput((input, key) => {
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
  })

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <PlayerScores />
      </Box>
      <Box>
        <Box flexDirection="column">
          <CurrentPlayer />
          <Board
            board={boardState}
            currentPlayer={currentPlayer}
            selectedPosition={selectedPosition}
            validMoves={validMoves}
            inputValue={inputValue}
            isSelectingTarget={gameState === GAME_STATES.WAITING_FOR_TARGET}
          />
          <Box marginTop={1} flexDirection="column">
            <PlayerPrompt inputValue={inputValue} />

            {messages.error && (
              <Text color={BOARD_COLORS.ERROR}>⚠ {messages.error}</Text>
            )}
            {messages.success && (
              <Text color={BOARD_COLORS.SUCCESS}>✓ {messages.success}</Text>
            )}
          </Box>
        </Box>
        <MoveHistory />
      </Box>
    </Box>
  )
}
