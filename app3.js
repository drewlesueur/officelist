(function() {
  var App, GoogleMap, Listing, Login, app, arr, map, obj, render, start;
  obj = NeckBrace.obj;
  arr = NeckBrace.arr;
  map = "";
  app = "";
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
      $(o.__el).append("<div id=\"logged_in_block\" style=\"display:none;\">\n  Logged in as <div id=\"username_display\"></div>\n  <a href=\"#\" id=\"logout_link\">Logout</a>\n</div>\n<div id=\"not_logged_in_block\">\n  <a href=\"#\" id=\"login_link\">Log in</a> | <a href=\"#\" id=\"signup_link\">Sign up</a> | \n<!--<a href=\"javascript:Severus.login()\">Login with facebook</a><br>-->\n    <div id=\"login_signup\" style=\"display: none;\">\n      <form id=\"login-form\">\n        What is your email address? <br>\n        <input type=\"text\" id=\"username\"><br>\n        <select id=\"question\">\n          <option value=\"mom-maiden-name\">What is your mom's Maiden Name?</option>\n          <option value=\"pets-name\">What is your pet's maiden Name?</option>\n          <option value=\"dream-car\">What is the maiden name of your dream car?</option>\n        </select><br>\n        <input type=\"text\" id=\"password\"><br>\n        <input id=\"login_signup_button\" type=\"submit\" value=\"Login/Create Account\">\n      </form>\n    </div>\n</div>");
      $('#login_link').click(function(e) {
        e.preventDefault();
        $('#login_signup_button').val("Log in");
        return $('#login_signup').toggle();
      });
      $('#signup_link').click(function(e) {
        e.preventDefault();
        $('#login_signup_button').val("Sign up");
        return $('#login_signup').toggle();
      });
      $("#login-form").submit(function(e) {
        var creds;
        e.preventDefault();
        creds = {
          username: $("#username").val(),
          password: $("#question").val() + ":" + $("#password").val()
        };
        return Severus.login(creds, function(data) {
          if (data.result === true) {
            $('#not_logged_in_block').hide();
            $('#logged_in_block').show();
            $('#username_display').text(creds.username);
            return (app.username = creds.username);
          }
        });
      });
      return $('#logout_link').click(function() {
        return Severus.logout(function(data) {
          if (data.result === true) {
            $('#not_logged_in_block').show();
            $('#logged_in_block').hide();
            $('#username_display').text("");
            return (app.username = "");
          }
        });
      });
    }
  });
  App = NeckBrace.Type.copy({
    name: "app",
    element: "div",
    initialize: function(o) {
      var that;
      that = this;
      return Severus.ajax({
        url: "/me",
        success: function(data) {
          console.log(data);
          return that["super"].initialize(o);
        }
      });
    },
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
