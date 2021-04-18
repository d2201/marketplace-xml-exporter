# Marketplace Exporter

Tool for exporting `.xml` files from the most popular marketplaces in Poland.

## Supported marketplaces

- [x] Allegro
- [ ] Amazon
- [ ] Erli

## !CAUTION! Setup your config.ini file

This step is required to begin working with the tool.
In the `config.example.ini` file you should find what a perfect `config.ini` file should look like. <br/>
On the initation `src/loadConfig.ts`, will try to fill default values from `config.example.ini`

## Binaries

In releases you can find a working binary for your operating system.
That way you don't need to install anything.

## Requirements

- `Node v12.14.0+`
- `yarn`

## Usage

Run `yarn start` - the script will trigger `build` and will run the import.

## Roadmap

Things that will be done

- [ ] Failure takeover - if export crashes at any moment the tool should be able to pick up rest of the work.
- [ ] README.md section on setting up for Allegro
- [ ] Write tests
- [ ] Expand AllegroSDK for methods with variant sets
- [ ] Add more configuration to logging
- [ ] Progress logging

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0)
