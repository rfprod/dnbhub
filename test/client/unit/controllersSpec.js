/* global inject, expect, spyOn */

describe('Dnbhub controllers', function() {

	beforeEach(module('dnbhub'));

	describe('blogCtrl', function(){
		var scope, ctrl, blogPostsService, firebaseService;

		beforeEach(inject(function($rootScope, $controller, _blogPostsService_, _firebaseService_) {
			scope = $rootScope.$new();
			ctrl = $controller('blogCtrl', {$scope: scope});
			blogPostsService = _blogPostsService_;
			spyOn(blogPostsService,'query').and.callThrough();
			firebaseService = _firebaseService_;
		}));
		
		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});
		
		it('should have variables and methods defined', function() {
			expect(scope.blogPosts.length).toEqual(0);
		});
		
	});

});
