import React from 'react'
import { ThemeProvider as StyledThemeProvider, ThemedStyledProps, createGlobalStyle } from 'styled-components'
import { createMuiTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@material-ui/core'

type MyTheme = ReturnType<typeof createMuiTheme> & {}

export const theme: MyTheme = createMuiTheme({})

export type ThemedProps<T = {}> = ThemedStyledProps<T, MyTheme>

const GlobalStyle = createGlobalStyle`
body, #root {
  margin: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

@keyframes spin {
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
}

.spin {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear; 
}

* {
  outline: none;
}
`

export const ThemeProvider: React.FC = (props) => {
  const { children } = props
  return (
    <>
      <GlobalStyle />
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
