(function() {
  var AddSpot, App, Bubble, GoogleMap, Listing, Listings, Login, Marker, N, Search, _i, _len, _ref, app, append, arr, before_save, clobbers, initialize, is_mine, is_new, map, obj, render, save, set, start;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  obj = Neckbrace.obj;
  arr = Neckbrace.arr;
  map = "";
  app = "";
  clobbers = ["is_new", "is_mine", "save", "render", "append", "initialize", "before_save", "set", "add", "getById", "getByUid"];
  N = {};
  _ref = clobbers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    (function() {
      var val = _ref[_i];
      return (N[val] = function(o) {
        var args;
        args = __slice.call(arguments, 1);
        return o.__type[val].apply(o.__type, [o].concat(args));
      });
    })();
  }
  is_new = function(o) {
    return o.__type.is_new(o);
  };
  is_mine = function(o) {
    return o.__type.is_mine(o);
  };
  save = function(o, options) {
    return o.__type.save(o, options);
  };
  before_save = function(o) {
    return o.__type.before_save(o);
  };
  append = function(o) {
    return o.__type.append(o);
  };
  initialize = function(o) {
    return o.__type.initialize(o);
  };
  render = function(o) {
    return o.__type.initialize(o);
  };
  set = function(o, vals) {
    return o.__type.set(o, vals);
  };
  GoogleMap = Neckbrace.Type.copy({
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
        return status === google.maps.GeocoderStatus.OK ? callback(results[0].geometry.location) : console["log"]("there was a problem looking up " + (wherethe));
      });
    }
  });
  Login = Neckbrace.Type.copy({
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
            location.href = app.url;
            return null;
            return Severus.ajax({
              url: "/me",
              success: function(data) {
                o.username = data.username;
                return that.render(o);
              }
            });
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
      var username;
      if (o.username !== "") {
        username = o.username.split(":");
        o.user_part = username[1];
        $('#not_logged_in_block').hide();
        $('#logged_in_block').show();
        return $('#username_display').text(o.user_part);
      } else {
        $('#not_logged_in_block').show();
        $('#logged_in_block').hide();
        return $('#username_display').text("");
      }
    }
  });
  Search = Neckbrace.Type.copy({
    name: "Search",
    append: function(o) {
      this["super"].append(o);
      $(o.__el).append("<pre>\n<h2 id=\"search_heading\">Search</h2><form id=\"search_form\" class=\"main-input-toggle\">\n<select id=\"search_for_lease\">\n  <option>For Lease</option>\n  <option>For Sale</option>\n</select>\n<input type=\"checkbox\" name=\"built_out\" value=\"built_out\"/> built out\n<input type=\"checkbox\" name=\"built_out\" value=\"shell\"> shell\nCity or Zip\n<input type=\"text\" name=\"city\">\nSquare Feet\n<input type=\"text\" name=\"min\" size=\"4\" /><input type=\"text\" name=\"max\" size=\"4\" />\nPrice/Month\n<input type=\"text\" name=\"min\" size=\"4\" /><input type=\"text\" name=\"max\" size=\"4\"/>\nKeywords\n<input type=\"text\" name=\"keywords\">\n<input type=\"submit\" value=\"Search\">\n</form>\n</pre>");
      $('#search_heading').click(function(e) {
        return $('.main-input-toggle').toggle('slow');
      });
      return $('#search_form').submit(function(e) {
        e.preventDefault();
        return false;
      });
    }
  });
  Marker = Neckbrace.Type.copy({
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
      if (is_mine(o.listing) && is_new(o.listing)) {
        marker_options.draggable = true;
        marker_options.icon = "apartment.png";
      }
      o._marker = new google.maps.Marker(marker_options);
      if (is_new(o.listing)) {
        map.setCenter(o.listing.loc);
        map.setZoom(15);
      }
      return google.maps.event.addListener(o._marker, "click", function() {
        var _j, _len2, _ref2, listing;
        _ref2 = app.listings;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          listing = _ref2[_j];
          listing.bubble._bubble.close();
        }
        return o.listing.bubble._bubble.open(map, o._marker);
      });
    },
    remove: function(o) {
      return (typeof o === "undefined" || o === null) ? undefined : o._marker == null ? undefined : o._marker.setMap(null);
    }
  });
  Bubble = Neckbrace.Type.copy({
    name: "bubble",
    global_watcher: function(o) {
      return $(document.body).click(function(e) {
        var id, new_listing;
        if ($(e.target).is(".bubble_edit")) {
          id = $(e.target).attr("data-id");
          new_listing = N.getById(app.listings, id);
          return set(app, {
            "listing": new_listing
          });
        }
      });
    },
    append: function(o) {
      var info;
      info = ("<pre style=\"height: 200px;\">\n<span class=\"bubble location\">" + (o.listing.address || "") + "</span>\n<span class=\"bubble price\">" + (o.listing.price || "") + "</span>\n<span class=\"bubble description\">" + (o.listing.description || "") + "</span>\n<span class=\"bubble square_feet\">" + (o.listing.square_feet || "") + "</span>\n<span class=\"bubble built_out\">" + (o.listing.built_out || "") + "</span>\n</pre>");
      info = $(info);
      if (!(is_new(o.listing)) && is_mine(o.listing)) {
        info.append("<a href='#' id='bubble_edit_" + (o.__uid) + "' data-id='" + (o.listing._id) + "' \
        class='bubble_edit'>Edit</a>");
      }
      o._bubble = new google.maps.InfoWindow({
        content: info[0]
      });
      if (is_new(o.listing)) {
        o._bubble.open(map, o.listing.marker._marker);
      }
      return $('#bubble_edit#{o.__uid}').click(function(e) {
        e.preventDefault();
        return alert("test");
      });
    },
    render: function(o) {
      $('.bubble.square_feet').text(o.listing.square_feet);
      $('.bubble.price').text(o.listing.price);
      $('.bubble.description').text(o.listing.description);
      return $('.bubble.built_out').text(o.listing.built_out);
    },
    remove: function(o) {
      return (typeof o === "undefined" || o === null) ? undefined : o._bubble.close();
    }
  });
  Listings = Neckbrace.Type.copy();
  Listing = Neckbrace.Type.copy({
    name: "listing",
    plural: "listings",
    ajax: Severus.ajax,
    element: "n/a",
    initialize: function(o) {
      return this["super"].initialize(o);
    },
    append: function(o) {
      if (o.lat && o.lng) {
        o.loc = new google.maps.LatLng(o.lat, o.lng);
        Marker.remove(o.marker);
        o.marker = obj({
          __type: Marker,
          listing: o
        });
        Bubble.remove(o.bubble);
        return (o.bubble = obj({
          __type: Bubble,
          listing: o
        }));
      }
    },
    render: function(o) {
      if (o.lat && o.lng) {
        Marker.render(o.marker);
        return Bubble.render(o.bubble);
      }
    },
    change_address: function(address) {
      return GoogleMap.get_location(address, function(loc) {
        app.listing.address = address;
        app.listing.loc = loc;
        app.listing.lat = loc.lat();
        app.listing.lng = loc.lng();
        return append(app.listing);
      });
    },
    before_save: function(o) {
      var _ref2, key, ret, val;
      ret = {};
      _ref2 = o;
      for (key in _ref2) {
        if (!__hasProp.call(_ref2, key)) continue;
        val = _ref2[key];
        if (!('bubble' === key || 'marker' === key)) {
          ret[key] = val;
        }
      }
      ret._public = true;
      return this["super"].before_save(ret);
    },
    is_mine: function(o) {
      return app.login.username === o._user;
    }
  });
  AddSpot = Neckbrace.Type.copy({
    name: "edit spot",
    element: "div",
    append: function(o) {
      this["super"].append(o);
      $(o.__el).append("<pre>\n<h2 id=\"add_heading\">Add</h2><form class=\"main-input-toggle\" style=\"display:none;\" id=\"add_form\">\n<select id=\"add_for_lease\">\n  <option>For Lease</option>\n  <option>For Sale</option>\n</select>\nAddress\n<input id=\"address\" />\n<input type=\"radio\" name=\"built_out\" value=\"Built out\"/> built out\n<input type=\"radio\" name=\"built_out\" value=\"shell\"> shell\nSquare Feet\n<input type=\"text\" id=\"square_feet\" name=\"square_feet\">\n<span id=\"price_per_month\">Price/Month</span>\nPrice Includes (check all that apply)\n<input type=\"checkbox\" id=\"all_the_below\"> All the below\n<input type=\"checkbox\" id=\"property_taxes\"> Property Taxes\n<input type=\"checkbox\" id=\"all_the_below\"> Renal Tax\n<input type=\"checkbox\" id=\"all_the_below\"> Insurance building and TI insurance\n<input type=\"checkbox\" id=\"all_the_below\"> CAM Fees\n<input type=\"checkbox\" id=\"all_the_below\"> Electricity\n<input type=\"checkbox\" id=\"all_the_below\"> Water\n<input type=\"checkbox\" id=\"all_the_below\"> Janitorial\n<input type=\"checkbox\" id=\"all_the_below\"> Internet\n<input type=\"checkbox\" id=\"all_the_below\"> Phone Line\n<input type=\"checkbox\" id=\"all_the_below\"> Alarm Sytem Monitoring\nDescription\n<textarea id=\"description\"></textarea>\nYoutube Video (link or embed code)\n<input type=\"text\" id=\"youtube\" />\n<input type=\"submit\" value=\"Add\" id=\"add_submit\">\n</form>\n</pre>");
      $('#add_heading').click(function(e) {
        return $('.main-input-toggle').toggle('slow');
      });
      $('#add_form').submit(function(e) {
        e.preventDefault();
        save(app.listing, {
          success: function(data) {},
          error: function(data) {
            return console["log"]("error");
          }
        });
        return false;
      });
      $('#address').typed({
        callback: function() {
          return Listing.change_address($('#address').val());
        }
      });
      $('#add_for_lease').change(function(e) {
        return (app.listing.for_lease = $(this).val());
      });
      $('[name="built_out"]').click(function(e) {
        app.listing.built_out = $(this).val();
        return Listing.render(app.listing);
      });
      $('#square_feet').keyup(function(e) {
        app.listing.square_feet = $(this).val();
        return Listing.render(app.listing);
      });
      return $('#description').keyup(function(e) {
        app.listing.description = $(this).val();
        return Listing.render(app.listing);
      });
    },
    render: function(o) {
      return !$('#add_heading').next().is(":visible") ? $('#add_heading').click() : null;
    }
  });
  App = Neckbrace.Type.copy({
    name: "app",
    element: "div",
    initialize: function(o) {
      var that;
      that = this;
      Bubble.global_watcher();
      return Severus.ajax({
        url: "/me",
        success: function(data) {
          o.login.username = data.username;
          Login.render(o.login);
          Listing.fetch({
            success: function(data) {
              var _j, _len2, _ref2, _result, listing;
              _result = []; _ref2 = data;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                listing = _ref2[_j];
                _result.push((function() {
                  listing.__type = Listing;
                  return N.add(o.listings, obj(listing));
                })());
              }
              return _result;
            }
          });
          that["super"].initialize(o);
          return $('#add_heading').click();
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
    },
    render: function(o) {},
    set: function(o, vals) {
      this["super"].set(o, vals);
      return "listing" in vals ? AddSpot.render() : null;
    }
  });
  start = function() {
    return (app = (window.app = obj({
      url: "http://officelist.the.tl",
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
      listings: arr([], {
        __type: Listings
      })
    })));
  };
  $(document).ready(function() {
    return Severus.initialize("http://severus.the.tl/severus.html", start);
  });
}).call(this);
