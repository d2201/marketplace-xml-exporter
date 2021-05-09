import { Description } from './allegro'

export type XmlItem = {
  id: string
  name: string
  price: number // in PLN * 100
  stock: number
  description: Description
  externalId?: string
  additionalData?: object // TODO expand it
  categoryId?: string
  attributes: Attribute[]
  images: Array<{ url: string }>
  delivery: { unit: 'hours' | 'days'; amount: number }
  shippingRateId?: string
}

export type XmlVariantSet = {
  id: string
  name: string
  productIds: Array<string> // offer ids @ Allegro
  useThumbnail: boolean // TODO support `offers having the same image should have identical colorPattern value`
  parameterIds: Array<string>
}

export type XmlShippingRate = {
  id: string
  name: string
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
