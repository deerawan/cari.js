'use strict';

const elasticlunr = require('elasticlunr');
const lunr = require('lunr');
const Benchmark = require('benchmark');
const helpers = require('./helpers');
const factory = require('AutoFixture');
require('./fixtures/fixture')(factory);

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

const feeds = factory.createListOf('Document', process.argv[2] || 5000);
feeds.forEach((feed) => {
  elasticlunrIndex.addDoc(helpers.transform(feed));
  elasticlunrIndexWithDocumentCopy.addDoc(helpers.transform(feed));
  lunrIndex.add(helpers.transform(feed));
});

let suite = new Benchmark.Suite;
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
