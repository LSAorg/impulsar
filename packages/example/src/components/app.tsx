import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { AppBar, Toolbar, IconButton, Typography, Paper, CircularProgress } from '@material-ui/core'
import { ThemeProvider } from './theme'

import { ImpulsarClient, ImpulsarClientPlugin } from '@impulsar/client'
import { ImpulsarPluginRecord } from '@impulsar/plugin-record'
import { ImpulsarPluginSubtitle } from '@impulsar/plugin-subtitle'
import { ImpulsarPluginWebGLRender } from '@impulsar/plugin-webgl-render'

import { Mic } from '@styled-icons/material/Mic'
import { MicOff } from '@styled-icons/material/MicOff'

import { Cloud } from '@styled-icons/material/Cloud'
import { CloudOff } from '@styled-icons/material/CloudOff'

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
`
const Title = styled(Typography)`
  flex-grow: 1;
`
const Content = styled(Paper)`
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-grow: 1;
`

const Animation = styled.div`
  background: black;
  background-size: cover;
  width: 100%;
  height: 100%;
`

const Loading = styled.div`
  position: absolute;
  background: #000000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Subtitle = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100vw;
  font-size: 2.5rem;
  text-align: center;
  color: white;
  -webkit-text-stroke: 1px black;

  & ul {
    list-style: none;
    padding: 0;
  }
`

const MicIcon = styled(Mic)`
  width: 24px;
  height: 24px;
  color: white;
`

const MicOffIcon = styled(MicOff)`
  width: 24px;
  height: 24px;
`

const CloudIcon = styled(Cloud)`
  width: 24px;
  height: 24px;
  color: white;
`

const CloudOffIcon = styled(CloudOff)`
  width: 24px;
  height: 24px;
`

const Hidden = styled.div`
  display: none;
`

export const App: React.FC = () => {
  const subtitleLocation = useRef<HTMLDivElement | null>(null)
  const animationLocation = useRef<HTMLDivElement | null>(null)

  const impulsarRef = useRef<ImpulsarClient | null>(null)
  const impulsarPluginRecordRef = useRef<ImpulsarPluginRecord | null>(null)
  const impulsarPluginSubtitleRef = useRef<ImpulsarPluginSubtitle | null>(null)
  const impulsarPluginWebGLRenderRef = useRef<ImpulsarPluginWebGLRender | null>(null)

  const [tick, setTick] = useState<number>(0)
  const [enabledMic, setEnabledMic] = useState(true)

  const forceRender = () => {
    setTimeout(() => {
      setTick(new Date().getTime())
    }, 100)
  }

  const onMicToggle = () => {
    if (impulsarPluginRecordRef.current === null) return
    const impulsarPluginRecord: ImpulsarPluginRecord = impulsarPluginRecordRef.current
    if (enabledMic) {
      impulsarPluginRecord.stop()
      setEnabledMic(false)
    } else {
      impulsarPluginRecord.start()
      setEnabledMic(true)
    }
  }

  const onConnectedToogle = () => {
    if (impulsarRef.current === null) return
    const impulsar: ImpulsarClient = impulsarRef.current
    if (impulsar.connected) {
      impulsar.disconnect()
    } else {
      impulsar.connect()
    }
    forceRender()
  }

  useEffect(() => {
    const examplePlugin = new ImpulsarClientPlugin()
    impulsarPluginRecordRef.current = new ImpulsarPluginRecord({ autoStart: true })

    impulsarPluginSubtitleRef.current = new ImpulsarPluginSubtitle({
      element: subtitleLocation.current as Element
    })

    impulsarPluginWebGLRenderRef.current = new ImpulsarPluginWebGLRender({
      element: animationLocation.current as Element
    })

    const impulsarServer = window.location.toString().includes('localhost')
      ? 'http://localhost:3000'
      : 'https://impulsar-server.herokuapp.com'

    impulsarRef.current = new ImpulsarClient({
      autoConnect: true,
      debug: false,
      host: impulsarServer,
      plugins: [
        examplePlugin,
        impulsarPluginRecordRef.current,
        impulsarPluginSubtitleRef.current,
        impulsarPluginWebGLRenderRef.current
      ],
      onConnected: forceRender,
      onDisconnected: forceRender
    })

    forceRender()
  }, [])

  console.log('impulsarRef.current', impulsarRef.current)

  return (
    <React.StrictMode>
      <ThemeProvider>
        <Container>
          <AppBar position="relative">
            <Toolbar>
              <Title variant="h6">ImpuLSAr</Title>
              {impulsarRef.current && (
                <>
                  {impulsarRef.current.connected && (
                    <IconButton onClick={onMicToggle}>{enabledMic ? <MicIcon /> : <MicOffIcon />}</IconButton>
                  )}
                  <IconButton onClick={onConnectedToogle}>
                    {impulsarRef.current.connected ? <CloudIcon /> : <CloudOffIcon />}
                  </IconButton>
                </>
              )}
            </Toolbar>
          </AppBar>
          <Content>
            <Animation ref={animationLocation} />
            {!impulsarRef.current?.connected && (
              <Loading>
                <CircularProgress size={80} />
              </Loading>
            )}
            <Subtitle ref={subtitleLocation} />
          </Content>
        </Container>
        <Hidden>{tick}</Hidden>
      </ThemeProvider>
    </React.StrictMode>
  )
}
