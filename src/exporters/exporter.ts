import fs from 'fs'
import builder from 'xmlbuilder'
import { XmlItem } from '../types'

export default abstract class Exporter {
  private fileStream: fs.WriteStream

  private xml: builder.XMLDocumentCB

  constructor() {
    this.fileStream = fs.createWriteStream(global.config.exporter.filePath)

    this.xml = builder
      .begin((chunk) => {
        this.fileStream.write(chunk)
      })
      .dec()
      .element('root')
      .element('items')
  }

  /**
   * @description
   * Recursive digger so that I can feed any object and it will create XML object from it :)
   */
  private digItem(obj: Record<string, any>) {
    if (!obj) {
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      this.xml.element(key)

      if (Array.isArray(value)) {
        for (const val of value) {
          if (['string', 'number', 'bigint'].includes(typeof val)) {
            this.xml.element(`${key}.simple.item`).cdata(val).up()
          } else {
            /**
             * @description
             * In structures like: Array<{ x: string; y: string }>
             * There is no descriptive key which would differ items from each other.
             * E.g. resulting XML would be
             * ```xml
             * <example>
             *  <x>foo</x>
             *  <y>bar</y>
             *  <x>foo_2</x>
             *  <y>bar_2</y>
             * </example>
             * ```
             *
             * We want to have atleast some wrapper so the example would look like this:
             * ```xml
             * <example>
             *  <example.item>
             *    <x>foo</x>
             *    <y>bar</y>
             *  </example.item>
             *  <example.item>
             *    <x>foo_2</x>
             *    <y>bar_2</y>
             *  </example.item>
             * </example>
             * ```
             */
            const hasOnlyDescriptiveKey = Object.keys(val).length === 1

            this.digItem(hasOnlyDescriptiveKey ? val : { [`${key}.item`]: val })
          }
        }
      } else if (typeof value === 'object') {
        this.digItem(value)
      } else {
        this.xml.cdata(value)
      }

      this.xml.up()
    }
  }

  abstract run(): Promise<void>

  protected writeItem(item: XmlItem): void {
    this.xml.element('item')

    this.digItem(item)

    this.xml.up()
  }

  protected close() {
    this.xml.up().up().end()
    this.fileStream.close()
  }
}
