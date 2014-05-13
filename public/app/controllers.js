'use strict';

/* Controllers */

angular.module('blog.controllers', [])
  .controller('PostCtrl', ['$scope', function($scope) {
    $scope.posts = [];        
        var socket = io.connect('http://localhost:3000');
        socket.on('post', function (data) {            
            $scope.$apply(function() {
              $scope.chatMessages.push(data);  
            });
        });

        $scope.sendMessage = function (event) {                        
            console.log(event);
            if (event.keyCode && 
                event.keyCode === 13 && 
                event.currentTarget.value) {
                socket.emit('post', { message: event.currentTarget.value });
                $scope.chatMessages.push(event.currentTarget.value);
                event.currentTarget.value = '';
            }
                
        };
  }]);
