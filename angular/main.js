"use strict";

var module = angular.module("people", []); //create module named 'people' without any angular dependencies

module.controller("PeopleCntrl", function($scope, $http){
	$scope.people = [];
	$scope.toEdit = null;


	$http.get("../data/people.json").success(function(data){
		$scope.people = data;
	});

	$scope.deletePerson = function(person){
		var index = $scope.people.indexOf(person);

		$scope.people.splice(index, 1);
	};

	$scope.editPerson = function(person){

		if(angular.isObject(person)){
			$scope.toEdit = person;
		} else {
			$scope.toEdit = {
				id : Date.now(),
				firstName : "",
				lastName : ""
			};
		}
	};

	$scope.apply = function(person){

		if($scope.people.indexOf(person) === -1){
			$scope.people.push(person);
		}

		$scope.toEdit = null;
	};


	$scope.$watch("people", function(){


	}, true)

});
