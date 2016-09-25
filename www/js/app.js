(function(){  
  var app = angular.module('starter', ['ionic','angularMoment'])

  // app.controller("RedditCtrl",function($scope){
  //   $scope.posts = [
  //     {title:"Primer post"},
  //     {title:"Segundo post"}
  //   ]
  // });

  // app.controller("RedditCtrl",function($scope,$http){
  //   $scope.posts = [];
  //   $http.get("https://www.reddit.com/.json").success(function(posts){
  //     console.log(data.data.children);
  //     $scope.posts=data.data.children;
  //   });
  // });

  app.controller("RedditCtrl",function($scope,$http){
    $scope.posts = [];
    $http.get("https://www.reddit.com/.json").success(function(posts){
      angular.forEach(posts.data.children,function(post){
        $scope.posts.push(post.data);
      });
    });

    $scope.cargarInfinito = function(){
      var params = [];
      if($scope.posts.length > 0){
        params["after"] = $scope.posts[$scope.posts.length - 1].name;
      }
      $http.get("https://www.reddit.com/.json",{params:params}).success(function(posts){
        angular.forEach(posts.data.children,function(post){
          $scope.posts.push(post.data);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.cargarNuevosPosts = function(){
      if($scope.posts.length > 0){
        var params2 = {"before":$scope.posts[0].name};        
      }else{
        return;
      }
      $http.get("https://www.reddit.com/.json",{params:params2})
        .success(function(posts){
          var newPosts = [];
          angular.forEach(posts.data.children,function(post){
            newPosts.push(post.data);
          });
        $scope.posts = newPosts.concat($scope.posts);
      });
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.openLink = function(url){
      window.open(url,'_blank');
    }


  });
  
  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //cordova.plugins.Keyboard.disableScroll(true);
      }
        //asi la app abre los links en la app si es app y sino en el browser
      if(window.cordova && window.cordova.InAppBrowser){
          window.open = window.cordova.InAppBrowser.open;
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })  
}())