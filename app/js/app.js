angular.module("app", ["ngResource", "ui.router","ngMaterial"]).run(function($rootScope, $state) {


    $rootScope.setActiveUser = function(user){
        $rootScope.activeUser = user;
        $state.go('issuesList');
    };

}).config(function($mdThemingProvider,$mdDateLocaleProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette('amber',{
            'default': '900'
        })
        .warnPalette('deep-orange',{
            'default': '800'
        })
        .accentPalette('grey',{
            'default': '700'
        });

    $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD-MM-YYYY') : '';
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD-MM-YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };


    /*$mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');
    };*/

});
