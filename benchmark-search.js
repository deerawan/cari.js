'use strict';

const elasticlunr = require('elasticlunr');
const lunr = require('lunr');
const feeds = require('./fixtures/data');
const Benchmark = require('benchmark');
const helpers = require('./helpers');

let suite = new Benchmark.Suite;

let elasticlunrIndex = elasticlunr(function() {
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(false);
});

let elasticlunrIndexWithDocumentCopy = elasticlunr(function() {
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(true);
});

let lunrIndex = lunr(function() {
  this.field('title', { boost: 10 });
  this.field('body', { boost: 1 });
  this.ref('_ref');
});

feeds.forEach((feed) => {
  elasticlunrIndex.addDoc(helpers.transform(feed));
  elasticlunrIndexWithDocumentCopy.addDoc(helpers.transform(feed));
  lunrIndex.add(helpers.transform(feed));
});

suite
  .add('elasticlunr#search', () => {
    elasticlunrIndex.search('invoice', {
      fields: {
        title: { boost: 10 },
        body: { boost: 1 }
      },
      expand: true
    });
  })
  .add('elasticlunr(with documents copy)#search', () => {
    elasticlunrIndexWithDocumentCopy.search('invoice', {
      fields: {
        title: { boost: 10 },
        body: { boost: 1 },
      },
      expand: true
    });
  })
  .add('lunr#search', () => {
    lunrIndex.search('invoice');
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
