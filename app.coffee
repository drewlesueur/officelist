$(document).ready () ->
  go = () ->
    Severus.ajax
      type: "GET",
      url: "json"
      success: (data) ->
        console.log data
      error: (data) ->
        console.log "error"
    
    
        
   
  Severus.initialize("http://localhost:86/severus.html", go)