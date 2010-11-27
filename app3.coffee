#for simpler programming
obj = NeckBrace.obj
arr = NeckBrace.arr
map = "" #for the google map
app = "" #for the main app
GoogleMap = NeckBrace.Type.copy
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
        console.log status
        console.log results
        console.log "there was a problem looking up #{wherethe}"



Listing = NeckBrace.Type.copy
  name: "listing"
  element: "n/a"
  append: (o) ->
    console.log "just add to google map"
  render: (o) ->
    #do other things
Login = NeckBrace.Type.copy
  name: "login"
  element: "div"
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
          o.username = creds.username
          that.render o
    $('#logout_link').click () ->
      Severus.logout (data) ->
        if data.result is true
          o.username = "" #maybe just change app.username and call render_usrename() to make changes
          that.render o
  render: (o) ->
    if o.username isnt ""
      $('#not_logged_in_block').hide()
      $('#logged_in_block').show()
      console.log "parent is", o.__parent
      $('#username_display').text o.username
    else
      $('#not_logged_in_block').show()
      $('#logged_in_block').hide()
      $('#username_display').text ""

Search = NeckBrace.Type.copy
  name: "Search"
  append: (o) ->
    this.super.append o
    $(o.__el).append """
      <pre>
      <h1 id="search_heading">Search</h1><form id="search_form" class="main-input-toggle">
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

Marker = NeckBrace.Type.copy
  name: "Marker"
  element: "n/a"
  append: (o) ->
    marker_options =
      position: o.listing.loc
      map: map
      title: "hello world"
      icon: "pin.png"
    o._marker = new google.maps.Marker marker_options
    map.setCenter o.listing.loc
    map.setZoom 15
    
    o.listing.bubble
    #specifically not calling this.super.append o
  remove: (o) ->
    o?._marker?.setMap null
  
Bubble = NeckBrace.Type.copy
  name: "bubble"
  append: (o) ->
    info = """
      <pre>
      <span class="bubble location">#{o.listing.address}</span>
      <span class="bubble size">#{o.listing.size}</span>
      <span class="bubble price">#{o.listing.price}</span>
      <span class="bubble desc">#{o.listing.desc}</span>
      </pre>
    """ 
    o._bubble = new google.maps.InfoWindow
      content: info
    o._bubble.open map, o.listing.marker._marker
  render: (o) ->
    
  remove: (o) ->
    o?._bubble.close()
Listing = NeckBrace.Type.copy
  name: "Listing"
  element: "n/a"
  initialize: (o) ->
    #do nothing
  append: (o) ->
    #do noting
  render: (o) ->
    Marker.render o.marker
    Bubble.render o.bubble
  change_address: (address) ->
    GoogleMap.get_location address, (loc) ->
      console.log "loc is", loc
      app.listing.address = address
      app.listing.loc = loc
      app.listing.lat = loc.lat()
      app.listing.lng = loc.lng()
      Marker.remove app.listing.marker #times like these where i may want app.listing.remove()
      #and use prototypal inheritance.
      #app.listing.marker?.remove()
      app.listing.marker = obj
        __type: Marker
        listing: app.listing #point back to the listing for reference
      Bubble.remove app.listing.bubble
      app.listing.bubble = obj
        __type: Bubble
        listing: app.listing

  

AddSpot = NeckBrace.Type.copy
  name : "edit spot"
  element: "div"
  append: (o) ->
    this.super.append o
    $(o.__el).append """
      <pre>
      <h1 id="add_heading">Add</h1><form class="main-input-toggle" style="display:none;" id="add_form">
      Address
      <input id="address" />
      <input type="radio" name="built_out" value="built_out"/> built out
      <input type="radio" name="built_out" value="shell"> shell
      Square Feet
      <input type="text" name="square_feet">
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
    $('#add_form').submit (e) ->
      e.preventDefault()

      return false
    $('#address').typed callback: () ->
      Listing.change_address $('#address').val()
    
    $('[name="built_out"]').click (e) ->
      app.listing.built_out = $(this).val()
      Listing.render app.listing
    $('#square_feet, #description').keyup (e) ->
      Listing.render app.listing

App = NeckBrace.Type.copy
  name: "app"
  element: "div"
  initialize: (o) ->
    that = this
    Severus.ajax
      url: "/me"
      success: (data) ->
        o.login.username = data.username
        Login.render o.login
        
        that.super.initialize o 
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
  render = (o) ->
    this.render_login o
    
start = () ->
  app = obj
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
    listings: []
    
   
$(document).ready () ->
  Severus.initialize "http://severus.the.tl/severus.html", start

