'use strict';

/* Controllers */

// Token controller

app.controller('TokenCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {
	
	$scope.loaded = false;
	$scope.started = false;

	$scope.token = {
		dumptoken: {result:[]},
		typeOptions:[
			{name:'all',group:1},
			{name:'(XX)_(array index)_(field nr)',group:2},
			{name:'c(1,2)X[_(array index)_(field nr)]',group:3},
			{name:'name',group:4}
		],
		tokenFields:[
			{name:'2-char token',model:'2chartoken',group:2},
			{name:'array index',model:'arrayindex',group:2},
			{name:'field nr',model:'fieldnr',group:2},
			{name:'c(1,2) token',model:'c12token',group:3}
		],
		operationOptions: ['Set','Add','Sub','Or','And','Clr'],
		operationFields:['key','indexArray','fieldNr','applyValue']
	};

	$scope.$watch('token.dumptoken.type',function(newValue,oldValue){
		$scope.token.dumptoken.result = [];
		$scope.token.dumptoken.data = [];
		$scope.loaded = false;
		$scope.started = false;
	});

	$scope.submitData = function(f){
		var string = '';
		$scope.started = true;
		if(f == 'dumptoken'){
			if($scope.token.dumptoken.type.name == 'all'){
				string = 'all';
			} else if($scope.token.dumptoken.type.name == 'name'){
				string = 'name';
			} else {
				for (var key in $scope.token.dumptoken.data) {
					if ($scope.token.dumptoken.data.hasOwnProperty(key)) {
						if($scope.token.dumptoken.data[key] != ''){
							string += $scope.token.dumptoken.data[key] + '_';
						}
					}
				}
			}
		}
		
		if(f == 'simsmibtoken'){
			string = '%40'+$scope.token.simsmibtoken.operation;
			for (var key in $scope.token.simsmibtoken.data) {
				if ($scope.token.simsmibtoken.data.hasOwnProperty(key)) {
					if($scope.token.simsmibtoken.data[key] != ''){
						string += '_'+$scope.token.simsmibtoken.data[key];
					}
				}
			}
			
		}
		
		var call = (string.slice(-1) == '_') ? f+string.replace(/_(?=[^_]*$)/, '') : f+string;

		getHttp.async(call).then(function(d) {
			console.log(call);
			if(d.data.indexOf('ERROR') >= 0 || d.data.indexOf('error ') >= 0 || d.data.indexOf('not ') >= 0){
				addAlert("danger",d.data);
			}
			else {
				if($scope.token.dumptoken){
					$scope.token.dumptoken.result = [];
					var rows = d.data.split('\n');
					var re = /^([a-z0-9:;"%]+)([a-z -]+)([a-z0-9:,;"%\[\] ]+)/g;
					rows.forEach(function(row){
						if(row != ''){
							$scope.token.dumptoken.result.push(row);
						}
					});
				}
				addAlert("success","Success: " + f);
			}
			$scope.loaded = true;
		});
		 
	}

	// managing alerts
	$scope.alerts = [];

	function addAlert(type,msg) {
		
		$scope.alerts.push({type: type, msg: msg});
		$timeout(function() {
			$scope.alerts.splice($scope.alerts.indexOf(alert), 1);
		}, 5000);
    };

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

}]);