
angular.module('starter.controllers', ["ngCookies"])

.controller('DashCtrl', function($scope, FR24, $cookies,$rootScope, $timeout) {
  
  //$scope.flights = [];
  console.info($cookies.getAll());
  $timeout(function() {
      if(FR24.bcsrf) {
          FR24.data(function(data) {
            console.info(data);
            if(data instanceof Array) {
                //$rootScope.flights = data.splice(0, 100);
                $rootScope.flights = data;

            }
          });
      }
  }, 1000);
  
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
  map.enableScrollWheelZoom(true);
  var point = new $window.BMap.Point(116.404, 39.915);  // 创建点坐标  
  map.centerAndZoom(point, 15);                // 初始化地图，设置中心点坐标和地图级别  
  
  var myGeo = new BMap.Geocoder(); 
  for (var index in $rootScope.flights) {
    var f = $rootScope.flights[index];
    
    var result = FR24.GCJTobaidu(f.lat, f.lng);
    if(index<10) {
      console.info(f);
      console.info(result);
      }
      
    myGeo.getLocation(new BMap.Point(result.lng,result.lat), function(result, _f){
        var _f = _f;
        var result = result;
        return function(_result) { 
            if (_result){
                console.info(_result.address);
                if(_result.address.length==0)
                    return;
                var point = new BMap.Point(result.lng,result.lat);
                //map.centerAndZoom(point, 12);
                console.info(_result);
                console.info(_f);
                var marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                
                var label = new BMap.Label(_f.fltno,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label)
            }
        }
    }(result, f));
    
    
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
