// Client-side Canvas

// array to store interactive words
var words = [];
var wordBeingMoved;
// location of mouse pressed
var deltaX, deltaY;
// canvas is the word-dragging area
var canvas = document.getElementById('canvas1');

function getWordAtLocation(aCanvasX, aCanvasY){
  // retrieve the context of the canvas
  var context = canvas.getContext('2d');
  // go through all the words
  for(var i = 0; i < words.length; i++){
    // boundaries on the draggable words
    if((Math.abs(words[i].x - aCanvasX) < context.measureText(words[i].word).width) && (aCanvasX - words[i].x > 0)
    && (words[i].y - aCanvasY < 20) && (words[i].y - aCanvasY > - 2))
    // return the word at that location
    return words[i];
  }
  return null;
}

var drawCanvas = function(){
  var context = canvas.getContext('2d');
  // canvas formatting
  context.fillStyle = 'white';
  // erase previous frames
  context.fillRect(0,0,canvas.width,canvas.height);

  // font formatting
  context.font = '20pt Arial';
  context.fillStyle = 'cornflowerblue';
  context.strokeStyle = 'blue';

  // go through the words
  for(var i = 0; i < words.length; i++){
    // draw them at each location
    context.fillText(words[i].word, words[i].x, words[i].y);
    context.strokeText(words[i].word, words[i].x, words[i].y);
  }
  // add in the stroke of the words
  context.stroke();
}

function handleMouseDown(e){
  // retrieve mouse location
  var rect = canvas.getBoundingClientRect();
  //use jQuery event for canvas locations
  var canvasX = e.pageX - rect.left;
  var canvasY = e.pageY - rect.top;

  // get the word
  wordBeingMoved = getWordAtLocation(canvasX, canvasY);

  // move the word if one is selected
  if(wordBeingMoved != null ){
    deltaX = wordBeingMoved.x - canvasX;
    deltaY = wordBeingMoved.y - canvasY;
    $("#canvas1").mousemove(handleMouseMove);
    $("#canvas1").mouseup(handleMouseUp);
  }

  // stop propagation of the event and stop any default browser actions
  e.stopPropagation();
  e.preventDefault();
  drawCanvas();
}

function handleMouseMove(e){
  //get mouse coordinates relative to top left of canvas
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.pageX - rect.left;
  var canvasY = e.pageY - rect.top;

  // move the word to the correct location
  wordBeingMoved.x = canvasX + deltaX;
  wordBeingMoved.y = canvasY + deltaY;

  // stop propagation of the event and stop any default browser actions
  e.stopPropagation();
  drawCanvas();
}

function handleMouseUp(e){
  e.stopPropagation();

  // remove interfering mouse move and mouse up handlers
  $("#canvas1").off("mousemove", handleMouseMove);
  $("#canvas1").off("mouseup", handleMouseUp);

  // redraw the canvas
  drawCanvas();
}

function handleSubmitButton () {
  // get text from user text input field
  var userText = $('#userTextField').val();

  // clear text field and text area
  document.getElementById("text-area").innerHTML = "";
  $('#userTextField').val('');

  //user text was not empty
  if(userText != ''){
    //make object to send to server
    var userRequestObj = {text: userText};
    //make json string
    var userRequestJSON = JSON.stringify(userRequestObj);

    // prepare a POST message for the server and a call back function
    // to catch the server repsonse.
    $.post("userText", userRequestJSON, function(data, status){
      var responseObj = JSON.parse(data);

      // if the song exists
      if(responseObj.wordArray.length > 1) {
        // put the paragraph into HTML
        responseObj.wordArray.forEach(printSentences);

        // clear the existing words
        words.length = 0;
        // double for loop to put the sentences into words and add them to the array
        for(var outer = 0; outer < responseObj.wordArray.length; outer++) {
          // counter to split up words evenly
          var lengthCounter = 0;
          var sentenceSplit = responseObj.wordArray[outer].split(" ");
          for(var inner = 0; inner < sentenceSplit.length; inner++) {
            // add words to array at correct locations
            words.push({word: sentenceSplit[inner], x:(lengthCounter*20 + sentenceSplit[inner].length*2), y:(outer+1)*70});
            lengthCounter += sentenceSplit[inner].length;
          }
        }
        // otherwise indicate the song does not exist
      } else {
        // clear the on-screen words
        words.length = 0;
        // display the alert
        alert ("The song: '" + userText + "' does not exist!");
      }
    });
  } else
  // clear the on-screen words (if there is any)
  words.length = 0;
}

function printSentences(sentence) {
  // get the text-area element
  let textDiv = document.getElementById("text-area")
  // add the sentence in a paragraph of the element
  textDiv.innerHTML = textDiv.innerHTML + `<p> ${ sentence + "<br>" } </p>`
}

$(document).ready(function(){
  // this is called after the browser has loaded the web page
  // add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown);
  setInterval(drawCanvas, 100);
});
