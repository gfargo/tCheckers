// Player colors
export const PLAYER_COLORS = {
  PLAYER_ONE: 'red',
  PLAYER_TWO: 'blue',
} as const

// Board colors
export const BOARD_COLORS = {
  DARK_CELL: 'gray',
  LIGHT_CELL: 'white',
  SELECTED: 'yellow', // Color for selected piece
  VALID_MOVE: 'green', // Color for squares piece can move to
  HOVER: 'cyan', // Color when hovering/highlighting during input
  DISABLED: 'blackBright', // Color for squares that can't be moved to
  ERROR: 'red', // Color for error messages
  SUCCESS: 'green', // Color for success messages
} as const

// Game states
export const GAME_STATES = {
  WAITING_FOR_SOURCE: 'WAITING_FOR_SOURCE', // Waiting for source coordinate input
  WAITING_FOR_TARGET: 'WAITING_FOR_TARGET', // Waiting for target coordinate input
  MOVING_PIECE: 'MOVING_PIECE', // Processing the move
  GAME_OVER: 'GAME_OVER',
} as const

// Error messages
export const ERROR_MESSAGES = {
  INVALID_FORMAT:
    'Invalid format. Please use a letter (A-H) followed by a number (1-8), e.g., "E3"',
  NO_PIECE: 'There is no piece at the selected position',
  WRONG_PIECE: 'That piece belongs to your opponent',
  INVALID_MOVE: 'That move is not valid for this piece',
  OUT_OF_BOUNDS: 'That position is outside the board',
  BLOCKED_MOVE: 'That move is blocked by another piece',
  MUST_CAPTURE: 'You must capture when possible',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PIECE_SELECTED: 'Piece selected! Choose a highlighted square to move to',
  VALID_MOVE: 'Valid move! Press Enter to confirm',
  CAPTURE_AVAILABLE: 'Capture move available!',
} as const

// Board notation
export const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const ROW_LABELS = ['8', '7', '6', '5', '4', '3', '2', '1']

// Game constants
export const BOARD_SIZE = 8

// Movement constants
export const MOVE_DIRECTIONS = {
  PLAYER_ONE: [
    [1, -1],
    [1, 1],
  ], // Down-left, Down-right
  PLAYER_TWO: [
    [-1, -1],
    [-1, 1],
  ], // Up-left, Up-right
} as const

// Types
export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS]
export type CellColor = (typeof BOARD_COLORS)[keyof typeof BOARD_COLORS]
export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES]
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES]
export type SuccessMessage =
  (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES]

// Position type for selected squares and moves
export type BoardPosition = {
  row: number
  col: number
}

// Input state type
export type InputState = {
  value: string
  error: ErrorMessage | null
  success: SuccessMessage | null
  valid: boolean
}

// Helper functions
export function notationToPosition(notation: string): BoardPosition | null {
  if (notation.length !== 2) return null

  const col = notation[0]
    ? COLUMN_LABELS.indexOf(notation[0].toUpperCase())
    : -1
  const row = notation[1] ? ROW_LABELS.indexOf(notation[1]) : -1

  if (col === -1 || row === -1) return null

  return { row, col }
}

export function positionToNotation(position: BoardPosition): string {
  // @ts-ignore
  return COLUMN_LABELS[position.col] + ROW_LABELS[position.row]
}
