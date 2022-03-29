#!/usr/bin/env node
/**
 * external dependencies
 */
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs").promises;
const path = require("path");
const parse = require("csv-parse/lib/sync");
const QRCode = require("qrcode");

(async function () {
  const args = yargs(hideBin(process.argv))
    .usage("Usage: $0 -f [csv-file] -o [output-path]")
    .option("file", {
      alias: "f",
      type: "string",
      description: "Path to the input CSV file",
    })
    .option("column", {
      alias: "c",
      type: "number",
      default: 1,
      description: "The column in the CSV",
    })
    .option("outputDir", {
      alias: "o",
      type: "string",
      default: "qrcodes",
      description:
        "Path to the output directory relative to the current directory",
    })
    .option("prefix", {
      alias: "p",
      type: "string",
      default: "",
      description: "A prefix added to the string encoded in the QRCode",
    })
    .option("delimiter", {
      alias: "d",
      type: "string",
      default: ";",
      description: "The delimiter used in the input CSV file",
    })
    .demandOption(["file"])
    .parse();

  const filePath = path.resolve(args.file);
  const dirPath = path.dirname(filePath) + "/" + args.outputDir;

  console.log("setting up directories...");
  await fs.mkdir(dirPath, { recursive: true });

  console.log("reading file...");
  const content = await fs.readFile(filePath);

  console.log("parsing csv...");
  const records = parse(content, {
    delimiter: args.delimiter,
    trim: true,
  });

  const rows = [];

  console.log("generating links...");
  records.map((record) => {
    const slug = record[args.column]
      .replace(/\s+/g, "-")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const value = args.prefix + slug;

    const link = {
      value: value,
      slug: slug,
    };
    rows.push(link);
  });

  console.log("generating qr codes...");
  rows.map(async (row) => {
    const options = {
      width: 2000,
      height: 2000,
    };

    const finalPath = dirPath + "/" + row.slug + ".png";

    QRCode.toFile(finalPath, row.value, options);
  });
})();
