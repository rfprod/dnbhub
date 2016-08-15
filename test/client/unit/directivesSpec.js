/* global inject, expect */

describe('Dnbhub directives', function() {

  beforeEach(module('dnbhub'));

  describe('setElementDimensionsOnload', function(){
    var scope, compile;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    }));
    
    it('should be defined', function() {
      var element = compile("<set-element-dimensions-onload></set-element-dimensions-onload>")(scope);
      scope.$digest();
      expect(element.html()).toEqual("");
    });
    
  });

});