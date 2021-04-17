import { Description } from './allegro'

export type XmlItem = {
  id: string
  price: number // in PLN * 100
  stock: number
  description: Description
  additionalData?: object // TODO expand it
  categoryId: string
  attributes: Attribute[]
  imageUrls: string[] // first is the main image
}

export type XmlExport = {
  status: 'running' | 'exported'
  source: 'allegro'
  items: XmlItem[]
}

export type SmallXmlExport = {
  status: 'running' | 'exported'
  source: 'allegro'
  items: { id: string; price: number; stock: number }
}

type Attribute = {
  id: string
  rangeValue?: { from: string; to: string }
  values: string[]
  valuesIds: string[]
}

export type Maybe<T> = Promise<T | undefined>