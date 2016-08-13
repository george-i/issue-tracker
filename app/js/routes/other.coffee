angular.module('app').config ($stateProvider) ->
  $stateProvider.state 'home',
    url: '/'
    templateUrl: 'home.html'
    controller: 'HomeController'
    data: {
      pageTitle: 'Go Travel - emergency issues/login'
    }


  $stateProvider.state 'issuesList',
    url: '/issues-list'
    templateUrl: 'emergency.html'
    controller: 'EmergencyController'
    data: {
      pageTitle: 'Go Travel - emergency issues/list'
    }

  $stateProvider.state 'usersList',
    url: '/users-list'
    templateUrl: 'users.html'
    controller: 'UsersController'
    data: {
      pageTitle: 'Go Travel - users list'
    }

  $stateProvider.state 'clientsList',
    url: '/clients-list'
    templateUrl: 'clients.html'
    controller: 'ClientsController'
    data: {
      pageTitle: 'Go Travel - clients list'
    }

  $stateProvider.state 'callersList',
    url: '/callers-list'
    templateUrl: 'callers.html'
    controller: 'CallersController'
    data: {
      pageTitle: 'Go Travel - callers list'
    }

  $stateProvider.state 'reports',
    url: '/reports'
    templateUrl: 'reports.html'
    controller: 'ReportsController'
    data: {
      pageTitle: 'Go Travel - reports'
    }