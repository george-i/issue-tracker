angular.module('app').factory('ApiRoutesServices', function($http){
    var endpoint = 'http://localhost:3000';
    var API = function(apicall, data, callback){
        var request;
        switch(apicall.method){
            case 'get':
                request = {
                    method: 'GET',
                    url: apicall.path
                };
                if(data){
                    request.data = data;
                }
                $http(request).
                    success(function(data, status, headers, config) {
                        callback(data);

                        // this callback will be called asynchronously
                        // when the response is available
                    }).
                    error(function(data, status, headers, config) {
                        console.log(arguments);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                break;

            case 'post':
                request = {
                    method: 'POST',
                    url: apicall.path
                };
                if(data){
                    request.data = data;
                }
                $http(request).
                    success(function(data, status, headers, config) {
                        callback(data);

                        // this callback will be called asynchronously
                        // when the response is available
                    }).
                    error(function(data, status, headers, config) {
                        console.log(arguments);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                break;

            case 'delete':
                request = {
                    method: 'DELETE',
                    url: apicall.path
                };
                if(data){
                    request.data = data;
                }
                $http(request).
                    success(function(data, status, headers, config) {
                        callback(data);

                        // this callback will be called asynchronously
                        // when the response is available
                    }).
                    error(function(data, status, headers, config) {
                        console.log(arguments);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                break;

            case 'put':
                request = {
                    method: 'PUT',
                    url: apicall.path
                };
                if(data){
                    request.data = data;
                }
                $http(request).
                success(function(data, status, headers, config) {
                    callback(data);

                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    console.log(arguments);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                break;
        }
    };
    return {
        issue: {
            post: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issue/add',
                    method: 'post'
                };
                API(apicall, data, callback);
            },
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issue/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            },
            remove: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issue/clear/'+data._id,
                    method: 'delete'
                };
                API(apicall, data, callback);
            },
            put: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issue/put',
                    method: 'put'
                };
                API(apicall, data, callback);
            }
        },
        issues: {
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issues/get?'+data.params,
                    method: 'get'
                };
                API(apicall, data, callback);
            }
        },
        issuelog: {
            put: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/issuelog/put',
                    method: 'put'
                };
                API(apicall, data, callback);
            }
        },
        user: {
            post: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/user/add',
                    method: 'post'
                };
                API(apicall, data, callback);
            },
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/user/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            },
            remove: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/user/clear/'+data._id,
                    method: 'delete'
                };
                API(apicall, data, callback);
            },
            put: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/user/put',
                    method: 'put'
                };
                API(apicall, data, callback);
            }
        },
        users: {
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/users/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            }
        },
        client: {
            post: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/client/add',
                    method: 'post'
                };
                API(apicall, data, callback);
            },
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/client/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            },
            remove: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/client/clear/'+data._id,
                    method: 'delete'
                };
                API(apicall, data, callback);
            },
            put: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/client/put',
                    method: 'put'
                };
                API(apicall, data, callback);
            }
        },
        clients: {
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/clients/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            }
        },
        caller: {
            post: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/caller/add',
                    method: 'post'
                };
                API(apicall, data, callback);
            },
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/caller/get',
                    method: 'get'
                };
                API(apicall, data, callback);
            },
            remove: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/caller/clear/'+data._id,
                    method: 'delete'
                };
                API(apicall, data, callback);
            },
            put: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/caller/put',
                    method: 'put'
                };
                API(apicall, data, callback);
            }
        },
        callers: {
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/callers/get?'+data.params,
                    method: 'get'
                };
                API(apicall, data, callback);
            }
        },
        reports: {
            get: function(data, callback){
                var apicall = {
                    path: endpoint+'/api/reports/get?'+data.params,
                    method: 'get'
                };
                API(apicall, data, callback);
            }
        }
    };
});