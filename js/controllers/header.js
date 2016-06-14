'use strict';

/* Controllers */

// Header controller

app.controller('HeaderCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {

	$scope.submitData = function(f){
		getHttp.async(f).then(function(d) {});
	}
}]);