var renderVis = function() {

  visCanvas_context.clearRect(0, 0, visCanvas.width, visCanvas.height);
  var timeDomain = new Uint8Array(analysedLength);
  analyser.getByteTimeDomainData(timeDomain);

  /*time/vis*/
  // console.log(timeDomain);
  for (var i = 0; i < analysedLength; ++i) {
    var value = timeDomain[i]; //128, does change
    var percent = value / 256; //.5
    var height = visCanvas.height * percent; //150
    var offset = visCanvas.height - height - 1; //149
    var barWidth = visCanvas.width/analysedLength; //
    visCanvas_context.fillStyle = 'blue';
    visCanvas_context.fillRect(i * barWidth, offset, 1, 1);
  }
  // if(count < 2) {
    window.requestAnimationFrame( renderVis );
  // }
  // count++;
};

var renderPitch = function() {
    /**********************************************************/
    var timeDomain = new Uint8Array(analysedLength);
    analyser.getByteTimeDomainData(timeDomain);
    var noteStrings = ["C", "C#/D♭", "D", "D#/E♭", "E", "F", "F#/G♭", "G", "G#/A♭", "A", "A#/B♭", "B"];

   var cycles = new Array;
    analyser.getByteTimeDomainData( buf );
    for (var i = 0; i < analysedLength; ++i) {
      if(buffer.length < 5000) {
        var tempVal = buf[i];
        buffer.push(tempVal);
      }
      else {
        buffer = buffer.slice(500);
      }
    }
/*
    console.log( 
        "Cycles: " + num_cycles + 
        " - average length: " + sum + 
        " - pitch: " + pitch + "Hz " +
        " - note: " + noteFromPitch( pitch ) +
        " - confidence: " + confidence + "% "
        );
*/
    // possible other approach to confidence: sort the array, take the median; go through the array and compute the average deviation
    autoCorrelate( buf, audio_context.sampleRate );

//  detectorElem.className = (confidence>50)?"confident":"vague";

    if (confidence <10) {
        // console.log('low confidence');
        // document.getElementById('A').innerHTML = 'X';
    } else {
        // detectorElem.className = "confident";
        // pitchElem.innerText = Math.floor( currentPitch ) ; //hertz#
        var note =  noteFromPitch( currentPitch );
        currentPitchSpace.push(noteStrings[note%12]);
        frequencyPitchSpace[noteStrings[note%12]] += 1;
        frequencyPitchSpace[currentPitchSpace[0]] -= 1;
        currentPitchSpace = currentPitchSpace.slice(1);
        // console.log(currentPitchSpace);
        document.getElementById('A').innerHTML = getMostFrequentPitch();
        var detune = centsOffFromPitch( currentPitch, note );
    }
    
    /**************************************************************/
    window.requestAnimationFrame( renderPitch );
};
