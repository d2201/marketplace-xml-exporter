import fs from 'fs'
import builder from 'xmlbuilder'
import path from 'path'
import { XmlItem } from '../types'
import omitEmpty from '../helpers/omitEmpty'

export default abstract class Exporter<Item extends object = XmlItem> {
  private fileStream: fs.WriteStream

  private xml: builder.XMLDocumentCB

  constructor(exporterType: string, fileName: string) {
    this.fileStream = fs.createWriteStream(path.join(global.config.exporter.directory, fileName))

    this.xml = builder
      .begin((chunk) => {
        this.fileStream.write(chunk)
      })
      .dec()
      .element('root')
      .element('type')
      .cdata(exporterType)
      .up()
      .element('items')
  }

  abstract run(): Promise<void>

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

  protected writeItem(item: Item): void {
    this.xml.element('item')

    this.digItem(omitEmpty(item))

    this.xml.up()
  }

  protected close() {
    this.xml.up().up().end()
    this.fileStream.close()
  }
}
