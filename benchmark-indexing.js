'use strict';

const elasticlunr = require('elasticlunr');
const lunr = require('lunr');
const Benchmark = require('benchmark');
const helpers = require('./helpers');
const factory = require('AutoFixture');
require('./fixtures/fixture')(factory);

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

let suite = new Benchmark.Suite;
const feeds = factory.createListOf('Document', process.argv[2] || 5000);

suite
  .add('elasticlunr#indexing', () => {
    feeds.forEach((feed) => elasticlunrIndex.addDoc(helpers.transform(feed)));
  })
  .add('elasticlunr(with document copy)#indexing', () => {
    feeds.forEach((feed) => elasticlunrIndexWithDocumentCopy.addDoc(helpers.transform(feed)));
  })
  .add('lunr#indexing', () => {
    feeds.forEach((feed) => lunrIndex.add(helpers.transform(feed)));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });

