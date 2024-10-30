import {
  BOARD_SIZE,
  BoardPosition,
  MOVE_DIRECTIONS,
  PLAYER_COLORS,
  PlayerColor,
} from '../constants.js'
import { BoardState } from './board.js'

// Helper to check if a position is within board bounds
function isWithinBounds(position: BoardPosition): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  )
}

// Get the position of a captured piece between two positions
export function getCapturedPiecePosition(
  from: BoardPosition,
  to: BoardPosition
): BoardPosition | null {
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // Must be a two-square move for capture
  if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) {
    return null
  }

  return {
    row: from.row + rowDiff / 2,
    col: from.col + colDiff / 2,
  }
}

export function getValidMoves(
  board: BoardState,
  position: BoardPosition,
  playerColor: PlayerColor
): BoardPosition[] {
  const validMoves: BoardPosition[] = []
  const directions =
    playerColor === PLAYER_COLORS.PLAYER_ONE
      ? MOVE_DIRECTIONS.PLAYER_ONE
      : MOVE_DIRECTIONS.PLAYER_TWO

  // Check each possible direction
  for (const [deltaRow, deltaCol] of directions) {
    // Regular move
    const regularMove: BoardPosition = {
      row: position.row + deltaRow,
      col: position.col + deltaCol,
    }

    if (
      isWithinBounds(regularMove) &&
      // @ts-ignore
      board[regularMove.row][regularMove.col] === null
    ) {
      validMoves.push(regularMove)
    }

    // Capture move
    const captureMove: BoardPosition = {
      row: position.row + deltaRow * 2,
      col: position.col + deltaCol * 2,
    }

    if (isWithinBounds(captureMove)) {
      const capturedPos = getCapturedPiecePosition(position, captureMove)
      if (
        capturedPos &&
        // @ts-ignore
        board[captureMove.row][captureMove.col] === null &&
        // @ts-ignore
        board[capturedPos.row][capturedPos.col] !== null &&
        // @ts-ignore
        board[capturedPos.row][capturedPos.col] !== playerColor
      ) {
        validMoves.push(captureMove)
      }
    }
  }

  return validMoves
}

export function isValidMove(
  board: BoardState,
  from: BoardPosition,
  to: BoardPosition,
  playerColor: PlayerColor
): boolean {
  const validMoves = getValidMoves(board, from, playerColor)
  return validMoves.some((move) => move.row === to.row && move.col === to.col)
}

// Check if a move is a capture move
export function isCaptureMove(from: BoardPosition, to: BoardPosition): boolean {
  return Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2
}

export const generateComputerMove = (
  currentBoardState: BoardState
): { from: BoardPosition; to: BoardPosition } | null => {
  const computerPieces: BoardPosition[] = []

  // Find all computer pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // @ts-ignore
      if (currentBoardState[row][col] === PLAYER_COLORS.PLAYER_TWO) {
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
      currentBoardState,
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