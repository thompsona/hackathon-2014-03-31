var currentPitchSpace = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
                          'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'];
var frequencyPitchSpace = {"C": 0,"C#/D♭": 0,"D": 0,"D#/E♭": 0,
                            "E": 0,"F": 0,"F#/G♭": 0,"G": 0,"G#/A♭": 0,
                            "A": 20,"A#/B♭": 0,"B": 0};

/******************/
var confidence = 0;
var currentPitch = 0;
var rafID = null;
var tracks = null;
var buflen = 2048;
var buf = new Uint8Array( buflen );
var buffer = [];
var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.
/********************/

//--------
var visCanvas;
var visCanvas_context;
var count = 0;
var buffer = [];
var analysedLength;
//-----------

var audio_context;
var analyser;
var pitches = ["C","C-sharp-D-flat","D","D-sharp-E-flat","E","F","F-sharp-G-flat","G","G-sharp-A-flat","A","A-sharp-B-flat","B"];

var runner = function() {
  navigator.getMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);
  window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame  ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  if (typeof AudioContext !== "undefined") {
    console.log("A: using AudioContext!");
    audio_context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    console.log("A: using webkitAudioContext");
    audio_context = new webkitAudioContext();
  } else {
    console.log('A: no audiocontext');
    throw new Error('AudioContext not supported. :(');
  }

  function hasGetUserMedia() {
    return !!(navigator.getMedia);
  }

  if (hasGetUserMedia()) {
    console.log("A: has getUserMedia");
  } else {
    console.log('getUserMedia() is not supported in your browser');
  }



  //AudioContext and GetUserMedia defined:

  var onStream = function(stream) {

    var mediaStreamSource = audio_context.createMediaStreamSource(stream);
    console.log("A: in onStream");
    analyser = audio_context.createAnalyser();
    mediaStreamSource.connect(analyser);
    analyser.smoothingTimeConstant = .01;
    analysedLength = analyser.frequencyBinCount;
    console.log(analyser);


    visCanvas = document.getElementById('vis');
    console.log(visCanvas);
    visCanvas_context = visCanvas.getContext("2d");

    renderVis();
    renderPitch();
      };
    navigator.getMedia({audio: true}, onStream, function(error) {
      console.log("A: error in navigator.getUserMedia");
      console.log(error);
      throw new Error(error);
    });
};
window.onload = runner();
