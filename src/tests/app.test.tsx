import test from 'ava'
import { render } from 'ink-testing-library'
import React from 'react'
import App from '../app.js'

test('[1p] render opening menu', (t) => {
  const { lastFrame } = render(<App isMultiplayer={false} />)
  const openingScreenSingleplayer = lastFrame()

  t.snapshot(openingScreenSingleplayer)
})

test('[2p] render opening menu', (t) => {
  const { lastFrame } = render(<App isMultiplayer />)
  const openingScreenMultiplayer = lastFrame()

  t.snapshot(openingScreenMultiplayer)
})
