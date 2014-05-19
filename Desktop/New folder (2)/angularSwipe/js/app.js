var HealthyHomes = angular.module('HealthyHomes', ['ngTouch']);

HealthyHomes.controller('home', function ($scope) {
	$scope.message = "this and that";
	
	$scope.nextPage = function() {
		$scope.message = "swiping right";	
	};
	
	$scope.prevPage = function() {
		$scope.message = "swiping left";	
	};
});