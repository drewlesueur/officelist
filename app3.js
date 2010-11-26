(function() {
  var App, GoogleMap, Listing, Login, arr, map, obj, render, start;
  obj = NeckBrace.obj;
  arr = NeckBrace.arr;
  map = "";
  GoogleMap = NeckBrace.Type.copy({
    name: "Google Map",
    element: "div",
    append: function(o) {
      var latlng, myOptions;
      this["super"].append(o);
      $(o.__el).addClass("groogle-map");
      $(o.__el).css({
        height: screen.availHeight,
        width: screen.availWidth - 300,
        left: "300px",
        top: 0,
        position: "absolute"
      });
      latlng = new google.maps.LatLng(33.4222685, -111.8226402);
      myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      return (map = new google.maps.Map(o.__el, myOptions));
    }
  });
  Listing = NeckBrace.Type.copy({
    name: "listing",
    element: "n/a",
    append: function(o) {
      return console.log("just add to google map");
    },
    render: function(o) {}
  });
  Login = NeckBrace.Type.copy({
    name: "login",
    element: "div",
    append: function(o) {
      this["super"].append(o);
      return $(o.__el).append("<a href=\"javascript:Severus.login()\">Login with facebook</a><br>\n  <form id=\"login-form\">\n    What is your email address? <br>\n    <input type=\"text\" id=\"username\"><br>\n    <select id=\"question\">\n      <option value=\"mom-maiden-name\">What is your mom's Maiden Name?</option>\n      <option value=\"pets-name\">What is your pet's maiden Name?</option>\n      <option value=\"dream-car\">What is the maiden name of your dream car?</option>\n    </select><br>\n    <input type=\"text\" id=\"password\"><br>\n    <input type=\"submit\" value=\"Login/Create Account\">\n  </form>");
    }
  });
  App = NeckBrace.Type.copy({
    name: "app",
    element: "div",
    append: function(o) {
      this["super"].append(o);
      $(document.body).css({
        overflow: "hidden",
        margin: 0,
        padding: 0
      });
      $(o.__el).css({
        overflow: "hidden"
      });
      return $(o.__el).attr("id", "officelist-app").append("");
    }
  });
  render = function(o) {
    return this.render_login(o);
  };
  start = function() {
    var app;
    console.log("started");
    return (app = obj({
      username: "",
      login: obj({
        __type: Login
      }),
      map: obj({
        value: "",
        __type: GoogleMap
      }),
      __type: App
    }));
  };
  $(document).ready(function() {
    return Severus.initialize("http://severus.the.tl/severus.html", start);
  });
}).call(this);
