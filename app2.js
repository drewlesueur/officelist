(function() {
  var LoginModel, LoginView, OfficeModel, OfficeView, OfficelistApp, OfficelistView, OfficesCollection, login, offices;
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
      return consoel.log("rendering", this.model);
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
      console.log("initialized!!!");
      offices.bind("refresh", this.render);
      offices.bind("refresh", this.addAll);
      offices.fetch({
        success: function() {
          return console.log("yay fetch");
        },
        error: function() {
          return console.log("nay fetch");
        }
      });
      return console.log("tried to fetch");
    },
    addAll: function() {
      return offices.each(this.addOne);
    },
    addOne: function(office) {
      var view;
      view = new OfficeView({
        model: office
      });
      return view.render();
    },
    render: function() {
      this.el = this.make("div", {}, "howdy");
      $(document.body).append(this.el);
      return this;
    }
  });
  Severus.initialize("http://severus.the.tl/severus.html", function() {
    var app;
    return (app = new OfficelistView());
  });
})();
