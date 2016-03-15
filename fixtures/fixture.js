var faker = require('faker');

module.exports = function(factory) {

  factory.define('DocumentParam', [
    'dueDate'.asDate(),
    'date'.asDate(),
    'client'.as(function() {
      return faker.name.findName();
    }),
    'docNumber'.asNumber(),
    'docNumberFormat'.asNumber(),
    'type'.as(function() {
      var docTypes = ['Invoice', 'Estimate', 'Purchase Order', 'Credit Memo'];
      return docTypes[Math.floor((Math.random() * 4))];
    }),
    'terms'.asNumber(),
    'status',
    'balance'.as(function() {
      return faker.finance.amount();
    }),
    'subtotal'.as(function() {
      return faker.finance.amount();
    }),
    'total'.as(function() {
      return faker.finance.amount();
    }),
    'paid'.as(function() {
      return faker.finance.amount();
    }),
    'unpaid'.as(function() {
      return 0;
    }),
    'currency'.as(function() {
      return faker.finance.currencyCode();
    }),
    'updatedAt'.asDate(),
    'createdAt'.asDate()
  ]);

  factory.define('Document', [
    'id',
    'key',
    'trackableId'.asNumber(),
    'trackableType'.as(function() {
      return 'Document';
    }),
    'updatedAt'.asDate(),
    'params'.fromFixture('DocumentParam')
  ]);
};
