'use strict';

/* Controllers */

// Simulation controller

app.controller('SimulationCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {
	var now = new Date();
	$scope.sim = {
		hitcard: {cardid:23},
		setuptime: now, 
		screenIds:['egm', 'drscreen', 'systeminfo', 'progressive', 'advertisement', 'virtualglass','bigwin'],
		logOptions: ['info','debug'],
		loggerOptions: ['debug', 'verbose', 'normal' ]
	};

	$scope.submitData = function(f){
		var string = '';
		if(f == 'hitcard'){
			string = $scope.sim.hitcard.cardid;
		}
		if(f == 'startrolldice'){
			
		}
		if(f == 'rolldiceresult'){
			string = $scope.sim.rolldiceresult.numHits;
		}
		if(f == 'bigwinhit'){
			string = $scope.sim.bigwinhit.amount;
		}
		if(f == 'logsmibas'){
			string = $scope.settings.logsmibas;
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

}]);