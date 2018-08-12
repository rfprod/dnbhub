/* global inject, expect */

describe('Dnbhub directives', () => {

	beforeEach(module('dnbhub'));

	describe('setElementDimensionsOnload', () => {
		let scope, compile;

		beforeEach(inject(($rootScope, $compile) => {
			scope = $rootScope.$new();
			compile = $compile;
		}));
		
		it('should be defined', () => {
			const element = compile("<set-element-dimensions-onload></set-element-dimensions-onload>")(scope);
			scope.$digest();
			expect(element.html()).toEqual("");
		});
		
	});

});
