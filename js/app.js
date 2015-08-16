angular.module('myApp', [])
.provider('Weather', function() {
	var apiKey = "";

	this.setApiKey = function(key) {
		if (key) this.apiKey = key;
	};

	this.$get = function($q, $http) {
		var self = this;
		return {
			getWeatherForecast: function(city) {
				var d = $q.defer();
				$http({
					method: 'GET',
					url: self.getUrl("forecast", city),
					cache: true
				}).success(function(data){
					d.resolve(data.forecast.simpleforecast);
				}).error(function(err) {
					d.reject(err);
				});
				return d.promise;
			}
		}
	};

	this.getUrl = function(type, ext) {
		return "http://api.wunderground.com/api/" + 
			this.apiKey + "/" + type + "/q/" +
			ext + '.json';
	};
})
.config(function(WeatherProvider) {
	WeatherProvider.setApiKey('ef8c7c5f97ffed62');
})
.controller('MainCtrl', function($scope, $timeout, $filter, Weather) {
	// Build the date object
	$scope.date = {};

	$scope.greeting = {};

	$scope.weather = {};

	Weather.getWeatherForecast("NY/New_York")
	.then(function(data) {
		$scope.weather.forecast = data;
	});

	// Update function
	var updateTime = function() {
		$scope.date.raw = new Date();
		$timeout(updateTime, 1000);
		getGreeting();
	}

	var getGreeting = function() {
		var hour = $filter('date')($scope.date.raw, 'HH');
		if(hour >= 17 || hour <= 3)
			greeting = "evening";
		else if(hour > 3 && hour < 12)
			greeting = "morning";
		else if(hour >= 12 && hour < 17)
			greeting = "afternoon";

		$scope.greeting = "Good " + greeting + ".";
	}

	// Kick off the update function
	updateTime();
})