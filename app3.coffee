#for simpler programming
obj = Neckbrace.obj
arr = Neckbrace.arr
map = "" #for the google map
app = "" #for the main app


clobbers = ["is_new", "is_mine", "save", "render", "append", "initialize", "before_save",
"set", "add", "getById", "getByUid"]

N = {}
for val in clobbers
  N[val] = (o, args...) ->
    o.__type[val] o, args...

#for val in clobbers
# how would I do this? explicit scope!!

is_new = (o) ->
  o.__type.is_new o
is_mine = (o) ->
  o.__type.is_mine o
save = (o, options) ->
  o.__type.save o, options
before_save = (o) ->
  o.__type.before_save o
append = (o) ->
  o.__type.append o
initialize = (o) ->
  o.__type.initialize o
render = (o) ->
  o.__type.initialize o
set = (o, vals) ->
  o.__type.set o, vals


GoogleMap = Neckbrace.Type.copy
  name: "Google Map"
  element: "div"
  append: (o) ->
    this.super.append o
    $(o.__el).addClass "groogle-map"
    $(o.__el).css 
      height:screen.availHeight
      width: screen.availWidth - 300
      left: "300px"
      top: 0
      position: "absolute"

    latlng = new google.maps.LatLng(33.4222685, -111.8226402)
    myOptions =
      zoom: 8
      center: latlng
      mapTypeId: google.maps.MapTypeId.ROADMAP
    map = new google.maps.Map o.__el, myOptions
  get_location: (wherethe, callback) ->
    geocoder = new google.maps.Geocoder()
    geocoder.geocode address: wherethe, (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        callback(results[0].geometry.location)
      else
        
        console["log"] "there was a problem looking up #{wherethe}"



Login = Neckbrace.Type.copy
  name: "login"
  element: "div"
  #set: 
  append: (o) ->
    this.super.append o
    that = this
    $(o.__el).append """
      <div id="logged_in_block" style="display:none;">
        Logged in as <div id="username_display"></div>
        <a href="#" id="logout_link">Logout</a>
      </div>
      <div id="not_logged_in_block">
        <a href="#" id="login_link">Log in</a> | <a href="#" id="signup_link">Sign up</a> | 
      <!--<a href="javascript:Severus.login()">Login with facebook</a><br>-->
          <div id="login_signup" style="display: none;">
            <form id="login-form">
              What is your email address? <br>
              <input type="text" id="username"><br>
              <select id="question">
                <option value="mom-maiden-name">What is your mom's Maiden Name?</option>
                <option value="pets-name">What is your pet's maiden Name?</option>
                <option value="dream-car">What is the maiden name of your dream car?</option>
              </select><br>
              <input type="text" id="password"><br>
              <input id="login_signup_button" type="submit" value="Login/Create Account">
            </form>
          </div>
      </div>
    """
    $('#login_link').click (e) ->
      e.preventDefault()
      $('#login_signup_button').val "Log in"
      $('#login_signup').toggle()
    $('#signup_link').click (e) ->
      e.preventDefault()
      $('#login_signup_button').val "Sign up"
      $('#login_signup').toggle()
    $("#login-form").submit (e) ->
      e.preventDefault()
      creds = 
        username: $("#username").val()
        password: $("#question").val() + ":" + $("#password").val()
      Severus.login creds, (data) ->
        if data.result is true
          location.href = app.url
          return
          #todo: Later do this severus.ajax and then dynamically
          #update listings so you can edit them
          Severus.ajax
            url: "/me"
            success : (data) ->
              o.username = data.username
              that.render o
    $('#logout_link').click () ->
      Severus.logout (data) ->
        if data.result is true
          o.username = "" #maybe just change app.username and call render_usrename() to make changes
          that.render o
  render: (o) ->
    
    if o.username isnt ""
      username = o.username.split ":"
      o.user_part = username[1]
      $('#not_logged_in_block').hide()
      $('#logged_in_block').show()
      $('#username_display').text o.user_part
    else
      $('#not_logged_in_block').show()
      $('#logged_in_block').hide()
      $('#username_display').text ""

Search = Neckbrace.Type.copy
  name: "Search"
  append: (o) ->
    this.super.append o
    $(o.__el).append """
      <pre>
      <h2 id="search_heading">Search</h2><form id="search_form" class="main-input-toggle">
      <select id="search_for_lease">
        <option>For Lease</option>
        <option>For Sale</option>
      </select>
      <input type="checkbox" name="built_out" value="built_out"/> built out
      <input type="checkbox" name="built_out" value="shell"> shell
      City or Zip
      <input type="text" name="city">
      Square Feet
      <input type="text" name="min" size="4" /><input type="text" name="max" size="4" />
      Price/Month
      <input type="text" name="min" size="4" /><input type="text" name="max" size="4"/>
      Keywords
      <input type="text" name="keywords">
      <input type="submit" value="Search">
      </form>
      </pre>
    """
    $('#search_heading').click (e) ->
      $('.main-input-toggle').toggle('slow')

    
    $('#search_form').submit (e) ->
      e.preventDefault()

      return false

Marker = Neckbrace.Type.copy
  name: "Marker"
  element: "n/a"
  append: (o) ->
    marker_options =
      position: o.listing.loc
      map: map
      title: "hello world"
      icon: "pin.png"
    if is_mine(o.listing) and is_new o.listing
      marker_options.draggable = true
      marker_options.icon = "apartment.png"
    o._marker = new google.maps.Marker marker_options
    if is_new o.listing
      map.setCenter o.listing.loc
      map.setZoom 15
    #specifically not calling this.super.append o
    google.maps.event.addListener o._marker, "click", () ->
      for listing in app.listings
        listing.bubble._bubble.close()
      o.listing.bubble._bubble.open map, o._marker

      # now, make it editable if you can

  remove: (o) ->
    o?._marker?.setMap null
  
Bubble = Neckbrace.Type.copy
  name: "bubble"

  global_watcher: (o) ->
    #this method puts a handler on the document.body
    #to handle clicks
    $(document.body).click (e) ->
      
      #edit a listing
      if $(e.target).is ".bubble_edit"
        id = $(e.target).attr "data-id"
        new_listing = N.getById app.listings, id
        set app, "listing": new_listing #consider app.set "listing": app.listings.getById id
  append: (o) ->
    info = """
      <pre style="height: 200px;">
      <span class="bubble location">#{o.listing.address or ""}</span>
      <span class="bubble price">#{o.listing.price or ""}</span>
      <span class="bubble description">#{o.listing.description or ""}</span>
      <span class="bubble square_feet">#{o.listing.square_feet or ""}</span>
      <span class="bubble built_out">#{o.listing.built_out or ""}</span>
      </pre>
    """
    info = $ info
    if not(is_new o.listing) and is_mine o.listing
      info.append "<a href='#' id='bubble_edit_#{o.__uid}' data-id='#{o.listing._id}' 
        class='bubble_edit'>Edit</a>"
    o._bubble = new google.maps.InfoWindow
      content: info[0]
    if is_new o.listing
      o._bubble.open map, o.listing.marker._marker
    $('#bubble_edit#{o.__uid}').click (e) ->
      e.preventDefault()
      alert "test"

  render: (o) ->
    $('.bubble.square_feet').text o.listing.square_feet
    $('.bubble.price').text o.listing.price
    $('.bubble.description').text o.listing.description
    $('.bubble.built_out').text o.listing.built_out
  remove: (o) ->
    o?._bubble.close()

Listings = Neckbrace.Type.copy()

Listing = Neckbrace.Type.copy
  name: "listing"
  plural: "listings"
  ajax: Severus.ajax
  element: "n/a"
  initialize: (o) ->
    this.super.initialize o

  append: (o) ->
    #do noting
    if o.lat and o.lng
      o.loc = new google.maps.LatLng o.lat, o.lng
      Marker.remove o.marker #times like these where i may want app.listing.remove()
      #and use prototypal inheritance.
      o.marker = obj
        __type: Marker
        listing: o #point back to the listing for reference
      Bubble.remove o.bubble
      o.bubble = obj
        __type: Bubble
        listing: o
    
    
  render: (o) ->
    if o.lat and o.lng
      Marker.render o.marker
      Bubble.render o.bubble
  change_address: (address) ->
    GoogleMap.get_location address, (loc) ->
      app.listing.address = address
      app.listing.loc = loc
      app.listing.lat = loc.lat()
      app.listing.lng = loc.lng()
      append app.listing
  before_save: (o) ->
    ret = {}
    for key, val of o
      if key not in ['bubble', 'marker']
        ret[key] = val
    ret._public = true
    return this.super.before_save ret
  is_mine: (o) ->
    return app.login.username is o._user
  
  

AddSpot = Neckbrace.Type.copy
  name : "edit spot"
  element: "div"
  append: (o) ->
    this.super.append o
    $(o.__el).append """
      <pre>
      <h2 id="add_heading">Add</h2><form class="main-input-toggle" style="display:none;" id="add_form">
      <select id="add_for_lease">
        <option>For Lease</option>
        <option>For Sale</option>
      </select>
      Address
      <input id="address" />
      <input type="radio" name="built_out" value="Built out"/> built out
      <input type="radio" name="built_out" value="shell"> shell
      Square Feet
      <input type="text" id="square_feet" name="square_feet">
      <span id="price_per_month">Price/Month</span>
      Price Includes (check all that apply)
      <input type="checkbox" id="all_the_below"> All the below
      <input type="checkbox" id="property_taxes"> Property Taxes
      <input type="checkbox" id="all_the_below"> Renal Tax
      <input type="checkbox" id="all_the_below"> Insurance building and TI insurance
      <input type="checkbox" id="all_the_below"> CAM Fees
      <input type="checkbox" id="all_the_below"> Electricity
      <input type="checkbox" id="all_the_below"> Water
      <input type="checkbox" id="all_the_below"> Janitorial
      <input type="checkbox" id="all_the_below"> Internet
      <input type="checkbox" id="all_the_below"> Phone Line
      <input type="checkbox" id="all_the_below"> Alarm Sytem Monitoring
      Description
      <textarea id="description"></textarea>
      Youtube Video (link or embed code)
      <input type="text" id="youtube" />
      <input type="submit" value="Add" id="add_submit">
      </form>
      </pre>
    """
    $('#add_heading').click (e) ->
      $('.main-input-toggle').toggle('slow')
    
    #add a listing
    # as you type, the listing object gets updated.
    # this is just one way to do it.
    # you could go thru the form and save the form values at the end
    # but not this time around.
    $('#add_form').submit (e) ->
      e.preventDefault()
      save app.listing,
        success: (data) ->
        error: (data) ->
          console["log"] "error"
        
      return false
    
    $('#address').typed callback: () ->
      Listing.change_address $('#address').val()
   
    $('#add_for_lease').change (e) ->
      app.listing.for_lease = $(this).val()

    #$('#add_for_lease').click (e) ->
    #  c#onsole.log $(this).val()

    $('[name="built_out"]').click (e) ->
      app.listing.built_out = $(this).val()
      Listing.render app.listing
      
    $('#square_feet').keyup (e) ->
      app.listing.square_feet  = $(this).val()
      Listing.render app.listing

    $('#description').keyup (e) ->
      app.listing.description = $(this).val()
      Listing.render app.listing
  render: (o) ->
    if not $('#add_heading').next().is(":visible")
      $('#add_heading').click()

App = Neckbrace.Type.copy
  name: "app"
  element: "div"
  initialize: (o) ->
    that = this
    
    Bubble.global_watcher() #sets up the bubble edit click code, etc
     
    Severus.ajax
      url: "/me"
      success: (data) ->
        o.login.username = data.username
        Login.render o.login
        
        Listing.fetch
          success: (data) ->
            for listing in data
              listing.__type = Listing
              N.add o.listings, obj listing #consider o.listings.add obj listing
        that.super.initialize o
        $('#add_heading').click() #make the add heading come up first
    
  append: (o) ->
    this.super.append o
    $(document.body).css
      "overflow-x": "hidden"
      margin: 0
      padding: 0
    $(o.__el).css
      "overflow-x": "hidden"
    $(o.__el).attr("id", "officelist-app").append """
        
    """
  render: (o) ->
    #this.render_login o
  set: (o, vals) ->
    this.super.set o, vals
    if "listing" of vals
      AddSpot.render()
start = () ->
  app = window.app = obj
    url: "http://officelist.the.tl"
    login: obj
      username: ""
      __type: Login
    search: obj
      __type: Search
    add: obj
      __type: AddSpot
    map: obj
      value: ""
      __type: GoogleMap
    __type: App
    listing: obj
      __type: Listing
    listings: arr([], __type: Listings)
    
   
$(document).ready () ->
  Severus.initialize "http://severus.the.tl/severus.html", start
