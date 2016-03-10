'use strict';

const elasticlunr = require('elasticlunr');
const lunr = require('lunr');

let elasticlunrIndex = elasticlunr(function() {
  this.addField('title');
  this.addField('body');
  this.setRef('_ref');
  this.saveDocument(false);
});

let lunrIndex = lunr(function() {
  this.field('title', { boost: 10 });
  this.field('body');
  this.ref('_ref');
});

let feeds = require('./fixtures/data');

feeds.forEach((feed) => {
  elasticlunrIndex.addDoc(feed);
  lunrIndex.add(feed);
});

const Benchmark = require('benchmark');
let suite = new Benchmark.Suite;

suite
  .add('elasticlunr#index.search', () => {
    lunrIndex.search('invoice');
  })
  .add('lunr#index.search', () => {
    elasticlunrIndex.search('invoice', {
      fields: {
        title: { boost: 2 },
        body: { boost: 1 },
      }
    });
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
