// ng
var codeIndexApp = angular.module('codeIndexApp', []);

codeIndexApp.controller('CodeIndexCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.fetch = function() {
        $http.get('/query/' + encodeURIComponent($scope.text))
        .success(function(data) {
            $scope.docs = (postProcess(data)).response.docs;
        });
    }

    $scope.doindex = function() {
        $http.post('/doindex', { path: $scope.path })
        .success(function(msg, status) {
            $scope.message = msg;
            $scope.path = '';
        })
        .error(function(msg, status) {
            $scope.message = msg;
            $scope.path = '';
        });
    }
}]);

codeIndexApp.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

// custom
function postProcess(data) {
    var key;
    if (data.response && data.response.docs) {
        for(var i = 0; i < data.response.docs.length; i++) {
            key = data.response.docs[i].id;
            if (typeof data.highlighting[key] !== 'undefined') {
                // data.highlighting[key].path_t = data.response.docs[i].path_t;
                data.response.docs[i].highlighting = data.highlighting[key];
            }
        }
    }
    return data;
}
