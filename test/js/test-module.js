angular.module("ifray.collection-view.test", ["it.collections", "ui.bootstrap"])

.config(['itCollectionOptions', function (itCollectionOptions) {
	//itCollectionOptions.icons["default"] = "bs3";
}])

.controller("TestCtrl", ["$scope", "$modal", function ($scope, $modal) {
	$scope.source = [];
	var createImpl = function (count) {
		while ((--count) >= 0) {
			$scope.source.push({
				firstName : Faker.Name.firstName(),
				lastName : Faker.Name.lastName(),
				company : Faker.Company.companyName(),
				avatar : Faker.Image.avatar()
			});
		};
	};
	
	createImpl(_.random(30, 170));
	
	
	var EditModel = function ($scope, $modalInstance, model) {
		$scope.model = angular.copy(model);
		
		$scope.save = function (form) {
			$modalInstance.close( $scope.model);
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss("cancelled");
		};
	};
	
	$scope.command = function (name, model) {
		if (name === 'delete') {
			if (confirm("Are you sure you want to remove: " + model.firstName + "?") === false) {
				return;
			}
			_.some($scope.source, function (m, index) {
				if (angular.equals(model, m)) {
					$scope.source.splice(index, 1);
					return true;
				}
				return false;
			});
			return;
		};
		$modal.open({
			controller : EditModel,
			resolve : {
				model : function () {
					return model;
				}
			},
			templateUrl : "edit-template.html"
		}).result.then(function (m) {
			angular.extend(model, m);
		});
	};
}]);
