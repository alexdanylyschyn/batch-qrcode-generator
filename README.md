# Batch QR Code Generator

A simple CLI utility to generate multiple QR Codes from a CSV file.

## Usage

Either install it globally

```
npm install -g batch-qrcode-generator
```

Or run it via NPX

```
npx batch-qrcode-generator -f file.csv [options]
```

The CSV file currently has to use semicolons as delimiters.

### Options

You can use a few different options to customize the output

| option           | required | description                                                    | default |
|------------------|----------|----------------------------------------------------------------|---------|
| --file / -f      | yes      | Path to the input CSV file                                     |         |
| --column / -c    | no       | The column in the CSV file to generate the QRCode from         | 1       |
| --outputDir / -o | no       | Path to the output directory relative to the current directory | ""      |
| --prefix / -p    | no       | A prefix added to the string encoded in the QRCode             | ""      |