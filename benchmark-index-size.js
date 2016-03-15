/**
 * Benchmarking index size. Index will be stored as a json file
 * to compare the size between them.
 *
 * Usage:
 * node benchmark-index-size <total_documents (default 5000)>
 *
 * Example:
 * node benchmark-index-size 3000
 */

'use strict';

const fs = require('fs');
const elasticlunr = require('elasticlunr');
const lunr = require('lunr');
const helpers = require('./helpers');
const factory = require('AutoFixture');
require('./fixtures/fixture')(factory);

const feeds = factory.createListOf('Document', process.argv[2] || 5000);

let elasticlunrIndex = elasticlunr(function() {
  this.addField('id');
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(false);
});

let elasticlunrIndexWithDocumentCopy = elasticlunr(function() {
  this.addField('id');
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(true);
});

let lunrIndex = lunr(function() {
  this.field('id');
  this.field('title');
  this.field('body');
  this.ref('_ref');
});

// === FUNCTIONS

var files = [];
function writeToFile(filename, data) {
  var filePath = __dirname + '/' + filename;
  fs.writeFileSync(filePath, JSON.stringify(data));
  var size = getFileSize(filePath);
  files.push({name: filename, 'size': size});
}

function getFileSize(filename) {
 return fs.statSync(filename).size;
}

// === WRITE INDEX TO FILE

feeds.forEach((feed) => elasticlunrIndex.addDoc(helpers.transform(feed)));
writeToFile('index-elasticlunr.json', elasticlunrIndex.index);

feeds.forEach((feed) => elasticlunrIndexWithDocumentCopy.addDoc(helpers.transform(feed)));
writeToFile('index-elasticlunr-doc-copy.json', elasticlunrIndexWithDocumentCopy.index);

feeds.forEach((feed) => lunrIndex.add(helpers.transform(feed)));
writeToFile('index-lunr.json', lunrIndex.toJSON());

// === FIND MAX AND MIN OF FILE

// Find max
var file = files.reduce(function(prev, current) {
  if (prev.size > current.size) {
    return prev;
  }
  return current;
}, 0);
console.log('The biggest size:\n' + file.name + ' (' + file.size + ')');

// Find min
var file = files.reduce(function(prev, current) {
  if (prev.size < current.size) {
    return prev;
  }
  return current;
}, 0);
console.log('\nThe smallest size:\n' + file.name + ' (' + file.size + ')');


