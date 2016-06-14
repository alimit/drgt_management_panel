'use strict';

/* Controllers */

// Dashboard controller

app.controller('DashboardCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {

	$scope.refreshgetstate = function(){
		getState();
	}
	getState();

	function getState(){
		getHttp.async('getstate').then(function(d) {
			if(d.statusText == "OK"){
				var info = d.data.split('\n');
				$scope.getstate = info;
			}
		});
	}
}]);