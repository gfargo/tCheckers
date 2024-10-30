import { Box, Text } from 'ink'
import React from 'react'
import {
    BOARD_COLORS,
    COLUMN_LABELS,
    PLAYER_COLORS,
    PlayerColor,
    Position,
    ROW_LABELS,
} from '../constants.js'
import { BoardState, getCellColor } from '../helpers/board.js'

interface BoardProps {
  board: BoardState
  currentPlayer: PlayerColor
  selectedPosition: Position | null
  validMoves: Position[]
  inputValue: string
  isSelectingTarget: boolean
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  selectedPosition,
  validMoves,
  inputValue,
  isSelectingTarget,
}) => {
  const getCellBackground = (row: number, col: number) => {
    // Input highlighting
    const inputCol = inputValue[0]?.toUpperCase()
    const inputRow = inputValue[1]
    const isColHighlighted = COLUMN_LABELS[col] === inputCol
    const isRowHighlighted = ROW_LABELS[row] === inputRow

    // Show highlighting during input with different styles for source vs target
    if (inputValue && (isColHighlighted || isRowHighlighted)) {
      // Dim the highlight for invalid target positions
      if (
        isSelectingTarget &&
        !validMoves.some((move) => move.row === row && move.col === col)
      ) {
        return BOARD_COLORS.DISABLED
      }
      return BOARD_COLORS.HOVER
    }

    // Selected piece
    if (selectedPosition?.row === row && selectedPosition?.col === col) {
      return BOARD_COLORS.SELECTED
    }

    // Valid moves
    if (validMoves.some((move) => move.row === row && move.col === col)) {
      return BOARD_COLORS.VALID_MOVE
    }

    // Default cell color
    return getCellColor(row, col) === 'dark'
      ? BOARD_COLORS.DARK_CELL
      : BOARD_COLORS.LIGHT_CELL
  }

  const getCellContent = (piece: string | null, row: number, col: number) => {
    if (!piece) {
      // Show dots for valid moves
      if (validMoves.some((move) => move.row === row && move.col === col)) {
        return ' • '
      }
      return '   '
    }

    const isPlayerOne = piece === PLAYER_COLORS.PLAYER_ONE
    // Add visual indicator for current player's pieces during source selection
    if (!isSelectingTarget && piece === currentPlayer) {
      return isPlayerOne ? ' ♦ ' : ' ♢ ' // Filled/hollow diamonds for selectable pieces
    }

    return isPlayerOne ? ' ● ' : ' ○ ' // Filled/hollow circles for pieces
  }

  return (
    <Box flexDirection="column" borderStyle="single" padding={1}>
      {/* Column labels */}
      <Box marginLeft={2}>
        <Text> </Text>
        {COLUMN_LABELS.map((label) => (
          <Box key={label} width={3}>
            <Text bold>{label}</Text>
          </Box>
        ))}
      </Box>

      {/* Board with row labels */}
      {board.map((row, rowIndex) => (
        <Box key={rowIndex}>
          <Box width={2}>
            <Text bold>{ROW_LABELS[rowIndex]}</Text>
          </Box>
          {row.map((piece, colIndex) => (
            <Box key={`${rowIndex}-${colIndex}`} width={3}>
              <Text
                backgroundColor={getCellBackground(rowIndex, colIndex)}
                color={piece || 'black'}
                bold
              >
                {getCellContent(piece ?? null, rowIndex, colIndex)}
              </Text>
            </Box>
          ))}
          <Box marginLeft={1} width={2}>
            <Text bold>{ROW_LABELS[rowIndex]}</Text>
          </Box>
        </Box>
      ))}

      {/* Column labels (bottom) */}
      <Box marginLeft={2}>
        <Text> </Text>
        {COLUMN_LABELS.map((label) => (
          <Box key={label} width={3}>
            <Text bold>{label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
