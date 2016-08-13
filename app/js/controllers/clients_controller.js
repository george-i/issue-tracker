angular.module("app").controller('ClientsController', function($scope, $rootScope, ApiService, $mdToast) {
    $scope.activeUser = $rootScope.activeUser;
    $scope.moment = moment;
    $scope.showNoclientsmsg = true;
    $scope.waitServer = true;
    $scope.getEventDate = function(ts){
        return moment(ts).format('DD/MM/YYYY');
    };
    $scope.getEventTime = function(ts){
        return moment(ts).format('HH:mm');
    };
    $scope.showClientsForm = function(){
        $scope.showNoclientsmsg = false;
        $('#add-client').show(300);
    };
    $scope.hideClientsForm = function(){
        $scope.showNoclientsmsg = true;
        $('#add-client').hide(300);
    };

    $scope.editClient = function(clt){
        $scope.clientEditing = clt;
    };
    $scope.updateClient = function(clt){
        $scope.waitServer = true;
        ApiService.put('client',clt, function(res){
            $scope.waitServer = false;
            var saveResult = '';
            if(res.success === true){
                saveResult = 's-a efectuat cu succes';
            }else{
                saveResult = 'nu a fost efectuata';
            }
            $scope.clientEditing = null;
        });
    };
    $scope.dismissEdit = function(){
        $scope.clientEditing = null;
    };
    $scope.removeClient = function(clt){
        $scope.waitServer = true;
        ApiService.remove('client', {_id: clt._id} , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                var oldclients = $scope.clients;
                var newclients = [];
                for(var i=0;i<oldclients.length;i++){
                    if(oldclients[i]._id !== clt._id){
                        newclients.push(oldclients[i]);
                    }
                }
                $scope.clients = newclients;
            }else{
                console.log('error');
            }
        });
    };

    $scope.createClient = function(){
        if($scope.newClient && $scope.newClient.length>0){
            $scope.waitServer = true;
            ApiService.post('client', {name: $scope.newClient} , function(res){
                $scope.waitServer = false;
                if(res.success === true){
                    $scope.clients.unshift(res.data);
                }else{
                    console.log('error');
                }
                $scope.hideClientsForm();
                $scope.newClient = '';
            });
        }
    };

    ApiService.get('clients', function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.clients = res.data;
        }else{
            console.log('error');
        }
    });
});
