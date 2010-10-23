(function() {
  $(document).ready(function() {
    var go;
    go = function() {
      return Severus.ajax({
        type: "GET",
        url: "json",
        success: function(data) {
          return console.log(data);
        },
        error: function(data) {
          return console.log("error");
        }
      });
    };
    return Severus.initialize("http://localhost:86/severus.html", go);
  });
})();
