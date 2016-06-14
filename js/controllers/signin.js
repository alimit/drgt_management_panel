'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope','$rootScope','$state','AuthenticationService', function($scope,$rootScope,$state,AuthenticationService) {
	$scope.user = {};
	$scope.authError = null;
	$scope.login = function() {
		AuthenticationService.Login($scope,function(data){
			if(data.errorCode){
				$scope.authError = data.errorMsg;
			} else {
				if($rootScope.returnToState && $rootScope.returnToState != 'access.signin'){
					$state.go( $rootScope.returnToState, $rootScope.returnToStateParams, {reload: true});
				}
				else {
					$state.go('app.dashboard', {}, {reload: true});
				}
			}
		});
	}
	/*$scope.login = function() {
		$scope.authError = null;
		// Try to login
		$http.post('api/login', {email: $scope.user.email, password: $scope.user.password}).then(function(response) {
			if ( !response.data.user ) {
				$scope.authError = 'Email or Password not right';
			}else{
				$state.go('app.dashboard-v1');
			}
		}, function(x) {
			$scope.authError = 'Server Error';
		});
	};*/
}]);