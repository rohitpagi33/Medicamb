const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/drugbank_all.json');
const outputPath = path.join(__dirname, '../data/drugbank_search_index.json');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const index = raw.map(drug => ({
  name: drug.name,
  synonyms: drug.synonyms || [],
  brands: drug.brands || [],
}));

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
console.log('Search index built:', outputPath);