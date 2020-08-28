import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

const csvFilePath = path.resolve(__dirname, 'import_template.csv');

const readCSVStream = fs.createReadStream(csvFilePath);

const parseStream = csvParse({
  from_line: 2,
  ltrim: true,
  rtrim: true,
});

const parseCSV = readCSVStream.pipe(parseStream);

parseCSV.on('data', line => {
  console.log(line);
});
