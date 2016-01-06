angular.module('starter.services', ['ngResource', "ngCookies"])
.factory("FR24", function($resource, $http, $cookies) {
  var bounds_up = "55.229023057406344,33.00228416652958,73.13484375000098,136.7578125";
  var bounds_down = "35.56798045801209,19.660503625269282,86.74277343749918,123.7939453125";
  var fr24_url = "http://bma.data.fr24.com/zones/fcgi/feed.js?bounds={bound}&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=900&gliders=1&stats=1&";
  
  return {
    GCJTobaidu: function(lat, lng){  
      var v = Math.PI * 3000.0 / 180.0;  
      var x = lng;  
      var y = lat;  
         
      z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * v);    
      t = Math.atan2(y, x) + 0.000003 * Math.cos(x * v);  
         
      return {  
      'lat': z * Math.sin(t) + 0.006,
      'lng': z * Math.cos(t) + 0.0065
      }
    },
    bcrsf:false,
    data:function(callback) {
      console.info(this.bcrsf+"lllll");
      if(!this.bcrsf) {
        callback();
      }
      var flights = {};
      function _callback1(data) {
        for (var k in data) {
          if (data[k]  instanceof Array) {
            flights[data[k][13]] = data[k];
          }
        }
      };
      
      function _callback2(data) {
        for (var k in data) {
          if (data[k]  instanceof Array) {
            flights[data[k][13]] = data[k];
          }
        }
        console.info(flights);
        callback(flights);
      };
      
      var data = {};
      
      // $resource(fr24_url.replace("{bound}",bounds_up),
        // {},
        // {
          // "data":{
            // method:"GET",
            // headers: {Referer:"http://bma.data.fr24.com" }
          // }
        // }
      // )
      // .data(_callback1);
      //$resource(fr24_url.replace("{bound}",bounds_down), {}).get(_callback2);
      //$http.defaults.headers.post['X-CSRFToken'] = $cookies.get("csrftoken");
      console.info($cookies.get("csrftoken")+"555555555555");
      console.info("asdsadasD");
      $resource("http://localhost:8000/api/data", {}, {"data":{method:"POST", isArray:true}}).data(callback);
    }
    
  }
  
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
