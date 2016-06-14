'use strict';

/* Controllers */

// Settings controller

app.controller('SettingsCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {
	var now = new Date();
	$scope.settings = {
		data:'',
		setuptime: now, 
		screenIds:['egm', 'drscreen', 'systeminfo', 'progressive', 'advertisement', 'virtualglass','bigwin'],
		logOptions: ['info','debug'],
		loggerOptions: ['debug', 'verbose', 'normal' ],
		wofOptions: ['inited','waitstart','wheelspinning','showprize']
	};

	$scope.submitData = function(f){
		var string = '';
		if(f == 'setudptime'){
			string = '_'+$scope.settings.setuptime.getTime()+'_0';
		}
		if(f == 'screento'){
			string = $scope.settings.screento;
		}
		if(f == 'screenbackfrom'){
			string = $scope.settings.screento;
		}
		if(f == 'logjsonas'){
			string = $scope.settings.logjsonas;
		}
		if(f == 'setmastervolume'){
			string = $scope.settings.setmastervolume;
		}
		if(f == 'setactivestream'){
			for (var key in $scope.settings.setactivestream) {
				if ($scope.settings.setactivestream.hasOwnProperty(key)) {
					if($scope.settings.setactivestream[key] != ''){
						string += $scope.settings.setactivestream[key]+'_';
					}
				}
			}
		}
		if(f == 'featurebegin'){
			for (var key in $scope.settings.featurebegin) {
				if ($scope.settings.featurebegin.hasOwnProperty(key)) {
					if($scope.settings.featurebegin[key] != ''){
						string += $scope.settings.featurebegin[key]+'_';
					}
				}
			}
		}

		

		var call = f+string.replace(/_(?=[^_]*$)/, '');

		if(f == 'logger'){
			call = $scope.settings.logger;
		}

		getHttp.async(call).then(function(d) {
			if(d.data.indexOf('ERROR') >= 0){
				addAlert("danger",d.data);
			} else {
				addAlert("success","Success: " + f);
			}
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

	// calendar
	$scope.isOpen = false;
	$scope.openCalendar = function(e) {
		e.preventDefault();
		e.stopPropagation();
		$scope.isOpen = true;
	};

}]);

function getFormattedDate(d){
	d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
	return d;
}
app.directive('myformat', function() {
  return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
  			ngModel.$parsers.push(function(viewValue) {
				return +viewValue;
			});
		}
	}
});