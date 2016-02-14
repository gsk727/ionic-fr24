// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCookies"])

.run(function($ionicPlatform, $http, $cookies, FR24, $rootScope, $ionicLoading) {
  $rootScope.showLoading = function(text) {
    
    $ionicLoading.show({
      template: text||'加载数据中...'
    });
  };
  $rootScope.hideLoading = function(){
    $ionicLoading.hide();
  };
  console.info("run:"+ $cookies.csrftoken);
  /*
  $http.get("https://mydjango-xilehang.rhcloud.com/api/csrf", {}).success(function() {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.get("csrftoken");
    console.info("get csrf:"+$cookies.get("csrftoken"));
    FR24.bcsrf = true;
  });
  */
   
    /*  Open a websocket to the host.  */
    

  
  
  $ionicPlatform.ready(function() {
  
  
    var onReceiveMessage = function(event){
      try{
      
        var message
        if(device.platform == "Android"){
           message = window.plugins.jPushPlugin.receiveMessage.message;
        }else{
             message   = event.content;
        }
         //var extras = window.plugins.jPushPlugin.extras
        alert(message);
      } catch(exception){
          console.log("JPushPlugin:onReceiveMessage-->"+exception);
      }
    }
            
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if(window.plugins && window.plugins.jPushPlugin) {
      window.plugins.jPushPlugin.init();
      window.plugins.jPushPlugin.setDebugMode(true);
      //document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
      //document.addEventListener("deviceready", onDeviceReady, false); 
      //document.addEventListener("jpush.openNotification", onOpenNotification, false);
      //document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
      document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);

    }
  });
})
.filter('iata_cnname',function(){
    return function(iata){
        var _iata = iata.replace("XIY", "SIY")
        if(g_iata[_iata])
            return g_iata[_iata]["name"];
        else
            return iata;
    }   
}).filter("iata_href", function() {
    return function(iata){
        var _iata = iata.replace("XIY", "SIY")
        if(g_iata[_iata])
            return g_iata[_iata]["href"];
        else
            return "";
    }   
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state("tab.detail", {
    url: '/detail/:pos',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-pos.html',
        controller: 'PosDetailCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });
  

  
  $stateProvider
  .state("user", {
    abstract: true,
    url: '/user',
    templateUrl: 'templates/user/user.html'
  })
  .state('user.register', {
    url: '/register',
    views:{
    'user-view': {
      templateUrl: 'templates/user/register.html',
      controller: 'UserRegisterCtrl'
    }}
  })
  .state('user.login', {
    url: '/login',
    views:{
    'user-view': {
      templateUrl: 'templates/user/login.html',
      controller: 'UserCtrl'
    }}
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/login');

});
