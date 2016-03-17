'use strict';

const memwatch = require('memwatch-next');

var hd = new memwatch.HeapDiff();

const lunr = require('lunr');
let lunrIndex = lunr(function() {
  this.field('id');
  this.field('title');
  this.field('body');
  this.ref('_ref');
});

const factory = require('AutoFixture');
require('./fixtures/fixture')(factory);
var feeds = factory.createListOf('Document', process.argv[2] || 5000);
feeds.forEach((feed) => lunrIndex.add(feed));

var searchTerm = 'ab';
lunrIndex.search(searchTerm);

var diff = hd.end();

console.log(diff);
console.log('After Heap: ' + diff.after.size);