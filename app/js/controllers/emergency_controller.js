angular.module("app").controller('EmergencyController', function($scope, $rootScope, ApiService, $log, $filter, $timeout, $mdDialog, $sce) {
    $scope.activeUser = $rootScope.activeUser;
    $scope.moment = moment;
    $scope.showNoEmergencyMsg = true;
    $scope.formModeNew = true;
    $scope.waitServer = true;
    var resetCallersWatcher = $scope.$watch('callers', function () {});
    $scope.getEventDate = function(ts){
        return moment(ts).format('DD/MM/YYYY');
    };
    $scope.getEventTime = function(ts){
        return moment(ts).format('HH:mm');
    };

    $scope.pages = [];
    $scope.defaultIssue = function(){
        return {
            issue: '',
            issueTime: '',
            solution: '',
            client: '',
            clientId: '',
            responseTime: '',
            date: new Date(),
            hour: '',
            minutes:'',
            caller: {}
        };
    };
    $scope.defaultCaller = function(){
        return {
            name: '',
            _id: '',
            clientId: '',
            clientName: '',
            phone: [],
            email: []
        };
    };

    $scope.newIssue = new $scope.defaultIssue();
    $scope.caller = new $scope.defaultCaller();
    $scope.callers = [];



    $scope.showEmergencyForm = function(isEdit){
        if(!isEdit){
            $scope.searchText = null;
            $scope.callerSearchText = null;
            $scope.phoneSearchText = null;
            $scope.emailSearchText = null;
        }
        $scope.showNoEmergencyMsg = false;
        $('#add-emergency').show(300);
    };
    $scope.hideEmergencyForm = function(){
        $scope.searchText = null;
        $scope.callerSearchText = null;
        $scope.phoneSearchText = null;
        $scope.emailSearchText = null;
        $scope.showNoEmergencyMsg = true;
        $('#add-emergency').hide(300);
    };

    var checkFormErrors = function(){
        if(
            !$scope.newIssue.passenger ||
            $scope.newIssue.passenger.length===0 ||
            !$scope.newIssue.issue ||
            $scope.newIssue.issue.length<2 ||
            !$scope.newIssue.solution ||
            $scope.newIssue.solution.length<2
        ){
            return false;
        }else{
            return true;
        }
    };

    $scope.editIssue = function(emr){
        $scope.emrEditing = emr;
        $scope.showEmergencyForm(true);
        for(var i=0;i<$scope.clientsList.length;i++){
            if($scope.clientsList[i]._id === emr.clientId){
                $scope.selectedItem = $scope.clientsList[i];
                $scope.searchText = $scope.selectedItem.name;
            }
        }
        $scope.formModeNew = false;
        $scope.newIssue = emr;
        $scope.newIssue.date = moment(emr.issueTime).toDate();
        $scope.newIssue.hour = moment(emr.issueTime).hours();
        $scope.newIssue.minutes = moment(emr.issueTime).minutes();
        if(emr.callerName){
            $scope.newIssue.caller = {
                name: emr.callerName,
                phone: emr.callerPhone,
                email: emr.callerEmail
            };
        }
        $scope.$watch('callers', function (newt,oldt) {
            if(newt !== oldt && $scope.emrEditing){
                var scls = $scope.callers;
                var callerFound, callerPhoneFound, callerEmailFound;
                for(var i=0;i<scls.length;i++){
                    if(scls[i].name === emr.callerName){
                        callerFound = scls[i];
                        $scope.newIssue.caller._id = callerFound._id;
                        $scope.caller = callerFound;
                        $scope.selectedCaller = callerFound;
                        for(var j=0;j<callerFound.phone.length;j++){
                            if(callerFound.phone[j] === emr.callerPhone){
                                callerPhoneFound = emr.callerPhone;
                            }
                        }
                        for(var k=0;k<callerFound.email.length;k++){
                            if(callerFound.email[k] === emr.callerEmail){
                                callerEmailFound = emr.callerEmail;
                            }
                        }
                    }
                }
                if(callerPhoneFound){
                    $timeout(function(){
                        $scope.selectedPhone = callerPhoneFound;
                    },200);
                }else{
                    $scope.phoneSearchText = emr.callerPhone;
                }
                if(callerEmailFound){
                    $timeout(function(){
                        $scope.selectedEmail = callerEmailFound;
                    },200);
                }else{
                    $scope.emailSearchText = emr.callerEmail;
                }
            }

        });


    };

    ApiService.get('issues', {params: $.param({skip: 0,limit:50})}, function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.emergencies = res.data;
        }else{
            console.log('error');
        }
    });
    var selectedItem;
    var createIssue = function(issue){
        issue.caller = {};

        if($scope.caller._id.length>0){
            issue.caller._id = $scope.caller._id;
        }
        if($scope.phoneSearchText && $scope.phoneSearchText.length>2){
            issue.caller.phone = $scope.phoneSearchText;
        }
        if($scope.emailSearchText && $scope.emailSearchText.length>2){
            issue.caller.email = $scope.emailSearchText;
        }
        issue.caller.name = $scope.callerSearchText;
        ApiService.post('issue', issue , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                $scope.emergencies.unshift(res.data);
            }else{
                console.log('error');
            }
            $scope.dismissEdit();
        });
    };

    $scope.createIssue = function(){
        if(!checkFormErrors()){
            return false;
        }
        $scope.formModeNew = true;
        var issue = $scope.newIssue;
        issue.issueTime = moment($scope.newIssue.date).set('hour', $scope.newIssue.hour).set('minute', $scope.newIssue.minutes).unix()*1000;
        issue.user = $scope.activeUser.user;
        issue.userId = $scope.activeUser._id;

       /* delete issue.date;
        delete issue.hour;
        delete issue.minutes;*/

        $scope.waitServer = true;
        if($scope.searchText.length>2){
            if(selectedItem == null){
                $scope.waitServer = true;
                ApiService.post('client', {name: $scope.searchText} , function(res){
                    $scope.waitServer = false;
                    if(res.success === true){
                        issue.client = res.data.name;
                        issue.clientId = res.data._id;
                        $scope.clientsList.unshift(res.data);
                        createIssue(issue);
                    }else{
                        console.log('error');
                    }
                });
            }else{
                issue.client = selectedItem.name;
                issue.clientId = selectedItem._id;
                createIssue(issue);
            }
        }

    };
    $scope.removeIssue = function(emr){
        $scope.waitServer = true;
        ApiService.remove('issue', {_id: emr._id} , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                var oldemr = $scope.emergencies;
                var newemr = [];
                for(var i=0;i<oldemr.length;i++){
                    if(oldemr[i]._id !== emr._id){
                        newemr.push(oldemr[i]);
                    }
                }
                $scope.emergencies = newemr;
            }else{
                console.log('error');
            }
        });
    };

    var updateIssue = function(issue){
        ApiService.put('issue',issue, function(res){
            $scope.waitServer = false;
            $scope.dismissEdit();
        });
    };
    $scope.updateIssue = function(){
        if(!checkFormErrors()){
            return false;
        }
        if(!$scope.selectedCaller){
            $scope.newIssue.caller.name = $scope.callerSearchText;
            delete $scope.newIssue.caller._id;
        }
        var issue = $scope.newIssue;
        issue.callerName = $scope.callerSearchText;
        if($scope.phoneSearchText && $scope.phoneSearchText.length>2){
            $scope.newIssue.caller.phone = $scope.phoneSearchText;
            issue.callerPhone = $scope.phoneSearchText;
        }else{
            issue.callerPhone = $scope.newIssue.caller.phone;
        }
        if($scope.emailSearchText && $scope.emailSearchText.length>2){
            $scope.newIssue.caller.email = $scope.emailSearchText;
            issue.callerEmail = $scope.emailSearchText;
        }else{
            issue.callerEmail = $scope.newIssue.caller.email;
        }

        issue.issueTime = moment($scope.newIssue.date).set('hour', $scope.newIssue.hour).set('minute', $scope.newIssue.minutes).unix()*1000;
        issue.user = $scope.activeUser.user;
        issue.userId = $scope.activeUser._id;
        issue._id = $scope.emrEditing._id;
        delete issue.date;
        delete issue.hour;
        delete issue.minutes;
        $scope.waitServer = true;
        if(selectedItem == null && $scope.searchText){
            if($scope.searchText.length>2){
                $scope.waitServer = true;
                ApiService.post('client', {name: $scope.searchText} , function(res){
                    $scope.waitServer = false;
                    if(res.success === true){
                        issue.client = res.data.name;
                        issue.clientId = res.data._id;
                        $scope.clientsList.unshift(res.data);
                        updateIssue(issue);
                    }else{
                        console.log('error');
                    }
                });
            }
        }else{
            issue.client = selectedItem.name;
            issue.clientId = selectedItem._id;
            updateIssue(issue);
        }

    };
    $scope.dismissEdit = function(){
        $scope.hideEmergencyForm();
        $timeout(function(){
            resetCallersWatcher();
            $scope.formModeNew = true;
            $scope.emrEditing = null;
            selectedItem = null;
            $scope.selectedItem = null;
            $scope.selectedCaller = null;
            $scope.selectedPhone = null;
            $scope.selectedEmail = null;

            $scope.searchText = null;
            $scope.callerSearchText = null;
            $scope.phoneSearchText = null;
            $scope.emailSearchText = null;
            $scope.newIssue = new $scope.defaultIssue();
            $scope.caller = new $scope.defaultCaller();
            $scope.newIssue.caller = {};
            $scope.callers = [];
            $scope.newIssue.user = $scope.activeUser;
            $scope.foundItemsLength = -1;
        },1400);
    };

    $scope.showCallerDetails = function(ev,iss) {
        var dContent = '';
        if(iss.callerPhone && iss.callerPhone.length>0){
            dContent += 'Telefon: '+iss.callerPhone+'<br/>';
        }
        if(iss.callerEmail && iss.callerEmail.length>0){
            dContent += 'Email: <a href="mailto:'+iss.callerEmail+'">'+iss.callerEmail+'</a><br/>';
        }
        dContent = $sce.trustAsHtml(dContent);
        var dTemplate =
            '<md-dialog aria-label="Datele apelantului">' +
            '   <md-dialog-content class="md-dialog-content">'+
            '       <h2 class="md-title">'+iss.callerName+'</h2>'+
            '       '+dContent+
            '   </md-dialog-content>' +
            '  <md-dialog-actions>' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '      Ok' +
            '    </md-button>' +
            '  </md-dialog-actions>' +

            '</md-dialog>';
        $mdDialog.show(
            $mdDialog.alert({
                template: dTemplate,
                clickOutsideToClose: true,
                targetEvent: ev,
                controller: function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };
                }
            })
        );
    };



    var selectedIssueLog = null, oldSelectedHistory;

    var DialogController = function($scope, $mdDialog) {
        oldSelectedHistory = [];
        $scope.displayNewIssue = null;
        $scope.newLogIssue = {};
        $scope.getEventDate = function(ts){
            return moment(ts).format('DD/MM/YYYY');
        };

        $scope.closeIssueEdit = function(issedit){
            issedit.issueTime = moment(issedit.date).set('hour', issedit.hour).set('minute', issedit.minutes).unix()*1000;
            issedit.enabled = false;
        };

        $scope.newIssueAdd = function(){
            var nli = $scope.newLogIssue;
            nli.issueTime = moment(nli.date).set('hour', nli.hour).set('minute', nli.minutes).unix()*1000;
            $scope.selectedIssueLog.history.push(nli);
            $scope.showNewIssue(false);
        };
        $scope.removeItem = function(index){
            $scope.selectedIssueLog.history.splice(index, 1);
        };

        $scope.showNewIssue = function(show){
            if(show){
                $scope.displayNewIssue = true;
            }else{
                $scope.displayNewIssue = null;
            }
        };
        $scope.getEventTime = function(ts){
            return moment(ts).format('HH:mm').split(':');
        };

        for(var j=0;j<selectedIssueLog.history.length;j++){
            oldSelectedHistory.push(selectedIssueLog.history[j]);
        }
        $scope.selectedIssueLog = selectedIssueLog;
        $scope.activeUser = selectedIssueLog.activeUser;
        $scope.closeWithSave = function(answer) {
            if(answer){
                _.indexBy($scope.selectedIssueLog.history,'issueTime');
                ApiService.put('issuelog',{_id: $scope.selectedIssueLog,history: selectedIssueLog.history}, function(res){
                    $mdDialog.hide();
                });
            }else{
                $scope.selectedIssueLog.history = oldSelectedHistory;
                $mdDialog.hide();
            }
        };
    };
    $scope.getResponseSum = function(emr){
        var rt = 0;
        for(var i=0; i<emr.history.length; i++){
            rt += emr.history[i].responseTime;
        }
        return rt;
    };
    $scope.showIssueLog = function(ev, emr) {
        selectedIssueLog = emr;
        selectedIssueLog.activeUser = $scope.activeUser;
        _.indexBy(selectedIssueLog.history,'issueTime');
        for(var i=0; i<selectedIssueLog.history.length;i++){
            var it = selectedIssueLog.history[i];
            it.date = moment(it.issueTime).toDate();
            it.hour = moment(it.issueTime).hours();
            it.minutes = moment(it.issueTime).minutes();
        }
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'dialogues/issue_history.html',
                targetEvent: ev,
                clickOutsideToClose:true
            });
    };


    /* Callers management */
    $scope.getCallers = function(clientId){
        ApiService.get('callers',{params: $.param({clientId: clientId})} , function(res){
            $scope.waitServer = false;
            if(res.success === true){
                $scope.callerSearchText = null;
                $scope.phoneSearchText = null;
                $scope.emailSearchText = null;
                $scope.callers = res.data;

            }else{
                console.log('error');
            }
        });

    };
    
    /* Autocomplete */
    ApiService.get('clients', function(res){
        $scope.waitServer = false;
        if(res.success === true){
            $scope.clientsList = res.data;
        }else{
            console.log('error');
        }
    });


    /* Client autocomplete */
    $scope.selectedItemChange = function (item) {
        selectedItem = item;
        $scope.caller = new $scope.defaultCaller();
        if(!selectedItem){
            $scope.callerSearchText = '';
            $scope.phoneSearchText = '';
            $scope.emailSearchText = '';
        }else{
            $scope.getCallers(item._id);
        }
    };
    $scope.foundItemsLength = -1;
    $scope.searchTextChange = function (text) {
        $scope.foundItemsLength = $filter('filter')($scope.clientsList, {name: text}).length;
        if(text === ''){
            $scope.foundItemsLength = -1;
        }
    };

    /* Caller autocomplete */
    $scope.foundCallersLength = -1;
    $scope.searchCallerTextChange = function (text) {
        $scope.foundCallersLength = $filter('filter')($scope.callers, {name: text}).length;
        if(text === ''){
            $scope.foundCallersLength = -1;
        }
    };
    $scope.selectedCallerChange = function (item) {
        if(!item){
            $scope.caller = new $scope.defaultCaller();
        }else{
            $scope.caller = item;
            $scope.newIssue.caller.name = item.name;
            $scope.newIssue.caller._id = item._id;
        }
        $scope.phoneSearchText = '';
        $scope.emailSearchText = '';
    };


    /* Caller phone autocomplete */
    $scope.foundPhonesLength = -1;
    $scope.searchCallerPhoneChange = function (text) {
        $scope.foundPhonesLength = $filter('filter')($scope.caller.phone, text).length;
        if(text === ''){
            $scope.foundPhonesLength = -1;
        }
    };
    $scope.selectedPhoneChange = function (item) {
        if(!item){
            $scope.newIssue.caller.phone = '';
        }else{
            $scope.newIssue.caller.phone = item;
        }
    };

    /* Caller phone autocomplete */
    $scope.foundEmailsLength = -1;
    $scope.searchCallerEmailChange = function (text) {
        $scope.foundEmailsLength = $filter('filter')($scope.caller.email, text).length;
        if(text === ''){
            $scope.foundEmailsLength = -1;
        }
    };
    $scope.selectedEmailChange = function (item) {
        if(!item){
            $scope.newIssue.caller.email = '';
        }else{
            $scope.newIssue.caller.email = item;
        }
    };
});