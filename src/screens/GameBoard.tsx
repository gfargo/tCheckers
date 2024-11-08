import { Box, useInput } from 'ink'
import React, { useCallback, useEffect, useState } from 'react'
import { Move, useGame } from '../GameContext.js'
import { useScreen } from '../ScreenContext.js'
import { Board } from '../components/Board.js'
import { CurrentPlayer } from '../components/CurrentPlayer.js'
import { GameMessages } from '../components/GameMessages.js'
import { MoveHistory } from '../components/MoveHistory.js'
import { PlayerPrompt } from '../components/PlayerPrompt.js'
import { PlayerScores } from '../components/PlayerScores.js'
import {
  BoardPosition,
  ERROR_MESSAGES,
  GAME_STATES,
  notationToPosition,
  PLAYER_COLORS,
  PlayerColor,
  positionToNotation,
  SCREEN_WIDTH,
  SUCCESS_MESSAGES,
} from '../constants.js'
import {
  generateComputerMove,
  getCapturedPiecePosition,
  getValidMoves,
  isCaptureMove,
  isValidMove,
} from '../helpers/moves.js'

export const GameBoard = () => {
  const {
    gameMode,
    boardState,
    setBoardState,
    currentPlayer,
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

  useEffect(() => {
    if (
      gameMode !== 'MULTI_PLAYER' &&
      currentPlayer === PLAYER_COLORS.PLAYER_TWO
    ) {
      handleAIMove()
    }
  }, [currentPlayer, gameMode])

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

  const handleMove = useCallback(
    (targetPosition: BoardPosition) => {
      if (!selectedPosition) {
        return
      }

      makeMove(selectedPosition, targetPosition, currentPlayer)
    },
    [selectedPosition, currentPlayer]
  )

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
      showSuccess(SUCCESS_MESSAGES.GAME_OVER)
      setCurrentScreen('GAME_OVER')
    } else {
      // Alternate player turn
      const nextPlayer =
        player === PLAYER_COLORS.PLAYER_ONE
          ? PLAYER_COLORS.PLAYER_TWO
          : PLAYER_COLORS.PLAYER_ONE
      setCurrentPlayer(nextPlayer)
    }
  }

  const handleAIMove = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.COMPUTER_THINKING)
    setTimeout(() => {
      const computerMove = generateComputerMove(boardState)
      if (computerMove) {
        makeMove(computerMove.from, computerMove.to, PLAYER_COLORS.PLAYER_TWO)
      }
    }, 1000) // Add a 2-second delay for the computer's move
  }, [boardState])

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
    <Box flexDirection="column" width={SCREEN_WIDTH}>
      <Box width={'100%'} justifyContent="space-between">
        <PlayerScores />
        <CurrentPlayer />
      </Box>
      <Box width={'100%'} justifyContent="space-between">
        <Box flexDirection="column" width={'70%'}>
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
            <GameMessages />
          </Box>
        </Box>
        <Box width={'30%'}>
          <MoveHistory />
        </Box>
      </Box>
    </Box>
  )
}
