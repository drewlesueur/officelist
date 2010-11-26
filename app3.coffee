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
          $('#not_logged_in_block').hide()
          $('#logged_in_block').show()
          $('#username_display').text creds.username
          app.username = creds.username
    $('#logout_link').click () ->
      Severus.logout (data) ->
        if data.result is true
          $('#not_logged_in_block').show()
          $('#logged_in_block').hide()
          $('#username_display').text ""
          app.username = "" #maybe just change app.username and call render_usrename() to make changes


App = NeckBrace.Type.copy
  name: "app"
  element: "div"
  initialize: (o) ->
    that = this
    Severus.ajax
      url: "/me"
      success: (data) ->
        console.log data
        that.super.initialize o 
  append: (o) ->
    this.super.append o
    $(document.body).css
      overflow: "hidden"
      margin: 0
      padding: 0
    $(o.__el).css
      overflow: "hidden"
    $(o.__el).attr("id", "officelist-app").append """
        
    """
  render = (o) ->
    this.render_login o
    
start = () ->
  console.log "started"
  app = obj
    username: ""
    login: obj
      __type: Login

    map: obj
      value: ""
      __type: GoogleMap
    __type: App
    
   
$(document).ready () ->
  Severus.initialize "http://severus.the.tl/severus.html", start

