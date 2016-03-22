var faker = require('faker');

module.exports = function(factory) {

  factory.define('Document', [
    'id',
    'title'.as(function() {
      return faker.name.findName();
    }),
    'body'.as(function() {
      return faker.lorem.paragraph();
    })
  ]);
};
