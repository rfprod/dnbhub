/* global inject, expect, spyOn */

describe('Dnbhub controllers', function() {

  beforeEach(module('dnbhub'));

  describe('blogCtrl', function(){
    var scope, ctrl, usSpinnerService, blogPostsService;

    beforeEach(inject(function($rootScope, $controller, _usSpinnerService_, _blogPostsService_) {
      scope = $rootScope.$new();
      ctrl = $controller('blogCtrl', {$scope: scope});
      usSpinnerService = _usSpinnerService_;
      spyOn(usSpinnerService,'spin').and.callThrough();
      blogPostsService = _blogPostsService_;
      spyOn(blogPostsService,'query').and.callThrough();
    }));
    
    it('should be defined', function() {
      expect(ctrl).toBeDefined();
    });
    
    it('should have variables and methods defined', function() {
      expect(scope.blogPosts.length).toEqual(0);
    });
    
  });

});