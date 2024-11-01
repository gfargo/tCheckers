import { Box, Text, useInput } from 'ink'
import React from 'react'
import { useGame } from '../GameContext.js'

interface MainMenuProps {
  defaultSelection?: number
}

export const MainMenu: React.FC<MainMenuProps> = ({ defaultSelection }) => {
  const { resetGame } = useGame()
  const [menuSelection, setMenuSelection] = React.useState(
    defaultSelection || 0
  )

  useInput((_, key) => {
    if (key.upArrow) {
      setMenuSelection((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (key.downArrow) {
      setMenuSelection((prev) => (prev < 2 ? prev + 1 : prev))
    } else if (key.return) {
      if (menuSelection === 0) {
        resetGame(false)
      } else if (menuSelection === 1) {
        resetGame(true)
      } else if (menuSelection === 2) {
        process.exit()
      }
    }
  })

  const menuItems = [
    { label: 'Single Player' },
    { label: 'Multiplayer' },
    { label: 'Quit' },
  ]

  return (
    <Box flexDirection="column" alignItems="center" padding={1}>
      <Box marginBottom={1}>
        <Text bold>tCheckers</Text>
      </Box>
      {menuItems.map((item, index) => (
        <Box key={item.label}>
          <Text>
            {menuSelection === index ? '> ' : '  '}
            <Text bold={menuSelection === index}>{item.label}</Text>
          </Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>Use arrow keys to select and Enter to confirm</Text>
      </Box>
    </Box>
  )
}
