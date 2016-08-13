angular.module('app').controller('ReportsController', function ($scope, ApiService) {
    $scope.showReports = false;
    $scope.waitServer = true;
    $scope.moment = moment;
    $scope.getEventDate = function(ts){
        return moment(ts).format('DD/MM/YYYY');
    };
    $scope.getEventTime = function(ts){
        return moment(ts).format('HH:mm');
    };

    ApiService.get('clients', function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.clientsList = res.data;
        }else{
            console.log('error');
        }
    });
    ApiService.get('users', function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.usersList = res.data;
        }else{
            console.log('error');
        }
    });
    $scope.report = {
        'type': 'user',
        'query': '',
        'from': new Date(),
        'to': new Date()
    };

    $scope.selectedItemChange = function(item){
        if(item){
            $scope.report.query = item._id;
        }else{
            $scope.report.query = '';
        }
    };
    $scope.typeChanged = function(){
        $scope.report.query = '';
    };


    $scope.updateReportTable = function(){
        $scope.showReports = false;
        if($scope.report.action){
            delete $scope.report.action;
        }
        var iq = $scope.report;
        ApiService.get('reports', {params: $.param(iq)}, function(res){
            $scope.waitServer = false;
            if(res.success === true){
                $scope.emergencies = res.data;
                if($scope.emergencies.length === 0){
                    $scope.hasRecords = false;
                }else{
                    $scope.hasRecords = true;
                }
                $scope.showReports = true;
            }else{
                console.log('error');
            }
        });
    };

    $scope.saveReportTable = function(){
        var iq = $scope.report;
        iq.action = 'export';
        var dlink = 'http://localhost:3000/api/reports/get?'+$.param(iq);
        var win = window.open(dlink, '_blank');
        win.focus();
    };
    $scope.dismissSave = function(){
        $scope.showReports = false;
    };
});