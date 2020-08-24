import React from 'react'
import {
  CssBaseline, NoSsr,
} from '@material-ui/core'
import styled, { createGlobalStyle } from 'styled-components'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { pink, blue } from '@material-ui/core/colors'
import Notifications from './notifications/Notifications'
import Processes from './processes/Processes'

const HeightFull = createGlobalStyle`
  html, body, #app {
    height: 100%;
  }
`

const Wrapper = styled.div`
  height: 100%;
  display: inline-block;
  width: 100%;
`

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink,
  },
})

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <HeightFull />
    <NoSsr>
      <Wrapper>
        <Processes />
        <Notifications />
      </Wrapper>
    </NoSsr>
  </ThemeProvider>
)

export default App
