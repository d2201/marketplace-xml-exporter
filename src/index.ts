import './loadConfig'
import Allegro from './sdk/Allegro'

Promise.resolve().then(async () => {
  await new Allegro().authorize()
})
