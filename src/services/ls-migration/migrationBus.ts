import type { LOCAL_STORAGE_DATA } from './common'
import { IFRAME_HOST, IFRAME_PATH } from './config'
import { createIframe, receiveMessage, sendReadyMessage } from './iframe'

enum MessageType {
  MigrationData = 'migration-data',
}

type MigrationMessage = {
  type: MessageType.MigrationData
  payload: LOCAL_STORAGE_DATA
}

const isMigrationMessage = (message: any): message is MigrationMessage => {
  return !!message && message.type === MessageType.MigrationData
}

/**
 * Create and an iframe and subscribe to the message from it
 */
const createMigrationBus = (onMessage: (message: LOCAL_STORAGE_DATA) => void): (() => void) => {
  // Create iframe
  const iframe = createIframe(`${IFRAME_HOST}${IFRAME_PATH}`)
  console.log('Creating iFrame and subscribing to messages')

  // Subscribe to the message from iframe
  const unsubscribe = receiveMessage((message) => {
    console.log('Received message from iFrame')
    if (isMigrationMessage(message)) {
      console.log('isMigrationMessage = true')
      onMessage(message.payload)
    } else {
      console.log('isMigrationMessage = false')
    }
  }, IFRAME_HOST)

  let onDone = () => {
    iframe.remove()
    unsubscribe()
    onDone = () => void null
  }

  // Send a message to the iframe so that it knows where to respond
  sendReadyMessage(iframe, IFRAME_HOST)

  return onDone
}

export default createMigrationBus
