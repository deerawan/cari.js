'use strict';

const elasticlunr = require('elasticlunr');
const lunr = require('lunr');
const feeds = require('./fixtures/data');
const Benchmark = require('benchmark');
const helpers = require('./helpers');

let suite = new Benchmark.Suite;

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
  this.field('title', { boost: 10 });
  this.field('body');
  this.ref('_ref');
});

suite
  .add('elasticlunr#index.addDoc', () => {
    feeds.forEach((feed) => elasticlunrIndex.addDoc(helpers.transform(feed)));
  })
  .add('elasticlunr(with document copy)#index.addDoc', () => {
    feeds.forEach((feed) => elasticlunrIndexWithDocumentCopy.addDoc(helpers.transform(feed)));
  })
  .add('lunr#index.add', () => {
    feeds.forEach((feed) => lunrIndex.add(helpers.transform(feed)));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });

