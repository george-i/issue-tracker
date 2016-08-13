angular.module('app').controller('FeaturesController', function ($scope, ApiService, $timeout) {

    var socket = io.connect('http://localhost:8123');
    socket.emit('giveMeData', function(data){
        $timeout(function(){
            $scope.$apply(function(){
                $scope.usersMessage = data;
            });
        });
    });
    $scope.usersMessage = '';
    $scope.mongoItems = [];
    socket.on('newMessage', function (msg) {
        $timeout(function(){
            $scope.$apply(function(){
                 $scope.mongoItems.push(msg);
            });
        });
    });
    socket.on('clearMessages', function (msg) {
        $timeout(function(){
            $scope.$apply(function(){
                $scope.mongoItems = msg;
            });
        });
    });
    $scope.saveMessage = function(){
        ApiService.post('message', {message: $scope.usersMessage},function (res) {
            console.log(res);
            $timeout(function(){
                $scope.$apply(function(){
                    //$scope.mongoItems.push(res.data);
                });
            });
        });
        //ApiService.Messages.add({message: $scope.usersMessage});
    };
    $scope.getMessages = function(){
        ApiService.get('messages', {message: $scope.usersMessage},function (res) {
            $timeout(function(){
                $scope.$apply(function(){
                   $scope.mongoItems = res.data;
                });
            });
        });
    };
    $scope.clearMessages = function(){
        ApiService.remove('messages',function (res) {
            console.log(res.data);
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.mongoItems = res.data;
                });
            });
        });
    };

    $scope.writeMsg = function(){
        socket.emit('writing', $scope.usersMessage);
    };

    socket.on('writing', function (msg) {
        $timeout(function(){
            $scope.$apply(function(){
                $scope.usersMessage = msg;
            });
        });
    });
});

