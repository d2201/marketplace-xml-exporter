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

## Requirements

- `Node v14.15.1+`
- `yarn`

## Usage

Install packages with `yarn`

Run `yarn start` - the script will trigger `build` and will run the import.

After importing all necessary `.xml` files will be exported to directory you specified in `config.ini` file (Field: `exporter.directory`).

## Why tool requests certain access in APIs

Detailed API endpoints used are in directory: `src/sdk`

- Allegro
  - `allegro:api:sale:offers:read`
    - Fetching detailed offer specification (`price`, `name`, `id`, `description` ... etc)
    - Fetching variant sets
  - `allegro:api:sale:settings:read`
    - Reading shipping rates names
    - TODO exporting warranties/return policies
    - TODO exporting whole shipping rates

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
