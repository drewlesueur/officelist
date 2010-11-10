Backbone.emulateHttp = true

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
    console.log "rendering", this.model

OfficelistApp = Backbone.Model.extend
  login: login


OfficeModel = Backbone.Model.extend {}

OfficesCollection = Backbone.Collection.extend
  model: OfficeModel
  url: "/listings"

offices = new OfficesCollection


OfficelistView = Backbone.View.extend
  initialize: () ->
    _.bindAll(this, 'addOne', 'addAll', 'render', 'render_map');
    offices.bind "refresh", this.render
    offices.bind "refresh", this.addAll
    
    #office = new OfficeModel
    #  size: 300
    #  price: 200
    #offices.add office
    #office.save()

    offices.fetch
      success: () -> console.log "yay fetch"
      error: () -> console.log "nay fetch"

  removeAll: () ->
   
    
  addAll: () ->
    offices.each(this.addOne)

  addOne: (office) ->
    view = new OfficeView
      model: office
      #this is like the parent view . In examples. parent view adds the dom element, but different with google maps
    view.render()
  
  render_map = () -> 
    this.map_el = this.make "div", {id: "map"}, "ima a map"
    $(this.map).css
      width: screen.width * .8
      height: screen.height
      position: 'absolute'
      left: screen.width * .2
      top: 0
      
    latlng = new google.maps.LatLng(33.4222685, -111.8226402)
    myOptions = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.map_el, myOptions)
 
  render: () ->
    alert "THIS IS THE OFFICELIST VIEW!"
    this.render_map()
    
    this.el = this.make "div", {}, "howdy"
    
    $(document.body).append this.el
    $(this.el).append this.map_el
    return this

Severus.initialize "http://severus.the.tl/severus.html", () ->
  app = new OfficelistView()


