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

- `Node v14.15.1+`
- `yarn`

## Usage

Install packages with `yarn`

Run `yarn start` - the script will trigger `build` and will run the import.

## Common Issues

- Powershell throwing errors when trying to run

Run:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Generating Allegro application

- Go to https://apps.developer.allegro.pl/
- Click `Zarejestruj nową aplikację`
  - Application type **must be** with `grant-type: device_code`
- When created update the `config.ini` file with creating api keys.

## [Roadmap](https://github.com/d2201/marketplace-xml-exporter/issues?q=is%3Aissue+is%3Aopen+label%3Aroadmap)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0)
