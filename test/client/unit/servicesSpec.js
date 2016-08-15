/* global inject, expect */

beforeEach(module('dnbhubServices'));

describe('Dnbhub services', function() {
  var service;

  beforeEach(inject(function(freedownloadsService) {
    service = freedownloadsService;
  }));

  it('freedownloadsService factory must be defined', function() {
      expect(service).toBeDefined();
  });

  it('freedownloadsService must have query method, which returns a promise', inject(function($rootScope) {
      expect(service.query).toBeDefined();
      service.query({}).$promise.then(function(response){
        expect(response).toBeDefined();
      });
  }));

});