'use strict';

describe('Expences E2E Tests:', function () {
  describe('Test Expences page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/expences');
      expect(element.all(by.repeater('expence in expences')).count()).toEqual(0);
    });
  });
});
