var apiRoutes = require('../server/API/routes');
var apiResolve = require('../server/API/api_services');

module.exports = {
  drawRoutes: function(app){
      var setRoute = function(route){
          switch(route.method){
              case 'GET':
                  app.get(route.path, function(req, res){
                      apiResolve[route.query].GET(req, res);
                  });
                  break;
              case 'POST':
                  app.post(route.path, function(req, res){
                      apiResolve[route.query].POST(req, res);
                  });
                  break;
              case 'DELETE':
                  app.delete(route.path, function(req, res){
                      apiResolve[route.query].DELETE(req, res);
                  });
                  break;
              case 'PUT':
                  app.put(route.path, function(req, res){
                      apiResolve[route.query].PUT(req, res);
                  });
                  break;
          }
      };
      for(var i=0;i<apiRoutes.length;i++){
          setRoute(apiRoutes[i]);
      }
  }
};