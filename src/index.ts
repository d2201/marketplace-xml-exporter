import AllegroSDK from './exporters/AllegroSDK'

Promise.resolve().then(async () => {
  const sdk = new AllegroSDK()

  sdk.getOfferById()
})
