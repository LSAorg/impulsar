import express from 'express'
import cors from 'cors'
import * as vosk from 'vosk'
import { createServer, Server } from 'http'
import { Server as IOServer, Socket } from 'socket.io'
import { SpeechClient } from '@google-cloud/speech'
import { google } from '@google-cloud/speech/build/protos/protos'
import { SocketStream } from 'stream-socket.io'
import { AudioIO, SampleFormat16Bit } from 'naudiodon'
import { Dictionary } from '../data/dictionary'
export class ImpulsarServer {
  app: any

  server: Server
  serverPort: number

  io: IOServer
  ioStream: SocketStream

  sampleRate: number

  voskModel: any

  googleSpeechClient: SpeechClient
  googleSpeechSreamRecognitionConfig: google.cloud.speech.v1.IStreamingRecognitionConfig

  constructor () {
    // Express App
    this.app = express()
    this.app.use(cors())

    // Public Folder
    this.app.use(express.static('public'))

    // Http Server
    this.server = createServer(this.app)
    this.serverPort = process.env.NODE_ENV === 'production' ? 80 : 3000

    // SocketIO Server
    this.io = new IOServer(this.server, {
      cors: {
        origin: '*'
      }
    })
    // SocketIO Stream Server
    this.ioStream = new SocketStream()

    // Audio Config
    this.sampleRate = 1600

    // Vosk
    this.voskModel = new vosk.Model('vosk-models/vosk-model-small-es-0.3')

    // Google Speech
    this.googleSpeechClient = new SpeechClient()
    this.googleSpeechSreamRecognitionConfig = {
      config: {
        sampleRateHertz: this.sampleRate,
        encoding: 1,
        languageCode: 'es-AR'
      },
      interimResults: false
    }

    this.defineHttpRoutes()
    this.defineSocketEvents()
  }

  defineHttpRoutes = () => {
    this.app.get('/', (req, res) => {
      res.send('Impulsar Server')
    })
  }

  defineClientEvents = (client: Socket) => {
    this.onClientConnected(client)
    this.ioStream.on(client, 'stream-audio', (stream, _id, _options) => {
      this.onClientStreamAudio(client, stream)
    })
  }

  onClientConnected = (client: Socket) => {
    client.emit('log', `Server connected [id=${client.id}]`)
  }

  onClientStreamAudio = (client: Socket, stream: any) => {
    this.transcribeOfflineAudioStream(stream, (error: Error, type: string, result: any) => {
      if (error != null) return

      if (type === 'result') {
        if (result.text !== '') {
          client.emit('subtitle', { data: result.text })
        }
      }
      if (type === 'partial') {
        if (result.partial !== '') {
          client.emit('subtitle', { data: result.partial })
        }
      }

      this.translateTextSteam(result, (resultAnimations: string[]) => {
        if (resultAnimations.length) {
          client.emit('animation', { data: resultAnimations })
        }
      })

      console.log('result', result)
    })
  }

  defineSocketEvents = () => {
    this.io.on('connect', (client: Socket) => {
      this.defineClientEvents(client)
    })
  }

  debugAudioStream = (audio) => {
    const output = AudioIO({
      outOptions: {
        channelCount: 1,
        sampleFormat: SampleFormat16Bit,
        sampleRate: this.sampleRate,
        deviceId: -1,
        closeOnError: false
      }
    })
    audio.pipe(output)
    audio.on('end', () => {
      output.end()
    })
    output.start()
  }

  translateTextSteam = (result, cb) => {
    const text = result.text || result.partial || ''
    const words = text.split(' ')
    const animations = words.reduce((out, word) => {
      if (Dictionary[word]) {
        out.push(Dictionary[word])
      }
      return out
    }, [])
    cb(animations)
  }

  transcribeAudioStream = (audio, cb) => {
    const recognizeStream = this.googleSpeechClient.streamingRecognize(this.googleSpeechSreamRecognitionConfig)
      .on('data', (data) => {
        cb(null, data)
      })
      .on('error', (e) => {
        console.log(e)
      })
      .on('end', () => {
        console.log('on end')
      })
    audio.pipe(recognizeStream)
    audio.on('end', () => {
      recognizeStream.end()
      console.log('end chunk')
    })
  }

  transcribeOfflineAudioStream = (audio, cb) => {
    const voskRec = new vosk.Recognizer({ model: this.voskModel, sampleRate: 16000 })
    audio.on('data', (audioData: any) => {
      if (voskRec.acceptWaveform(audioData)) {
        cb(null, 'result', voskRec.result())
      } else {
        cb(null, 'partial', voskRec.partialResult())
      }
    })
  }

  init = () => {
    this.server.listen(this.serverPort, () => {
      console.log(`Example app listening at http://localhost:${this.serverPort}`)
    })
  }
}
