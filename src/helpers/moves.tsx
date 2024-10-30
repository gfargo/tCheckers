import {
  BOARD_SIZE,
  MOVE_DIRECTIONS,
  PLAYER_COLORS,
  PlayerColor,
  Position,
} from '../constants.js'
import { BoardState } from './board.js'

// Helper to check if a position is within board bounds
function isWithinBounds(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  )
}

// Get the position of a captured piece between two positions
export function getCapturedPiecePosition(
  from: Position,
  to: Position
): Position | null {
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
  position: Position,
  playerColor: PlayerColor
): Position[] {
  const validMoves: Position[] = []
  const directions =
    playerColor === PLAYER_COLORS.PLAYER_ONE
      ? MOVE_DIRECTIONS.PLAYER_ONE
      : MOVE_DIRECTIONS.PLAYER_TWO

  // Check each possible direction
  for (const [deltaRow, deltaCol] of directions) {
    // Regular move
    const regularMove: Position = {
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
    const captureMove: Position = {
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
  from: Position,
  to: Position,
  playerColor: PlayerColor
): boolean {
  const validMoves = getValidMoves(board, from, playerColor)
  return validMoves.some((move) => move.row === to.row && move.col === to.col)
}

// Check if a move is a capture move
export function isCaptureMove(from: Position, to: Position): boolean {
  return Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2
}
