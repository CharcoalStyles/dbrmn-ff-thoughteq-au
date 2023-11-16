// This is a module worker, so we can use imports (in the browser too!)
import { encodeAudio } from './utils/encodeAudio'

addEventListener('message', (event: MessageEvent<ArrayBuffer>) => {
  postMessage(encodeAudio(event.data))
})
