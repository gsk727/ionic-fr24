
angular.module('starter.controllers', ["ngCookies"])

.controller('DashCtrl', function($scope, FR24, $cookies,$rootScope) {
  
  //$scope.flights = [];
  console.info($cookies.getAll());
  
  
  FR24.data(function(data) {
    console.info(data);
    $rootScope.flights = data;
  });
  
})

.controller('ChatsCtrl', function($scope, Chats, $window, FR24, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  var map = new $window.BMap.Map("container");          // 创建地图实例  
  var point = new $window.BMap.Point(116.404, 39.915);  // 创建点坐标  
 // map.centerAndZoom(point, 15);                // 初始化地图，设置中心点坐标和地图级别  
    
    
  for (var index in $rootScope.flights) {
    var f = $rootScope.flights[index];
    
    var result = FR24.GCJTobaidu(f.lat, f.lng);
    if(index<10) {
      console.info(f);
      console.info(result);
      }
    var point = new BMap.Point(result.lng,result.lat);
    //map.centerAndZoom(point, 12);
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    
    var label = new BMap.Label(f.fltno,{offset:new BMap.Size(20,-10)});
    marker.setLabel(label)
  }
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
