(function() {
  var LoginModel, LoginView, OfficeModel, OfficeView, OfficelistApp, OfficelistView, OfficesCollection, login, offices, render_map;
  Backbone.emulateHttp = true;
  LoginModel = Backbone.Model.extend({
    username: ""
  });
  login = new LoginModel();
  LoginView = Backbone.View.extend({
    render: function() {}
  });
  OfficeView = Backbone.View.extend({
    initialize: function() {
      this.model.bind("change", this.render);
      return (this.model.view = this);
    },
    render: function() {
      return console.log("rendering", this.model);
    }
  });
  OfficelistApp = Backbone.Model.extend({
    login: login
  });
  OfficeModel = Backbone.Model.extend({});
  OfficesCollection = Backbone.Collection.extend({
    model: OfficeModel,
    url: "/listings"
  });
  offices = new OfficesCollection();
  OfficelistView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render', 'render_map');
      offices.bind("refresh", this.render);
      offices.bind("refresh", this.addAll);
      return offices.fetch({
        success: function() {
          return console.log("yay fetch");
        },
        error: function() {
          return console.log("nay fetch");
        }
      });
    },
    removeAll: function() {},
    addAll: function() {
      return offices.each(this.addOne);
    },
    addOne: function(office) {
      var view;
      view = new OfficeView({
        model: office
      });
      return view.render();
    }
  });
  render_map = function() {
    var latlng, myOptions;
    this.map_el = this.make("div", {
      id: "map"
    }, "ima a map");
    $(this.map).css({
      width: screen.width * .8,
      height: screen.height,
      position: 'absolute',
      left: screen.width * .2,
      top: 0
    });
    latlng = new google.maps.LatLng(33.4222685, -111.8226402);
    myOptions = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.map_el, myOptions);
    return {
      render: function() {
        alert("THIS IS THE OFFICELIST VIEW!");
        this.render_map();
        this.el = this.make("div", {}, "howdy");
        $(document.body).append(this.el);
        $(this.el).append(this.map_el);
        return this;
      }
    };
  };
  Severus.initialize("http://severus.the.tl/severus.html", function() {
    var app;
    return (app = new OfficelistView());
  });
}).call(this);
