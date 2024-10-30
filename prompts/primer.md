# Project Primer: tCheckers

## Overview

tCheckers is a terminal-based Checkers game built using React and the Ink library. The project aims to provide an interactive and engaging Checkers experience directly in the terminal. The game supports two-player mode and is designed to be easily extendable for future enhancements.

## Main Technologies

- **React**: A JavaScript library for building user interfaces, used here to manage the game's UI components.
- **Ink**: A library for building command-line interfaces using React components, enabling the game to run in a terminal environment.

## Folder/File Hierarchy

- **/workspace/src**: Contains the source code for the application.
  - **app.tsx**: The main application file where the game logic is implemented.
  - **cli.tsx**: Handles command-line interface interactions.
  - **components/**: Contains reusable React components used throughout the application.
  - **constants.ts**: Defines constants used across the application.
  - **helpers/**: Utility functions and helper modules.
  - **screens/**: Contains different screen components for the game, such as the game board and game over screen.
  - **tests/**: Contains test files for ensuring the application's functionality.

## Key Features

- Terminal-based Checkers game.
- Two-player mode on the same terminal.
- Interactive UI with React and Ink.

## Future Enhancements

- Implement Single Player mode with AI opponent.
- Enhance UI for better user experience.
- Add more game settings and customization options.

This primer provides a condensed overview of the most important aspects of the project, making it easier for other LLMs and coding agents to understand and contribute to the development of tCheckers.

 
## Detailed Overview of `app.tsx`

The `app.tsx` file is the core of the tCheckers application, managing the game's state, logic, and user interface. Here are the key components and systems:

### Key Components and Systems

1. **Imports**:
   - **Libraries**: Utilizes `chalk`, `ink`, and `React` for UI and state management.
   - **Components**: Includes `Board`, `MoveHistory`, `GameOver`, and `MainMenu`.
   - **Constants**: Uses constants like `BOARD_COLORS`, `ERROR_MESSAGES`, `GAME_STATES`, and `PLAYER_COLORS`.
   - **Helpers**: Functions for board initialization and move validation.

2. **State Management**:
   - Manages screen state (`MAIN_MENU`, `GAME`, `GAME_OVER`), game state (board, player, moves), and messages.

3. **Functions**:
   - **clearMessages**, **showError**, **showSuccess**: Manage error and success messages.
   - **resetGame**: Resets the game state for a new game.
   - **checkWinCondition**: Checks if a player has won the game.
   - **generateComputerMove**: Generates a random valid move for the computer player.
   - **handleValidMove**, **handleMove**: Handle move selection and execution.

4. **Game Logic**:
   - Executes moves, updates board state, records moves, and checks for win conditions.
   - Includes logic for single-player mode with basic AI behavior.

5. **Input Handling**:
   - **useInput**: Manages user input for menu navigation and move selection.
   - Validates input and provides feedback for invalid actions.

6. **Screen Management**:
   - Manages transitions between main menu, game, and game over screens.

7. **UI Components**:
   - **Board**: Displays the game board.
   - **MoveHistory**: Shows move history.
   - **Messages**: Displays error and success messages.

8. **Prompt Text**:
   - Provides instructions based on the current game state.

This detailed overview of `app.tsx` provides a comprehensive understanding of the game's core functionality and structure, aiding future development and collaboration.


## Rules

- Please do not try to run yarn, npm or package manageer commmands.  I'll be running the project on my end.
- Please do not attempt to run any test suites, as I'll be running the tests on my end.
- 