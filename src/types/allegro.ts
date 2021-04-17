// mock from https://developer.allegro.pl/documentation

export type Offer = {
  id: string
  additionalServices?: JustId
  afterSaleServices?: AfterSaleServices
  attachments?: Array<JustId>
  category: JustId
  compatibilityList?: CompatibilityList
  contact: JustId
  createdAt: string
  customParameters?: CustomParameter[]
  delivery: Delivery
  description: Description
  discounts?: {
    wholesalePriceList: JustId
  }
  external?: JustId
  fundraisingCompaign?: JustId
  images: Array<{ url: string }>
  location?: any // TODO
  name: string
  parameters: Parameter[]
  payments?: { invoice: Invoice }
  product?: JustId
  promotion?: Promotion
  publication: Publication
  sellingMode: SellingMode
  tax?: { percentage: string }
  sizeTable?: JustId
  stock: { available: number; unit: string }
  tecdocSpecification?: TecdocSpecification
  updatedAt: string
}

type TecdocSpecification = {
  id: string
  items?: Array<{ name: string; values: string[] }>
}

type Price = { amount: string; currency: string }

type SellingMode = {
  format: 'BUY_NOW' | 'AUCTION' | 'ADVERTISEMENT'
  price?: Price
  minimalPrice?: Price
  startingPrice?: Price
  netPrice?: Price
}

type Publication = {
  duration: string
  endingAt?: string
  startingAt?: string
  status: 'INACTIVE' | 'ACTIVATING' | 'ACTIVE' | 'ENDED'
  endedBy?: 'USER' | 'ADMIN' | 'EXPIRATION' | 'ERROR'
  republish?: boolean
}

type Promotion = {
  bold: boolean
  departmentPage: boolean
  emphasized: boolean
  emphasizedHighlightBoldPackage: boolean
  highlight: boolean
}

type Invoice = 'VAT' | 'VAT_MARGIN' | 'WITHOUT_VAT' | 'NO_INVOICE'

type Parameter = {
  id: string
  rangeValue?: { from: string; to: string }
  values: string[]
  valuesIds: string[]
}

type CustomParameter = {
  name: string
  values: string[]
}

type AfterSaleServices = {
  impliedWarranty: JustId
  returnPolicy: JustId
  warranty: JustId
}

type JustId = {
  id: string
}

type CompatibilityList = ManualCompatibilityList | ProductBasedCompatibilityList

type ManualCompatibilityList = {
  type: 'MANUAL'
  items: Array<CompatibilityListItem>
}

type CompatibilityListItem =
  | {
      type: 'TEXT'
      text: string
    }
  | {
      type: 'ID'
      id: string
      text?: string
      additionalInfo?: any[] // TODO fill it
    }

type ProductBasedCompatibilityList = {
  type: 'PRODUCT_BASED'
  id: string
  items: CompatibilityListItemProductBased[]
}

type CompatibilityListItemProductBased = {
  text?: string
}

type Delivery = {
  shipmentDate: string
  additionalInfo?: string
  handlingTime?: string
  shippingRates: JustId
}

export type Description = {
  sections: DescriptionSection[]
}

type DescriptionSection = {
  items: Array<DescriptionTextItem | DescriptionImageItem>
}

type DescriptionTextItem = {
  type: 'TEXT'
  content: string
}

type DescriptionImageItem = {
  type: 'IMAGE'
  url: string
}
