import { AxiosError } from 'axios'
import fs from 'fs'
import ini from 'ini'
import Allegro from './exporters/Allegro'

Promise.resolve().then(async () => {
  const allegro = new Allegro()

  try {
    await allegro.authorizeWithCode()
  } catch (e) {
    const err: AxiosError = e

    console.log(err.response!.data)
  }
})