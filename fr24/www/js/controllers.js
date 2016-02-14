angular.module('starter.controllers', ["ngCookies"])
.controller('UserCtrl', function($scope, $ionicLoading, $http, FR24, $state, $cookies,$rootScope, $timeout, UserService) {
  
   $scope.initWebSocket  = function (token) {
    var host = window.document.location.host;
    var port = window.document.location.port;
    var wsproto = "ws";
    (port == 8443)  &&  (wsproto = "wss");
    //$rootScope.ws = new WebSocket("wss://ws-xilehang.rhcloud.com:8443/ws-echo");
    //$rootScope.ws = new WebSocket("ws://192.168.253.1:8080/ws-echo");
    $rootScope.ws = new WebSocket("ws://127.0.0.1:8080/ws-echo");
    /*  Handle open, message and close events.  */
    $rootScope.ws.onopen = function() {
      var at =  Date(Date.now() );
      ws.send(JSON.stringify({"cmd":"login", "kwargs":{"token":token}}));
      this.send("asdsad");
    };
    
     $rootScope.ws.onmessage = function(msg) {
      alert(msg.data);
    };
    $rootScope.ws.onclose = function() {
      var at =  Date(Date.now() );
      alert("ws closed");
    };
    $rootScope.ws.onerror = function() { alert("ws error")};
     
     
   }
  console.info("Asdasda");
  $scope.userInfo = {};
  $scope.userInfo.username = "testa";
  $scope.userInfo.password = "123456";
  
  $scope.submitUserLoginForm =function(valid) {
    $rootScope.showLoading("登录中");
    console.info($scope.userInfo);
    UserService.login.save($scope.userInfo, function(ret){
      $rootScope.hideLoading();
      if(!ret.success) {
        alert("登录失败");
        return;
      }
      $http.defaults.headers.post['AUTHTOKEN'] = ret.token;
      console.info(ret.token);
      $scope.initWebSocket(ret.token);
      FR24.bcsrf = true;
      $state.go("tab.dash");
    });
  }
})
.controller("UserRegisterCtrl", function($scope, UserService, $state, $timeout, $rootScope, FRResource){
  $scope.userInfo = {};
  $scope.submitUserRegisterForm =function(valid) {
    UserService.register.save($scope.userInfo, function(ret) {
      console.info(ret);
      if(ret.success){
        alert("注册成功");
        return;
      }
      
    });
  }
  
})
.controller('DashCtrl', function($scope, FR24, $cookies,$rootScope, $timeout) {

})

.controller("PosDetailCtrl", function($scope, $window, $stateParams, $window, $ionicLoading) {
  $scope.show = function() {
    $ionicLoading.show({
      template: '加载数据中...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
  
  var point_slug  = $stateParams.pos.split(",");
  console.info(point_slug);
  var point =new AMap.LngLat(parseFloat(point_slug[0]), parseFloat(point_slug[1]));    
  
  console.info("posdetail");
  var marker = new AMap.Marker({
      map:$scope.map,
      bubble:true
  })
 
  console.info($window.myGeo);
  
  marker.setPosition(point);
  
  $scope.show();
  $window.myGeo && $window.myGeo.getAddress(point,function(status,result){
    if(status=='complete'){
      console.info(result);
      $scope.$apply(function() {
        $scope.pos_address  = result.regeocode.formattedAddress;
        $scope.location_info = result.regeocode.addressComponent;
      });
    }else{
       //message.innerHTML = '无法获取地址'
    }
    $scope.hide();
  });
})
.controller('ChatsCtrl', function($scope, $interval,$timeout, UserService, $ionicActionSheet, $window, FR24, $rootScope, $state) {
  
  $scope.caiZuJi = function() {
    if (!UserService.userCurrentPos || !UserService.clickPos) {
      alert("无法获取的你的位置");
      return;
    } else if (UserService.userCurrentPos.distance(UserService.clickPos) > 1000) {
      alert("太远了了，你踩不到啊");
      return;
    } else {
      alert("踩到了啊"); 
    }
  };
  
  $rootScope.flights = [];
  function addMarker() {
    $scope.map.clearMap();
    var marker = new AMap.Marker({
        map: $scope.map,
        position: [116.481181, 39.989792]
    });
    //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(marker, 'click', function() {
        infoWindow.open($scope.map, marker.getPosition());
    });
  }
    
   //实例化信息窗体
  $scope.map = new $window.AMap.Map("container");          // 创建地图实例
  var point = new $window.AMap.LngLat(116.404, 39.915);  // 创建点坐标  
  $scope.map.setZoom(10);                // 初始化地图，设置中心点坐标和地图级别  
  $scope.map.setCenter(point);
  //addMarker();

    
    
  var title = '方恒假日酒店<span style="font-size:11px;color:#F00;">价格:318</span>',
      content = [];
  content.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
  content.push("电话：010-64733333");
  content.push("<a href='http://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
  var infoWindow = new AMap.InfoWindow({
    isCustom: true,  //使用自定义窗体
    content: createInfoWindow(title, content.join("<br/>")),
    offset: new AMap.Pixel(16, -45)
  });

    //构建自定义信息窗体
  function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "http://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "http://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
  }

  //关闭信息窗体
  function closeInfoWindow() {
    $scope.map.clearInfoWindow();
  }
  
  var lineArr = [
    [116.368904, 39.913423],
    [116.382122, 39.901176],
    [116.387271, 39.912501],
    [116.398258, 39.904600]
  ];
  
  var  polyline =  new AMap.Polyline({
    path:lineArr,
    strokeColor: "#3366FF", //线颜色
    strokeOpacity: 1,       //线透明度
    strokeWeight: 5,        //线宽
    strokeStyle: "solid",   //线样式
    strokeDasharray: [10, 5] //补充线样式
  });
  //polyline.setMap($scope.map);
  //infoWindow.open($scope.map, [116.481181, 39.989792]);
  $scope.points = $scope.points || [];
  console.info(window.amapLocation);
  
  $scope.getCurrentPositionCallbackSuccess = function(result) {
    console.info("sucess");
    for(var k in result){
      console.info(k+result[k]);
    }
    
    var point = new AMap.LngLat(result.longitude,result.latitude);
    UserService.userCurrentPos = point;
    
    $scope.points.push(point);
    $scope.map.setCenter(point);
    if(!$scope.marker) {
      $scope.marker = new AMap.Marker({
        map:$scope.map,
        bubble:true
      });
    } else {
      $scope.marker.setPosition(point);
    }
    if(!$scope.polyline) {
      $scope.polyline = new AMap.Polyline({
        path:$scope.points,
        strokeColor: "#3366FF", //线颜色
          strokeOpacity: 1,       //线透明度
          strokeWeight: 5,        //线宽
          strokeStyle: "solid",   //线样式
          strokeDasharray: [10, 5] //补
      });
      
      $scope.polyline.setMap($scope.map);
    } else {
      console.info($scope.points.length);
      $scope.polyline.setPath($scope.points);
    }
   
    //$scope.circle && $scope.circle.setMap(null);
    if(!$scope.circle) {
      $scope.circle = new AMap.Circle({
          center: [result.longitude,result.latitude],
          radius: 100,
          fillOpacity:0.2,
          strokeWeight:1,
          map: $scope.map
      });
    } else {
      $scope.circle.setCenter(point);
    }

    UserService.pos.save(result, function(posResult) {
      console.info(posResult);
    });
    
    //alert(result+"success");
  };

  $scope.getCurrentPositionCallbackError = function(error){
    console.info("error"+error);
    alert("error"+error);
  };

  window.amapLocation &&
  window.amapLocation.getCurrentPosition([false, 1], 
    $scope.getCurrentPositionCallbackSuccess, 
    $scope.getCurrentPositionCallbackError
  );

  $interval(function() {
    var sw = $scope.bounds.getSouthWest( );
    var ne = $scope.bounds.getNorthEast( );
    FR24.data(function(data) {
      if(data instanceof Array) {
        //$rootScope.flights = data.splice(0, 100);
        $rootScope.flights = data;
      }
    }, {"bounds":ne.lat+","+sw.lat+","+sw.lng+","+ne.lng})
  }, 30000);
  
  $scope.map.on('complete', function() {
    $scope.bounds = $scope.map.getBounds();
    var sw = $scope.bounds.getSouthWest( );
    var ne = $scope.bounds.getNorthEast( );
    FR24.data(function(data) {
      if(data instanceof Array) {
        //$rootScope.flights = data.splice(0, 100);
        $rootScope.flights = data;
      }
    }, {"bounds":ne.lat+","+sw.lat+","+sw.lng+","+ne.lng});
  })
  
  AMap.event.addListener($scope.map, "moveend"), function() {
    $scope.bounds = $scope.map.getBounds();
  }
  AMap.event.addListener($scope.map, "zoomend", function() {
    console.info($scope.map.getBounds());
    $scope.bounds = $scope.map.getBounds();
  });
  
  $scope.regeocode_show =false;
  AMap.event.addListener($scope.map, "click", function(e) {    
    $window.myGeo && $window.myGeo.getAddress(e.lnglat,function(status,result){
      if(status=='complete'){
        $scope.$apply(function() {
          $scope.regeocode = result.regeocode;
          $scope.regeocode_show = true;
          UserService.clickPos = e.lnglat;
          $scope.pos_address  = result.regeocode.formattedAddress;
          $scope.location_info = result.regeocode.addressComponent;
        });
      }else{
         //message.innerHTML = '无法获取地址'
      }
      //$scope.hide();
    });
  });
    
  
  AMap.service('AMap.Geocoder',function(){//回调函数
    //实例化Geocoder
    $window.myGeo = myGeo  = new AMap.Geocoder({
    //city: "010"//城市，默认：“全国”
    });
    //TODO: 使用geocoder 对象完成相关功能
  })

  
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
                      var marker = new BMap.Marker(point);  // 创建标注
                      $scope.map.addOverlay(marker);              // 将标注添加到地图中
                      
                      var label = new BMap.Label(_f.fltno,{offset:new BMap.Size(20,-10)});
                      marker.setLabel(label)
                  }
              }
          }(result, f));
      }
  };

  $scope.flightsMarker = {};
  $rootScope.$watch("flights", function () {
    var markerUpdateTime = new Date().getTime();
    for (var index in $rootScope.flights) {
      var f = $rootScope.flights[index];
      if(!f.lng)
        continue;
      var lnglat = new AMap.LngLat(f.lng, f.lat);
      
      if(index<10) {
        console.info(f);
        //console.info(result);
      }
      var origin = f.origin+180;
      if (origin>=360) {
        origin = f.origin+180-360;
      }
      var left_offset  = (Math.ceil(origin/15)-1)*48*(-1);
      var marker = null;
      var content =  '<div style="width:35px; height:40px; background-image: url(/img/yellow_normal.png);'+
          'background-repeat: no-repeat;background-position: left ' +left_offset+ 'px top -40px;">'+
          '</div>';
        
      console.info(content);
      
      if(!$scope.flightsMarker[f.fltno]) {
        marker = new AMap.Marker({map:$scope.map, content:content});  // 创建标注
        $scope.flightsMarker[f.fltno] = marker;
        marker.on("mouseover", function() {
          var fltno = f.fltno;
          return function(e) {
            this.setLabel({"content": fltno, "offset":0});
          }
          
        }()
        );
        marker.on("mouseout", function(e) {
          this.setLabel(null);
        });
        
      } else {
        marker = $scope.flightsMarker[f.fltno];
      }
      marker.updateTime = markerUpdateTime;

      marker.setPosition(lnglat);
    }
    for (var k in $scope.flightsMarker) {
      var m = $scope.flightsMarker[k];
      if($scope.map.getBounds().contains(m.getPosition())) {
        if(m.updateTime < markerUpdateTime) {
          m.setMap(null);
          delete $scope.flightsMarker[k];
        }
      }
    }
   
  });
  
 
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
