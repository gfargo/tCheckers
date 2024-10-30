import { Box, Text } from 'ink';
import React from 'react';

interface MainMenuProps {
    onStartSinglePlayer: () => void;
    onStartMultiPlayer: () => void;
    onQuit: () => void;
    selectedOption: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
    onStartSinglePlayer, 
    onStartMultiPlayer, 
    onQuit,
    selectedOption 
}) => {
    const menuItems = [
        { label: 'Single Player', action: onStartSinglePlayer },
        { label: 'Multiplayer', action: onStartMultiPlayer },
        { label: 'Quit', action: onQuit }
    ];

    return (
        <Box flexDirection="column" alignItems="center" padding={1}>
            <Box marginBottom={1}>
                <Text bold>tCheckers</Text>
            </Box>
            {menuItems.map((item, index) => (
                <Box key={item.label}>
                    <Text>
                        {selectedOption === index ? '> ' : '  '}
                        <Text bold={selectedOption === index}>
                            {item.label}
                        </Text>
                    </Text>
                </Box>
            ))}
            <Box marginTop={1}>
                <Text dimColor>Use arrow keys to select and Enter to confirm</Text>
            </Box>
        </Box>
    );
};
