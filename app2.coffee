
LoginModel = Backbone.Model.extend
  username: ""



login = new LoginModel  
LoginView = Backbone.View.extend
  render: () ->
    

OfficeView = Backbone.View.extend
  initialize: () ->
    this.model.bind "change", this.render
    this.model.view = this #so the model has access to the view jic

  render: () ->
    consoel.log "rendering", this.model

OfficelistApp = Backbone.Model.extend
  login: login


OfficeModel = Backbone.Model.extend {}

OfficesCollection = Backbone.Collection.extend
  model: OfficeModel
  url: "/listings"

offices = new OfficesCollection


OfficelistView = Backbone.View.extend
  initialize: () ->
    console.log "initialized!!!"
    offices.bind "refresh", this.render
    offices.bind "refresh", this.addAll

    offices.fetch
      success: () -> console.log "yay fetch"
      error: () -> console.log "nay fetch"
    console.log "tried to fetch"

  addAll: () ->
    offices.each(this.addOne)

  addOne: (office) ->
    view = new OfficeView
      model: office
      #this is like the parent view . In examples. parent view adds the dom element, but different with google maps
      view.render()

  render: () ->
    #alert "THIS IS THE OFFICELIST VIEW!"
    this.el = this.make "div", {}, "howdy"
    $(document.body).append this.el
    return this

Severus.initialize "http://severus.the.tl/severus.html", () ->
  app = new OfficelistView()




