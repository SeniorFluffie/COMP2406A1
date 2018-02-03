//Server Code

// need to http
var http = require("http");
// need to read static files
var fs = require("fs");
// for parsing url strings
var url = require("url");
// to count invocations of function(req,res)
var counter = 1000;
// dir to serve static files from
var ROOT_DIR = "html";

var MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  // js should really be application/javascript (however we are using txt files)
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES["txt"];
};

http
.createServer(function(request, response) {
  // url being entered
  var urlObj = url.parse(request.url, true, false);
  var receivedData = "";

  // attached event handlers to collect the message data
  request.on("data", function(chunk) {
    receivedData += chunk;
  });

  // event handler for the end of the message
  request.on("end", function() {
    // if it is a POST request then echo back the data.
    if (request.method == "POST") {
      // parse the recieved data as an object
      var dataObj = JSON.parse(receivedData);

      // here we can decide how to process the data object and what object to send back to client.
      // for now we pass back an object with a text property
      var songRead = require('fs');
      var songDir = require('path');
      songDir.join(__dirname, '/../', 'songs');

      // intialize the reader variable and array of words/chords
      var songRead = require('fs');
      var chords = {};

      // split the text file into words
      try {
        // read the file (and some chords don't have spaces on each side)
        // so replace the values to add spaces and then split
        chords = songRead.readFileSync(ROOT_DIR + '/../songs/' + dataObj.text + '.txt').toString().replace(/\]/g, "] ").replace(/\[/g, " [").split("\n");
      } catch(e) {
        // do nothing
      }
      // intialize return object
      var returnObj = {text: dataObj.text, wordArray: chords};
      // object to return to client
      response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] });
      // send back the JSON object
      response.end(JSON.stringify(returnObj));
    }

    if (request.method == "GET") {
      // handle GET requests as static file requests
      var filePath = ROOT_DIR + urlObj.pathname;
      // set file path to load page
      if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html";
      fs.readFile(filePath, function(err, data) {
        if (err) {
          // report error to console
          console.log("ERROR: " + JSON.stringify(err));
          // respond with not found 404 to client
          response.writeHead(404);
          response.end(JSON.stringify(err));
          return;
        }
        response.writeHead(200, { "Content-Type": get_mime(filePath) });
        // close data stream
        response.end(data);
      });
    }
  });
})
.listen(3000);

console.log("Server Running at http://127.0.0.1:3000/example1.html  CNTL-C to quit");
