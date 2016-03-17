'use strict';

const memwatch = require('memwatch-next');

var hd = new memwatch.HeapDiff();

const elasticlunr = require('elasticlunr');
let elasticlunrIndex = elasticlunr(function() {
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(true);
});

const factory = require('AutoFixture');
require('./fixtures/fixture')(factory);
var feeds = factory.createListOf('Document', process.argv[2] || 5000);
feeds.forEach((feed) => elasticlunrIndex.addDoc(feed));

var searchTerm = 'ab';
elasticlunrIndex.search(searchTerm, {
  fields: {
    title: { boost: 10 },
    body: { boost: 1 }
  },
  expand: true
});

var diff = hd.end();

console.log(diff);
console.log('After Heap: ' + diff.after.size);
