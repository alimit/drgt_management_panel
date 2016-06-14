'use strict';

/**
 * Config for the router
 */
angular.module('app')
.run(['$rootScope', '$state', '$stateParams','$cookies','AuthenticationService',function ($rootScope,$state,$stateParams,$cookies,AuthenticationService) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		$rootScope.returnToState = ( (toState.name != 'access.signin') ? toState.name : $rootScope.returnToState );
		$rootScope.returnToStateParams = ( (toState.name != 'access.signin') ? toParams : $rootScope.returnToStateParams );
		var isLogin = (toState.name === "access.signin");
		if(isLogin){
			return; // no need to redirect 
		}
		
		AuthenticationService.IsLoggedIn( $cookies.get('user'), function(answer){
			if (answer === false){
				event.preventDefault();
				$state.go('access.signin',{},{reload:true});
			}
			
		});
	});
}])
.config(['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', "$locationProvider",function ($stateProvider,$urlRouterProvider,JQ_CONFIG,MODULE_CONFIG,$locationProvider) {
	
	$urlRouterProvider.otherwise( function($injector, $location) {
		var $state = $injector.get("$state");
		$state.go("app.dashboard");
	})
          
	$stateProvider
	.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: 'tpl/app.html'
	})
	.state('app.dashboard', {
		url: '/dashboard',
		templateUrl: 'tpl/app_dashboard_v1.html',
		resolve: load(['js/controllers/chart.js','js/controllers/dashboard.js'])
	})
	//settings
	.state('app.settings', {
		url: '/settings',
		templateUrl: 'tpl/settings.html',
		resolve: load(['js/controllers/settings.js','js/controllers/form.js','ui.select','ui.bootstrap.datetimepicker'])
	})
	//jackpot
	.state('app.jackpots', {
		url: '/jackpots',
		template: '<div ui-view class="fade-in-up"></div>',
		resolve: load(['js/controllers/jackpot.js','js/controllers/form.js','ui.select'])
	})
	.state('app.jackpots.jptriggervars', {
		url: '/jackpots/jptriggervars',
		templateUrl: 'tpl/jackpots_jptriggervars.html'
	})
	.state('app.jackpots.jptriggerdolocal', {
		url: '/jackpots/jptriggerdolocal',
		templateUrl: 'tpl/jackpots_jptriggerdolocal.html'
	})
	.state('app.jackpots.jppretrigger', {
		url: '/jackpots/jppretrigger',
		templateUrl: 'tpl/jackpots_jppretrigger.html'
	})
	.state('app.jackpots.jpmultihit', {
		url: '/jackpots/jpmultihit',
		templateUrl: 'tpl/jackpots_jpmultihit.html'
	})
	.state('app.jackpots.jpvalueset', {
		url: '/jackpots/jpvalueset',
		templateUrl: 'tpl/jackpots_jpvalueset.html'
	})
	.state('app.jackpots.jpvalueinc', {
		url: '/jackpots/jpvalueinc',
		templateUrl: 'tpl/jackpots_jpvalueinc.html'
	})
	.state('app.jackpots.jpcampaignstate', {
		url: '/jackpots/jpcampaignstate',
		templateUrl: 'tpl/jackpots_jpcampaignstate.html'
	})
	.state('app.jackpots.bigwinhit', {
		url: '/jackpots/bigwinhit',
		templateUrl: 'tpl/jackpots_bigwinhit.html'
	})
	//simulation
	.state('app.sim', {
		url: '/simulation',
		template: '<div ui-view class="fade-in-up"></div>',
		resolve: load(['js/controllers/simulation.js','js/controllers/form.js','ui.select'])
	})
	.state('app.sim.hitcard', {
		url: '/simulation/hitcard',
		templateUrl: 'tpl/sim_hitcard.html'
	})
	.state('app.sim.startrolldice', {
		url: '/simulation/startrolldice',
		templateUrl: 'tpl/sim_startrolldice.html'
	})
	.state('app.sim.rolldiceresult', {
		url: '/simulation/rolldiceresult',
		templateUrl: 'tpl/sim_rolldiceresult.html'
	})
	//tokens
	.state('app.token', {
		url: '/token',
		template: '<div ui-view class="fade-in-up"></div>',
		resolve: load(['js/controllers/token.js','js/controllers/form.js','ui.select'])
	})
	.state('app.token.dumptoken', {
		url: '/token/dumptoken',
		templateUrl: 'tpl/token_dumptoken.html'
	})
	.state('app.token.simsmibtoken', {
		url: '/token/simsmibtoken',
		templateUrl: 'tpl/token_simsmibtoken.html'
	})
				  
	// others
	.state('access', {
		url: '/access',
		template: '<div ui-view class="fade-in-right-big smooth"></div>'
	})
	.state('access.signin', {
		url: '/signin',
		templateUrl: 'tpl/page_signin.html',
		resolve: load( ['js/controllers/signin.js'] )
	})
	.state('access.404', {
		url: '/404',
		templateUrl: 'tpl/page_404.html'
	});

	function load(srcs, callback) {
		$locationProvider.html5Mode(true).hashPrefix('!');
		return {
			deps: ['$ocLazyLoad', '$q',function( $ocLazyLoad, $q ){
				var deferred = $q.defer();
				var promise  = false;
				srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
				if(!promise){
					promise = deferred.promise;
				}
				angular.forEach(srcs, function(src) {
					promise = promise.then( function(){
						if(JQ_CONFIG[src]){
							return $ocLazyLoad.load(JQ_CONFIG[src]);
						}
						angular.forEach(MODULE_CONFIG, function(module) {
							if( module.name == src){
								name = module.name;
							}else{
								name = src;
							}
						});
						return $ocLazyLoad.load(name);
					});
				});
				deferred.resolve();
				return callback ? promise.then(function(){ return callback(); }) : promise;
			}]
		}
	}
}]);
