
'use strict';

angular.module('authenticationService', []).factory('AuthenticationService',['$ocLazyLoad','$cookies','$http','$timeout','$state','$location','$rootScope','$injector','$interval',function ($ocLazyLoad,$cookies,$http,$timeout,$state,$location,$rootScope,$injector,$interval) {

	var service = {};
	var session_expire = 1;

	service.Login = Login;
	service.ClearCredentials = ClearCredentials;
	service.IsLoggedIn = IsLoggedIn;
	service.GetSession = GetSession;
	service.SessionChangeCheck = SessionChangeCheck;

	return service;

	function Login($scope,callback) {
		Auth($scope,function(data){
			callback(data);
		});
	}

	function Auth($scope,callback){
		GetLogins($scope.user.email,$scope.user.password,function(data){
			if(data.errorCode){
				callback(data);
			} else {
				$rootScope.user = data;
				$cookies.put('user', data.email);
				callback(data);
			}
		});
	}

	function ClearCredentials() {
		delete $rootScope.user;
		$cookies.remove('user');
		$state.go('access.signin');
	}

	function SessionChangeCheck(protectedPages){
		$interval(function(){
			IsLoggedIn($cookies.get('user'), function(answer){
				if(answer === false){
					ClearCredentials();
					$state.go('access.signin');
				} else {
					if($state.current.name == 'access.signin'){
						$state.go('app.dashboard');
					}
				}
			});
		},3000);
		$interval(function(){
			if($cookies.get('user')){
				IsSessionExpired($cookies.get('user'), function(answer){
					if(answer !== false){
						ClearCredentials();
						$state.go('access.signin', {}, {reload: true});
					}
				});
			}
		}, (session_expire * 60 * 1000) - 1000);
	}

	function IsLoggedIn(cookie, callback){
		if (cookie && !$rootScope.user) {
			GetPlayer($cookies.get('user'),function(answer){
				if(answer === false) {
					callback(false);
				}
				else {
					$rootScope.user = answer;
					callback(true);
				}
			});
		} else if (cookie && $rootScope.user) {
			callback(true);
		}
		else {
			callback(false);
		}
	}

	function IsSessionExpired(cookie, callback){
		GetSession($cookies.get('user'), function(answer){
			if(answer === false || answer === 'false'){
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	function GetPlayer(email,callback){
		GetSession(email, function(sessionResult){
			if(sessionResult !== false && sessionResult !== 'false'){
				callback(sessionResult);
			} else {
				callback(false);
			}
		});
	}

	function GetSession(email,callback){
		$http.get("/api/login.json").success(function (data){
			var result = false;
			data.forEach(function(users){
				if(users.email == email){
					result = {email: users.email, name: users.name};
				}
			});
			callback(result);
		})
		.error(function (){
			callback(false);
		});
		/*$http.get("/users/auth/"+session)
		.success(function (newsession, status, headers, config){
			if(newsession !== false && newsession !== 'false'){
				callback(newsession);
			} else {
				callback(false);
			}
		})
		.error(function (data, status, headers, config){
			callback(false);
		});*/
	}

	function GetLogins(user,pass,callback){
		$http.get("/api/login.json").success(function (data){
			var result = {errorCode: 2, errorMsg: "user not found"};
			data.forEach(function(users){
				if(users.email == user && users.password == pass){
					result = {email: users.email, name: users.name};
				}
			});
			callback(result);
		})
		.error(function (){
			callback({errorCode: 1, errorMsg: "service error"});
		});
	}

}]);