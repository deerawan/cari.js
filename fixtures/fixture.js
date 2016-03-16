var faker = require('faker');

module.exports = function(factory) {

  factory.define('Document', [
    'id',
    'title',
    'body'
  ]);
};
