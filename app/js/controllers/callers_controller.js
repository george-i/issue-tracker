angular.module("app").controller('CallersController', function($scope, $rootScope, ApiService, $mdToast) {
    $scope.activeUser = $rootScope.activeUser;
    $scope.moment = moment;
    $scope.showNocallersmsg = true;
    $scope.waitServer = true;
    $scope.getEventDate = function(ts){
        return moment(ts).format('DD/MM/YYYY');
    };
    $scope.getEventTime = function(ts){
        return moment(ts).format('HH:mm');
    };
   
    $scope.removeCaller = function(clt){
        $scope.waitServer = true;
        ApiService.remove('caller', {_id: clt._id} , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                var oldcallers = $scope.callers;
                var newCallers = [];
                for(var i=0;i<oldcallers.length;i++){
                    if(oldcallers[i]._id !== clt._id){
                        newCallers.push(oldcallers[i]);
                    }
                }
                $scope.callers = newCallers;
            }else{
                console.log('error');
            }
        });
    };

    $scope.createCaller = function(){
        if($scope.newCaller && $scope.newCaller.length>0){
            $scope.waitServer = true;
            ApiService.post('caller', {name: $scope.newCaller} , function(res){
                $scope.waitServer = false;
                if(res.success === true){
                    $scope.callers.unshift(res.data);
                }else{
                    console.log('error');
                }
                $scope.hideClientsForm();
                $scope.newCaller = '';
            });
        }
    };

    ApiService.get('caller', {params: $.param({clientId: ''})}, function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.callers = res.data;
            console.log($scope.callers);
        }else{
            console.log('error');
        }
    });
    $scope.getNiceInfo = function(txt){
        return txt.toString();
    };
});
