'use strict';

/*global browser, expect, element, by */

describe('Dnbhub: ', function() {

  it('should have only index view and must redirect properly', function() {
    browser.ignoreSynchronization = false;
    browser.get('public/index.html');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/');
      });
  });

  describe('indexCtrl', function() {

    beforeEach(function() {
      browser.get('/');
    });

/*
*   some old tests as a quick example
*
    it('should filter the labels list as a user types into the search box', function() {
      var labelsList = element.all(by.repeater('label in publicData[1].labels'));
      var query = element(by.model('labelSearchQuery'));
      query.sendKeys('ram records');
      expect(labelsList.count()).toBe(1);
      query.clear();
      query.sendKeys('barcode recordings');
      expect(labelsList.count()).toBe(1);
    });
    it('should be possible to control labels order via the drop down select box', function() {
      var labelName = element.all(by.repeater('label in publicData[1].labels').column('label.username'));
      function getNames() {
        return labelName.map(function(elm) {
          return elm.getText();
        });
      }
      expect(getNames()).toMatch(/^RAM Records/);
      
      element(by.model('orderProp')).element(by.css('option[value="username"]')).click();
      expect(getNames()).toMatch(/^B/);
    });
*/
  });
});