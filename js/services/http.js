'use strict';
var base = "/odroid/xu4:3119c9/test?msg=";

app.service('getHttp', function($http) {
	this.async = function(url) {
		// $http returns a promise, which has a then function, which also returns a promise
		var promise = $http.get(base + url).then(function (response) {
			// The then function here is an opportunity to modify the response
			//console.log(response);
			// The return value gets picked up by the then in the controller.
			return response;
		});
		// Return the promise to the controller
		return promise;
	}
});
