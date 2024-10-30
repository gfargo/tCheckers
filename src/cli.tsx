#!/usr/bin/env node
import { render } from 'ink'
import meow from 'meow'
import React from 'react'
import App from './app.js'

const cli = meow(
  `
	Usage
	  $ tCheckers

	Options
		--multiplayer

	Examples
	  $ tCheckers --multiplayer
`,
  {
    importMeta: import.meta,
    flags: {
      multiplayer: {
        type: 'boolean',
      },
    },
  }
)

render(<App isMultiplayer={cli.flags.multiplayer} />)
