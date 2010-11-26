(function() {
  var AddSpot, App, GoogleMap, Listing, Login, Marker, Search, app, arr, map, obj, render, start;
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
    },
    get_location: function(wherethe, callback) {
      var geocoder;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        address: wherethe
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          return callback(results[0].geometry.location);
        } else {
          console.log(status);
          console.log(results);
          return console.log("there was a problem looking up " + (wherethe));
        }
      });
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
      var that;
      this["super"].append(o);
      that = this;
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
            o.username = creds.username;
            return that.render(o);
          }
        });
      });
      return $('#logout_link').click(function() {
        return Severus.logout(function(data) {
          if (data.result === true) {
            o.username = "";
            return that.render(o);
          }
        });
      });
    },
    render: function(o) {
      if (o.username !== "") {
        $('#not_logged_in_block').hide();
        $('#logged_in_block').show();
        console.log("parent is", o.__parent);
        return $('#username_display').text(o.username);
      } else {
        $('#not_logged_in_block').show();
        $('#logged_in_block').hide();
        return $('#username_display').text("");
      }
    }
  });
  Search = NeckBrace.Type.copy({
    name: "Search",
    append: function(o) {
      this["super"].append(o);
      $(o.__el).append("<pre>\n<h1 id=\"search_heading\">Search</h1><form id=\"search_form\" class=\"main-input-toggle\">\n<select id=\"search_for_lease\">\n  <option>For Lease</option>\n  <option>For Sale</option>\n</select>\n<input type=\"checkbox\" name=\"built_out\" value=\"built_out\"/> built out\n<input type=\"checkbox\" name=\"built_out\" value=\"shell\"> shell\nCity or Zip\n<input type=\"text\" name=\"city\">\nSquare Feet\n<input type=\"text\" name=\"min\" size=\"4\" /><input type=\"text\" name=\"max\" size=\"4\" />\nPrice/Month\n<input type=\"text\" name=\"min\" size=\"4\" /><input type=\"text\" name=\"max\" size=\"4\"/>\nKeywords\n<input type=\"text\" name=\"keywords\">\n<input type=\"submit\" value=\"Search\">\n</form>\n</pre>");
      $('#search_heading').click(function(e) {
        return $('.main-input-toggle').toggle('slow');
      });
      return $('#search_form').submit(function(e) {
        e.preventDefault();
        return false;
      });
    }
  });
  Marker = NeckBrace.Type.copy({
    name: "Marker",
    element: "n/a",
    append: function(o) {
      var marker_options;
      marker_options = {
        position: o.listing.loc,
        map: map,
        title: "hello world",
        icon: "pin.png"
      };
      o._marker = new google.maps.Marker(marker_options);
      map.setCenter(o.listing.loc);
      return map.setZoom(15);
    },
    remove: function(o) {
      return (typeof o === "undefined" || o === null) ? undefined : o._marker == null ? undefined : o._marker.setMap(null);
    }
  });
  Listing = NeckBrace.Type.copy({
    name: "Listing",
    element: "n/a",
    initialize: function(o) {},
    append: function(o) {},
    render: function(o) {},
    render_position: function(o) {
      var bubble_open, handle_marker_click, loc, marker, marker_options;
      loc = new google.maps.LatLng(o.lat, o.lng);
      marker_options = {
        position: loc,
        map: map,
        title: "hello world",
        icon: "pin.png"
      };
      if (o._user === app.login.username) {
        marker_options.draggable = true;
        marker_options.icon = "apartment.png";
      }
      marker = new google.maps.Marker(marker_options);
      map.setZoom(15);
      if (o.is_new === true) {
        render.remove_adding_markers();
        adding_markers.push(marker);
      }
      bubble_open = function() {
        var _i, _len, _ref, blubbles, bubble, bubbly, info;
        info = ("<pre>\n<span class=\"bubble location\">" + (o.location) + "</span>\n<span class=\"bubble size\">" + (o.size) + "</span>\n<span class=\"bubble price\">" + (o.price) + "</span>\n<span class=\"bubble desc\">" + (o.desc) + "</span>\n</pre>");
        bubble = new google.maps.InfoWindow({
          content: info
        });
        _ref = bubbles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bubbly = _ref[_i];
          bubbly.close();
        }
        blubbles = [];
        bubbles.push(bubble);
        bubble.open(map, marker);
        return (o.bubble = bubble);
      };
      handle_marker_click = function() {
        bubble_open();
        return console.log(my_listing);
      };
      google.maps.event.addListener(marker, "click", handle_marker_click);
      return o.is_new === true ? bubble_open() : null;
    },
    change_address: function(address) {
      return GoogleMap.get_location(address, function(loc) {
        console.log("loc is", loc);
        app.listing.address = address;
        app.listing.loc = loc;
        app.listing.lat = loc.lat();
        app.listing.lng = loc.lng();
        Marker.remove(app.listing.marker);
        return (app.listing.marker = obj({
          __type: Marker,
          listing: app.listing
        }));
      });
    }
  });
  AddSpot = NeckBrace.Type.copy({
    name: "edit spot",
    element: "div",
    append: function(o) {
      this["super"].append(o);
      $(o.__el).append("<pre>\n<h1 id=\"add_heading\">Add</h1><form class=\"main-input-toggle\" style=\"display:none;\" id=\"add_form\">\nAddress\n<input id=\"address\" />\n<input type=\"radio\" name=\"built_out\" value=\"built_out\"/> built out\n<input type=\"radio\" name=\"built_out\" value=\"shell\"> shell\nSquare Feet\n<input type=\"text\" name=\"square_feet\">\n<span id=\"price_per_month\">Price/Month</span>\nPrice Includes (check all that apply)\n<input type=\"checkbox\" id=\"all_the_below\"> All the below\n<input type=\"checkbox\" id=\"property_taxes\"> Property Taxes\n<input type=\"checkbox\" id=\"all_the_below\"> Renal Tax\n<input type=\"checkbox\" id=\"all_the_below\"> Insurance building and TI insurance\n<input type=\"checkbox\" id=\"all_the_below\"> CAM Fees\n<input type=\"checkbox\" id=\"all_the_below\"> Electricity\n<input type=\"checkbox\" id=\"all_the_below\"> Water\n<input type=\"checkbox\" id=\"all_the_below\"> Janitorial\n<input type=\"checkbox\" id=\"all_the_below\"> Internet\n<input type=\"checkbox\" id=\"all_the_below\"> Phone Line\n<input type=\"checkbox\" id=\"all_the_below\"> Alarm Sytem Monitoring\nDescription\n<textarea id=\"description\"></textarea>\nYoutube Video (link or embed code)\n<input type=\"text\" id=\"youtube\" />\n<input type=\"submit\" value=\"Add\" id=\"add_submit\">\n</form>\n</pre>");
      $('#add_heading').click(function(e) {
        return $('.main-input-toggle').toggle('slow');
      });
      $('#add_form').submit(function(e) {
        e.preventDefault();
        return false;
      });
      return $('#address').typed({
        callback: function() {
          return Listing.change_address($('#address').val());
        }
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
          o.login.username = data.username;
          Login.render(o.login);
          return that["super"].initialize(o);
        }
      });
    },
    append: function(o) {
      this["super"].append(o);
      $(document.body).css({
        "overflow-x": "hidden",
        margin: 0,
        padding: 0
      });
      $(o.__el).css({
        "overflow-x": "hidden"
      });
      return $(o.__el).attr("id", "officelist-app").append("");
    }
  });
  render = function(o) {
    return this.render_login(o);
  };
  start = function() {
    return (app = obj({
      login: obj({
        username: "",
        __type: Login
      }),
      search: obj({
        __type: Search
      }),
      add: obj({
        __type: AddSpot
      }),
      map: obj({
        value: "",
        __type: GoogleMap
      }),
      __type: App,
      listing: obj({
        __type: Listing
      }),
      listings: []
    }));
  };
  $(document).ready(function() {
    return Severus.initialize("http://severus.the.tl/severus.html", start);
  });
}).call(this);
