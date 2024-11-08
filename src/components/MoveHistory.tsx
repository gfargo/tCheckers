import { Box, Text } from 'ink'
import React from 'react'
import { useGame } from '../GameContext.js'

interface MoveHistoryProps {
  maxMoves?: number
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ maxMoves = 8 }) => {
  const { moves } = useGame()

  // Get the most recent moves up to maxMoves
  const recentMoves = moves.slice(-maxMoves)

  return (
    <Box
      flexDirection="column"
      marginLeft={2}
      borderStyle="single"
      paddingX={1}
      flexGrow={1}
    >
      <Box marginBottom={1} justifyContent="center">
        <Text bold underline>
          Move History
        </Text>
      </Box>
      {recentMoves.length > 0 ? (
        recentMoves.map((move, index) => (
          <Box key={index}>
            <Text>
              <Text color={move.player} bold>{`${
                moves.length - recentMoves.length + index + 1
              }.`}</Text>
              <Text color={move.player}>{` ${move.from}->${move.to}`}</Text>
              {move.captured && <Text color="yellow"> ✗</Text>}
            </Text>
          </Box>
        ))
      ) : (
        <Box height={maxMoves} justifyContent="center">
          <Text dimColor>No moves yet</Text>
        </Box>
      )}
    </Box>
  )
}
