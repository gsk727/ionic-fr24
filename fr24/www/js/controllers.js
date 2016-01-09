
angular.module('starter.controllers', ["ngCookies"])

.controller('DashCtrl', function($scope, FR24, $cookies,$rootScope, $timeout) {
  
  //$scope.flights = [];
  console.info($cookies.getAll());
  /*
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
  */
  
})

.controller("PosDetailCtrl", function($scope, Chats, $window, $stateParams) {
  console.info("posdetail");
  var point_slug  = $stateParams.pos.split("_");
  console.info(point_slug);
  var point =new BMap.Point(parseFloat(point_slug[0]), parseFloat(point_slug[1]));    
  //map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);      
  // 创建地理编码实例      
  var myGeo = new BMap.Geocoder();      
  // 根据坐标得到地址描述 
  myGeo.getLocation(point, function(result){   
    console.info(result);
    if (result) {
      
      
      $scope.$apply(function() {$scope.location_info =result;$scope.pos_address = result.address});  
    }
  });
  
  
})
.controller('ChatsCtrl', function($scope, Chats, $window, FR24, $rootScope, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  /*
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
    }, function(err) {
      // error
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  $scope.count = 1;
  $scope.boundCallback=function(result) {
    console.info(result);
    var marker = new BMap.Marker(result);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    
    var label = new BMap.Label($scope.count, {offset:new BMap.Size(20,-10)});
    marker.setLabel(label);
    $scope.count += 1;
  };
  
  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude;
      var _long = position.coords.longitude;
      var gpsPoint = BMap.Point(lat, _long); 
      BMap.Convertor.translate(gpsPoint,0,$scope.boundCallback);
  });


  //watch.clearWatch();
  // OR
  /*
  $cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
      // success
      }, function (error) {
      // error
    });
  */
  window.baiduLocation &&
  window.baiduLocation.getCurrentPosition(function(result){
    console.info("sucess"+result.coords.latitude);
    var point = new BMap.Point(result.coords.longitude,result.coords.latitude);
    $scope.map.centerAndZoom(point, 12);
    //console.info(_result);
    //console.info(_f);
    var marker = new BMap.Marker(point);  // 创建标注
    $scope.map.addOverlay(marker);              // 将标注添加到地图中
    
    var label = new BMap.Label("当前位置",{offset:new BMap.Size(20,-10)});
    marker.setLabel(label);
    
    alert(result+"success");
  }, function(error){
    console.info("error"+error);
    alert("error"+error);
  } );
  
  $scope.map = new $window.BMap.Map("container", {"enableMapClick":true});          // 创建地图实例  
  $scope.map.enableScrollWheelZoom(true);
  var point = new $window.BMap.Point(116.404, 39.915);  // 创建点坐标  
  $scope.map.centerAndZoom(point, 15);                // 初始化地图，设置中心点坐标和地图级别  
  $scope.map.addEventListener("zoomend", function() {
    console.info($scope.map.getBounds());
    var _b = $scope.map.getBounds();
    FR24.data(function(data) {
      console.info(data);
      if(data instanceof Array) {
        //$rootScope.flights = data.splice(0, 100);
        $rootScope.flights = data;
      }
    }, {"bounds":_b.ul.lat+","+_b.Ll.lat+","+_b.ul.lng+","+_b.ul.lng});
  });
  
  $scope.map.addEventListener("click", function(e) {
    console.info(e);
    console.info(e.overlay);
    if(e.overlay) {
      $state.go("tab.detail", {"pos":e.point.lng+"_"+e.point.lat});
    }
    
    
    
    return;
    //e.overlay.remove();
    var marker = new BMap.Marker(e.point);
    
    //$scope.map.addOverlay(marker);              // 将标注添加到地图中
                      
    //var label = new BMap.Label("123",{offset:new BMap.Size(20,-10)});
    //marker.setLabel(label)
    e.overlay.remove();
    $state.go("tab.account");
    
    
    
    $scope.map.addOverlay(marker);              // 将标注添加到地图中
    var html = ["<div class='infoBoxContent'><div class='title'><strong>中海雅园</strong><span class='price'>均价43000</span></div>",
      "<div class='list'><ul><li><div class='left'><img src='house3.jpg'/></div><div class='left'><a target='_blank' href='http://map.baidu.com'>中海雅园南北通透四居室</a><p>4室2厅，205.00平米，3层</p></div><div class='rmb'>760万</div></li>"
      ,"<li><div class='left'><img src='house1.jpg'/></div><div class='left'><a target='_blank' href='http://map.baidu.com'>中海雅园四居室还带保姆间</a><p>2室1厅，112.00平米，16层</p></div><div class='rmb'>300万</div></li>"
      ,"<li><div class='left'><img src='house2.jpg'/></div><div class='left'><a target='_blank' href='http://map.baidu.com'>《有钥匙 随时看》花园水系</a><p>3室2厅，241.00平米，16层</p></div><div class='rmb'>400万</div></li>"
      ,"<li><div class='left'><img src='house3.jpg'/></div><div class='left'><a target='_blank' href='http://map.baidu.com'>富力城D区正规楼王大三居</a><p>3室3厅，241.00平米，17层</p></div><div class='rmb'>600万</div></li>"
      ,"<li class='last'><div class='left'><img src='house1.jpg'/></div><div class='left'><a target='_blank' href='http://map.baidu.com'>富力城豪，身份人士的象征</a><p>4室2厅，213.90平米，25层</p></div><div class='rmb'>700万</div></li>"
      ,"</ul></div>"
      ,"</div>"];
      
  


    var infoBox = new BMapLib.InfoBox($scope.map, html.join(""),{
    boxStyle:{
      background:"url('tipbox.gif') no-repeat center top"
      ,width: "270px"
      ,height: "300px"
    }
    ,closeIconMargin: "1px 1px 0 0"
    ,enableAutoPan: true
    ,align: INFOBOX_AT_TOP
    });

    var marker = new BMap.Marker(e.point);
    $scope.map.addOverlay(marker);
    infoBox.open(marker);
  });
  
  console.info($scope.map.getBounds());
  var bounds = $scope.map.getBounds();
  
  
  
  
  $scope.boundCallback=function(result) {
    console.info(result)
  }
  
  //var gpsPoint = bounds.Ll;
  //BMap.Convertor.translate(gpsPoint,0,boundCallback);
  
  //bounds.
  
  var myGeo = new BMap.Geocoder();
  
  $scope.translateCallback = function(_f) {
      var _f = _f;
      return function(result) {
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
                      //console.info(_result);
                      //console.info(_f);
                      var marker = new BMap.Marker(point);  // 创建标注
                      $scope.map.addOverlay(marker);              // 将标注添加到地图中
                      
                      var label = new BMap.Label(_f.fltno,{offset:new BMap.Size(20,-10)});
                      marker.setLabel(label)
                  }
              }
          }(result, f));
      }
  };
  
  $rootScope.$watch("flights", function () {
    for (var index in $rootScope.flights) {
      var f = $rootScope.flights[index];
      //BMap.Convertor.translate(point,2,translateCallback(f));
      var result = FR24.GCJTobaidu(f.lat, f.lng);
      if(index<10) {
        console.info(f);
        console.info(result);
      }
      $scope.map.clearOverlays()
      myGeo.getLocation(new BMap.Point(result.lng,result.lat), function(result, _f){
          var _f = _f;
          var result = result;
          return function(_result) { 
              if (_result){
                  //console.info(_result.address);
                  if(_result.address.length==0)
                      return;
                  var point = new BMap.Point(result.lng,result.lat);
                  //map.centerAndZoom(point, 12);
                  //console.info(_result);
                  //console.info(_f);
                  var marker = new BMap.Marker(point);  // 创建标注
                  $scope.map.addOverlay(marker);              // 将标注添加到地图中
                  
                  var label = new BMap.Label(_f.fltno,{offset:new BMap.Size(20,-10)});
                  marker.setLabel(label)
              }
          }
      }(result, f));
    }
  });
  
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
