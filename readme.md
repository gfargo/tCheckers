# tCheckers

Play Checkers inside your Terminal thanks to the power of [React](https://github.com/facebook/react/) and [Ink](https://github.com/vadimdemedes/ink)! The `/workspace/src` directory contains the source code for the application, much of it already complete and ready for you to read and understand.

## ToDo

We have the following remaining goals for this project:


### 1.) The `GameOver` screen doesn't currently implement the `onRestart` and `onQuit` functions.  

We need to add functions to listen to the user's input and trigger the appropriate actions within the component.

### 2.) Finish implementing the commented out`validateSourceInput` and `validateTargetInput` functions in `src/app.tsx`.

These functions will be used to validate the user's input when selecting a piece to move and the target location to move the piece to.

### 3.) Hook up Single Player mode.  

Currently, it's expected that two players will play on the same terminal while taking turns.  Single Player mode will allow a player to play against a basic computer opponent.  The most basic implementation will have the computer make random valid moves.

### 4.) Resolve instances of `// @ts-ignore` in the codebase.

Let's resolve these instances by either fixing the type errors or by adding a comment explaining why the type error is being ignored.  Let's work through these one by one.


## Rules for Development

- Your role is to create and update files in the `src` directory.  The `src` directory contains the source code for the application.
- Please do not attempt to run any commands with yarn, npm or others.  Do not run any commands in the terminal.  Please ask me to handle these tasks for you.
- If you ever have any questions, please ask me.  I'm here to help you succeed.