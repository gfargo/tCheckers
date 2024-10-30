import {
  BOARD_SIZE,
  BoardPosition,
  PLAYER_COLORS,
  type PlayerColor,
} from '../constants.js'

// Piece types
export type PieceType = PlayerColor | undefined | null

// Board representation
export type BoardState = PieceType[][]

export function initializeBoard(): BoardState {
  const board: BoardState = new Array(BOARD_SIZE)
    .fill(null)
    .map(() => new Array(BOARD_SIZE).fill(null))

  // Place player one pieces (top of board)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        // @ts-ignore
        board[row][col] = PLAYER_COLORS.PLAYER_ONE
      }
    }
  }

  // Place player two pieces (bottom of board)
  for (let row = BOARD_SIZE - 3; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        // @ts-ignore
        board[row][col] = PLAYER_COLORS.PLAYER_TWO
      }
    }
  }

  return board
}

// Helper to check if a position is valid on the board
export function isValidPosition(position: BoardPosition): boolean {
  const { row, col } = position
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

// Helper to get cell color (for checkerboard pattern)
export function getCellColor(row: number, col: number): 'dark' | 'light' {
  return (row + col) % 2 === 0 ? 'light' : 'dark'
}
