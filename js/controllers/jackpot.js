'use strict';

/* Controllers */

// Jackpot controller

app.controller('JackpotCtrl', ['$scope','$state','$timeout','getHttp', function($scope,$state,$timeout,getHttp) {
	
	$scope.jp = {
		jptriggerdolocalOptions:['true','false'],
		jptrigger:{JpId:'HW02',value:4000,participatingegms:2,totalparticipationvalue:400},
		jpvalueset: {JpId:'HW02',value:4000,participationValue:2000,numParticipatingEgms:2},
		jpvalueinc: {JpId:'HW02',value:4000,participationValue:2000,numParticipatingEgms:2},
		jpcampaignstateOptions:['not_running','jp_active','show_jplist']
	};

	function getTriggervars(){
		getHttp.async('jptriggervars').then(function(d) {
			if(d.statusText == "OK"){
				var rows = d.data.split('\n');
				$scope.jp.jptriggervars = [];
				rows.forEach(function(row){
					if(row !== ''){
						var info = row.split(' = ');
						$scope.jp.jptriggervars.push({label: info[0], value: info[1].trim().replace(/(^\'+|\'+$)/mg, '')});
					}
				});
			}
		});
	}
	getTriggervars()

	$scope.submitData = function(f){
		var string = '';

		if(f == 'jptriggervars'){
			$scope.jp.jptriggervars.forEach(function(trigger){
				string += trigger.value+'_';
			});
		}
		if(f == 'jptriggerdolocal'){
			string = $scope.jp.jptriggerdolocal;
		}
		if(f == 'jppretrigger'){
			string = '_'+$scope.jp.jppretrigger;
		}
		if(f == 'jptrigger'){
			for (var key in $scope.jp.jptrigger) {
				if ($scope.jp.jptrigger.hasOwnProperty(key)) {
					string += '_'+$scope.jp.jptrigger[key];
				}
			}
		}
		if(f == 'jpvalueset'){
			for (var key in $scope.jp.jpvalueset) {
				if ($scope.jp.jpvalueset.hasOwnProperty(key)) {
					if($scope.jp.jpvalueset[key] != ''){
						string += '_'+$scope.jp.jpvalueset[key];
					}
				}
			}
		}
		if(f == 'jpvalueinc'){
			for (var key in $scope.jp.jpvalueinc) {
				if ($scope.jp.jpvalueinc.hasOwnProperty(key)) {
					if($scope.jp.jpvalueinc[key] != ''){
						string += '_'+$scope.jp.jpvalueinc[key];
					}
				}
			}
		}
		if(f == 'jpcampaignstate'){
			string += $scope.jp.jpcampaignstate;
		}
		if(f == 'bigwinhit'){
			string = $scope.jp.bigwinhit.amount;
		}

		var call = f+string;
		getHttp.async(f+string).then(function(d) {
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