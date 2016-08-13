angular.module("app").controller('HomeController', function($scope, ApiService) {
    $scope.title = "Home";
    $scope.waitServer = true;
    $scope.login = {
        email: '',
        password: ''
    };
    ApiService.get('users', function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.users = res.data;
        }else{
            console.log('error');
        }
    });


});
