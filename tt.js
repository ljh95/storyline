var express = require('express');
var app = express();

app.get('/main', function(req, res){
  var html = `
  
    
      
      <p>good?</p>
    
  

  `
  res.send(html);
  //<iframe src="https://5b29325c.ngrok.io/index" width="" height="">Letsee Test</iframe>
})

app.listen(3002, function () {
  console.log('Example app listening on port 3002!');
});
