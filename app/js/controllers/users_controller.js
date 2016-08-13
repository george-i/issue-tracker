angular.module("app").controller('UsersController', function($scope, $rootScope, ApiService, $mdToast) {
    $scope.activeUser = $rootScope.activeUser;
    $scope.moment = moment;
    $scope.showNousersmsg = true;
    $scope.waitServer = true;
    $scope.getEventDate = function(ts){
        return moment(ts).format('DD/MM/YYYY');
    };
    $scope.getEventTime = function(ts){
        return moment(ts).format('HH:mm');
    };
    $scope.showUsersForm = function(){
        $scope.showNousersmsg = false;
        $('#add-user').show(300);
    };
    $scope.hideUsersForm = function(){
        $scope.showNousersmsg = true;
        $('#add-user').hide(300);
    };

    $scope.editUser = function(usr){
        $scope.userEditing = usr;
    };
    $scope.updateUser = function(usr){
        $scope.waitServer = true;
        ApiService.put('user',usr, function(res){
            $scope.waitServer = false;
            var saveResult = '';
            if(res.success === true){
                saveResult = 's-a efectuat cu succes';
                if(usr._id === $scope.activeUser._id){
                    $rootScope.activeUser = usr;
                }
            }else{
                saveResult = 'nu a fost efectuata';
            }
            $scope.userEditing = null;
            /*$mdToast.show(
                $mdToast.simple()
                    .textContent('Salvarea '+saveResult+'!')
                    .position('top right')
                    .hideDelay(3000)
            );*/
        });
    };
    $scope.dismissEdit = function(){
        $scope.userEditing = null;
    };
    $scope.removeUser = function(usr){
        $scope.waitServer = true;
        ApiService.remove('user', {_id: usr._id} , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                var oldusrs = $scope.users;
                var newusrs = [];
                for(var i=0;i<oldusrs.length;i++){
                    if(oldusrs[i]._id !== usr._id){
                        newusrs.push(oldusrs[i]);
                    }
                }
                $scope.users = newusrs;

            }else{
                console.log('error');
            }
        });
    };

    $scope.createUser = function(){
        if($scope.newUser && $scope.newUser.length>0){
            $scope.waitServer = true;
            ApiService.post('user', {user: $scope.newUser} , function(res){
                $scope.waitServer = false;
                if(res.success === true){
                    $scope.users.unshift(res.data);
                }else{
                    console.log('error');
                }
                $scope.hideUsersForm();
                $scope.newUser = '';
            });
        }
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
