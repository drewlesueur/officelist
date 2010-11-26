#for simpler programming
obj = NeckBrace.obj
arr = NeckBrace.arr
map = "" #for the google map

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
      <a href="javascript:Severus.login()">Login with facebook</a><br>
        <form id="login-form">
          What is your email address? <br>
          <input type="text" id="username"><br>
          <select id="question">
            <option value="mom-maiden-name">What is your mom's Maiden Name?</option>
            <option value="pets-name">What is your pet's maiden Name?</option>
            <option value="dream-car">What is the maiden name of your dream car?</option>
          </select><br>
          <input type="text" id="password"><br>
          <input type="submit" value="Login/Create Account">
        </form>
    """
      
App = NeckBrace.Type.copy
  name: "app"
  element: "div"
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

