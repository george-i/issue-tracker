angular.module("app").directive('contenteditable', function($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel){return;} // do nothing if no ng-model
            // Write data to the model
            var read = function() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if ( attrs.stripBr && html === '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            };
            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                //scope.$evalAsync(read);
                ngModel.$render();

            });
            read(); // initialize
        }
    };
});