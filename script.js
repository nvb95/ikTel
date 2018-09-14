var stopped = false;
var paused = false;
var paceChangeDown = false;
var extraOptionsHidden = true;
var countdownFilenames = [3, 2, 1, "start"];

var random = Math.random()*360;
var lightColor = "hsl(" + random + " , 100%, 95%)";
var darkColor = "hsl("+ random + ", 50%, 85%)";
var darkerColor = "hsl(" + random + ", 50%, 50%)"

document.body.style.background = lightColor;
document.getElementById("header").style.background = darkColor;
var outputElements = document.getElementsByClassName("output");
for (i = 0; i < outputElements.length; i++) {
    outputElements[i].style.color = darkerColor;
}
document.getElementById("printDiv").style.color = darkerColor;

// function show(divElement) {
//   var divElements = getDivElements();
//   for (i = 0; i < divElements.length; i++) {
//     divElements[i].classList.remove("show");
//   }
//   divElement.classList.add("show");
// }

function changeRangeSliderStep(rangeSlider) {
  var rangeSliderValue = rangeSlider.value;
  var newStep;
  if (rangeSliderValue > 10) {
    newStep = 1;
  }
  else if (rangeSliderValue > 5) {
    newStep = 0.5;
  }
  else if (rangeSliderValue > 2) {
    newStep = 0.25;
  }
  else {
    newStep = 0.1;
  }
  rangeSlider.step = newStep;
}

// function addDivShowOnclick() {
//   var divElements = getDivElements();
//   for (i = 0; i < divElements.length; i++) {
//     if (divElements[i].id != "main") {
//       divElements[i].onclick = function() {show(this);};
//     }
//   }
// }

function initializeElements() {
  telOrTelt();
  slideTellenRangeSlider();
  slideTussentellenRangeSlider();
  slideRepetitionsRangeSlider();
  slideOperandRangeSlider();
  slidePauseDurationRangeSlider();
  //addDivShowOnclick();
}

function telOrTelt() {
  if (getVoiceDropDown().value === "Siri") {
    getTelOrTeltText().value = "Tel";
  }
  else {
    getTelOrTeltText().value = "Telt";
  }
}

function toggleOptions() {
  var optionsButton = getOptionsButton();
  var optionsButtonText = optionsButton.innerText;
  var extraOptionsElements = getExtraOptionsElements();
  if (optionsButtonText == "Meer opties (+)") {
     optionsButton.innerText = "Minder opties (-)";
     for (i = 0; i < extraOptionsElements.length; i++) {
         extraOptionsElements[i].classList.remove("hidden");
      }
      getLeftChangePaceButton().classList.remove("nextButtonsLeft");
      getRightChangePaceButton().classList.remove("nextButtons");
      getLeftChangePaceButton().classList.add("smallNextButtonsLeft");
      getRightChangePaceButton().classList.add("smallNextButtons");
  }
  else {
    optionsButton.innerText = "Meer opties (+)";
    for (i = 0; i < extraOptionsElements.length; i++) {
        extraOptionsElements[i].classList.add("hidden");
    }
    getLeftChangePaceButton().classList.remove("smallNextButtonsLeft");
    getRightChangePaceButton().classList.remove("smallNextButtons");
    getLeftChangePaceButton().classList.add("nextButtonsLeft");
    getRightChangePaceButton().classList.add("nextButtons");
  }
}

function slide(rangeSlider, text, incrementButton, decrementButton) {
  var rangeSliderValue = rangeSlider.value;
  if (rangeSliderValue >= Number(rangeSlider.max)) {
    incrementButton.disabled = true;
    decrementButton.disabled = false;
  }
  else if (rangeSliderValue <= Number(rangeSlider.min)) {
    incrementButton.disabled = false;
    decrementButton.disabled = true;
  }
  else {
    incrementButton.disabled = false;
    decrementButton.disabled = false;
  }
  text.value = rangeSliderValue;
}

function increment(rangeSlider, text, incrementButton, decrementButton) {
  if (!incrementButton.disabled) {
    rangeSlider.stepUp(1);
    incrementButton.disabled = true;
    setTimeout(function() {slide(rangeSlider, text, incrementButton, decrementButton);}, 100);
  }
}

function decrement(rangeSlider, text, incrementButton, decrementButton) {
  if (!decrementButton.disabled) {
    rangeSlider.stepDown(1);
    decrementButton.disabled = true;
    setTimeout(function() {slide(rangeSlider, text, incrementButton, decrementButton);}, 100);
  }
}

function start() {
  if (pauseClicked()) {
    setPause(false);
  }
  else {
    // var validInput = true;
    // var tellen = Number(getTellenTextField().value);
    // if (!isValidTellen(tellen)) {
    //   alert("Het aantal tellen moet een natuurlijk getal zijn tussen 1 en 99.");
    //   validInput = false;
    // }
    // var tussentellen = Number(getTussentellenTextField().value);
    // if (!isValidTussentellen(tussentellen)) {
    //   alert("Het aantal tussentellen moet een natuurlijk getal zijn kleiner dan 100.");
    //   validInput = false;
    // }
    // var repetitions = Number(getRepetitionsTextField().value);
    // if (!isValidRepetitions(repetitions)) {
    //   alert("Het aantal herhalingen moet een natuurlijk getal zijn.");
    //   validInput = false;
    // }
    // var operand = Number(getOperandTextField().value);
    // if (!isValidOperand(operand) && operand != "") {
    //   alert("De operand moet een getal zijn.");
    //   validInput = false;
    // }
    // if (validInput) {
    initialize();
    var audio = new Audio();
    audio.src = "audio/dummy.mp3";
    audio.play();
    if (getCountdownCheckbox().checked) {
      getCountdownCheckbox().checked = false;
      handleNextNumber(true, 0, 0, [], 0, 0, 1, audio);
    }
    else {
      handleNextNumber(false, 0, 0, [], 0, 0, 1, audio);
    }
  }
  enableChangePaceButton();
}
//}

function initialize() {
  getStartButton().disabled = true;
  getPauseButton().disabled = false;
  getStopButton().disabled = false;
}

function handleNextNumber(inCountdown, currentTel, currentTussentel, dutch, nbOfParts, nbOfPartsDone, currentRepetition, audio) {
  if (pauseClicked()) {
    pauseInterval(function() {handleNextNumber(inCountdown, currentTel, currentTussentel, dutch, nbOfParts, nbOfPartsDone, currentRepetition, audio);});
  }
  else if (stopClicked()) {
    noMoreNumbers();
  }
  else if (inCountdown) {
    countdown(currentTel, currentTussentel, nbOfPartsDone, currentRepetition, audio)
  }
  else if (nbOfPartsDone < nbOfParts) {
    playNumber(false, currentTel, currentTussentel, dutch, nbOfParts, nbOfPartsDone, currentRepetition, audio);
  }
  else {
    timeout(function() {handleNextFullNumber(currentTel, currentTussentel, currentRepetition, audio);});
  }
}

function countdown(currentTel, currentTussentel, nbOfPartsDone, currentRepetition, audio) {
  var countdownFilenames = getCountdownFilenames();
  if (nbOfPartsDone < getCountdownFilenames().length) {
    timeoutCountdown(1000, function() {playNumber(true, currentTel, currentTussentel, countdownFilenames, 0, nbOfPartsDone, currentRepetition, audio);});
  }
  else {
    handleNextNumber(false, currentTel, currentTussentel, [], 0, 0, currentRepetition, audio);
  }
}

function playNumber(inCountdown, currentTel, currentTussentel, dutch, nbOfParts, nbOfPartsDone, currentRepetition, audio) {
  playAudio(dutch[nbOfPartsDone], audio);
  var newNbOfPartsDone = nbOfPartsDone + 1;
  audio.onended = function() {handleNextNumber(inCountdown, currentTel, currentTussentel, dutch, nbOfParts, newNbOfPartsDone, currentRepetition, audio);};
}

function handleNextFullNumber(currentTel, currentTussentel, currentRepetition, audio) {
  var newTellen = getTellen();
  var newTussentellen = getTussentellen();
  if (currentTel < newTellen) {
    if (currentTussentel < newTussentellen) {
      tussentel(currentTel, currentTussentel, currentRepetition, audio);
    }
    else {
      count(currentTel, currentRepetition, audio);
    }
  }
  else {
    var newNbOfRepetitions = getRepetitions();
    if (currentRepetition <= newNbOfRepetitions) {
      repeat(currentRepetition, audio)
    }
    else {
      var operator = getOperatorDropDown().value;
      if (operator != "null") {
        serie(operator, newTellen, audio);
      }
      else {
        noMoreNumbers();
      }
    }
  }
}

function tussentel(currentTel, currentTussentel, currentRepetition, audio) {
  var newCurrentTussentel = currentTussentel + 1;
  print("-" + newCurrentTussentel + "-");
  var dutch = parseToDutch(newCurrentTussentel);
  var newNbOfParts = dutch.length;
  handleNextNumber(false, currentTel, newCurrentTussentel, dutch, newNbOfParts, 0, currentRepetition, audio);
}

function count(currentTel, currentRepetition, audio) {
  var newCurrentTel = currentTel + 1;
  print(newCurrentTel);
  var dutch = parseToDutch(newCurrentTel);
  var newNbOfParts = dutch.length;
  handleNextNumber(false, newCurrentTel, 0, dutch, newNbOfParts, 0, currentRepetition, audio);
}

function repeat(currentRepetition, audio) {
  print ("\u27F3" + currentRepetition);
  var newCurrentRepetition = currentRepetition + 1;
  if (getCountdownCheckbox().checked) {
    handleNextNumber(true, 0, 0, [], 0, 0, newCurrentRepetition, audio);
  }
  else {
    handleNextNumber(false, 0, 0, [], 0, 0, newCurrentRepetition, audio);
  }
}

function serie(operator, tellen, audio) {
  var newTellen = parseOperator(operator, tellen, getOperand());
  if (isValidTellen(newTellen)) {
    getTellenRangeSlider().value = newTellen;
    slideTellenRangeSlider();
    if (getCountdownCheckbox().checked) {
      handleNextNumber(true, 0, 0, [], 0, 0, 1, audio);
    }
    else {
      handleNextNumber(false, 0, 0, [], 0, 0, 1, audio);
    }
  }
  else {
    noMoreNumbers();
    alert("Reeks heeft mijn limiet bereikt. Ik kan enkel tellen tussen 1 en 99.");
  }
}

function noMoreNumbers() {
  setStop(false);
  setPause(false);
  print("ikTel");
  getCountdownCheckbox().checked = true;
  getStartButton().disabled = false;
  getPauseButton().disabled = true;
  getStopButton().disabled = true;
  disableChangePaceButton();
}

function invertPace(pace) {
  return Number(getPaceRangeSlider().max) - pace;
}

// function slide2() {
//   var rangeSliderPace = Number(getPaceRangeSlider().value);
//   var pace = invertPace(rangeSliderPace);
//   setPace(pace);
// }

// function setPace(pace) {
//   var newPace;
//   if (pace <= 0) {
//     newPace = 0;
//     getFasterButton().disabled = true;
//     getSlowerButton().disabled = false;
//   }
//   else if (pace >= 60) {
//     newPace = 60;
//     getFasterButton().disabled = false;
//     getSlowerButton().disabled = true;
//   }
//   else {
//     newPace = pace;
//     getFasterButton().disabled = false;
//     getSlowerButton().disabled = false;
//   }
//   getPaceRangeSlider().value = invertPace(newPace);
// }

// function changePace() {
//   var input = getPaceTextField().value;
//   var pace = Number(input);
//   if (input != "" && isValidPace(pace)) {
//     setPace(pace);
//   }
//   else {
//     setPace(invertPace(getPaceRangeSlider().value));
//   }
// }

// function faster() {
//   var pace = Number(getPaceTextField().value);
//   var newPace = pace -= 0.25;
//   setPace(newPace);
// }
//
// function slower() {
//   var pace = Number(getPaceTextField().value);
//   var newPace = pace += 0.25;
//   setPace(newPace);
// }

function changePaceDown() {
  setPaceChangingDown(true);
  getChangePaceButton().classList.add("pressed");
}

function changePaceUp() {
  setPaceChangingDown(false);
  getChangePaceButton().classList.remove("pressed");
}

function setPaceChangingDown(boolean) {
  paceChangeDown = boolean;
}

function paceChangingDown(){
  return paceChangeDown;
}

function timeoutCountdown(timeoutTime, func) {
  var remainingTimeoutTime = timeoutTime;
  var interval = 100;
  var refresh = setInterval(function() {
                              if (pauseClicked()) {
                                 clearInterval(refresh);
                                 pauseInterval(function() {func();});
                              }
                              else if (stopClicked()) {
                                clearInterval(refresh);
                                noMoreNumbers();
                              }
                              else if (remainingTimeoutTime > interval) {
                                remainingTimeoutTime -= interval;
                              }
                              else {
                                clearInterval(refresh);
                                setTimeout(function() {func();}, remainingTimeoutTime);
                              }
                            }, interval);
}

function timeout(func) {
  var interval = 100;
  var currentTimeoutTime = 0;
  var paceChangeDown = false;
  var refresh = setInterval(function() {
                              if (pauseClicked()) {
                                clearInterval(refresh);
                                pauseInterval(function() {func();});
                              }
                              else if (stopClicked()) {
                                clearInterval(refresh);
                                noMoreNumbers();
                              }
                              else if (paceChangingDown()) {
                                  getPauseDurationRangeSlider().value = currentTimeoutTime/1000;
                                  slide(getPauseDurationRangeSlider(), getPauseDurationText(), getPauseDurationIncrementButton(), getPauseDurationDecrementButton());
                                  currentTimeoutTime += interval;
                                  if (!paceChangeDown) {
                                    paceChangeDown = true;
                                    getPauseDurationRangeSlider().step = interval/1000;
                                  }
                              }
                              else if (paceChangeDown) {
                                clearInterval(refresh);
                                changeRangeSliderStep(getPauseDurationRangeSlider());
                                func();
                              }
                              else {
                                var timeoutTime = getPauseDuration()*1000;
                                remainingTimeoutTime = timeoutTime - currentTimeoutTime;
                                if (remainingTimeoutTime > interval) {
                                  currentTimeoutTime += interval;
                                }
                                else {
                                  clearInterval(refresh);
                                  setTimeout(function() {func();}, remainingTimeoutTime);
                                }
                              }
                            }, interval);
}

function pauseInterval(func) {
  var interval = 100;
  getPauseButton().disabled = true;
  getStartButton().disabled = false;
  var pausing = setInterval(function() {
                              if (!pauseClicked()) {
                                clearInterval(pausing);
                                func();
                                getPauseButton().disabled = false;
                                getStartButton().disabled = true;
                              }
                              else if (stopClicked()) {
                                clearInterval(pausing);
                                noMoreNumbers();
                              };
                            }, interval);
}

function pauseClicked() {
  return paused;
}

function setPause(boolean) {
  paused = boolean;
}

function pause() {
  setPause(true);
  disableChangePaceButton();
}

function stopClicked() {
  return stopped;
}

function setStop(boolean) {
  stopped = boolean;
}

function stop() {
  setStop(true);
  disableChangePaceButton();
}

function parseOperator(operator, tellen, operand) {
  var result;
  if (operator == "addition") {
    result = tellen + operand;
  }
  else if (operator == "subtraction") {
    result = tellen - operand;
  }
  else if (operator == "multiplication") {
    result = tellen * operand;
  }
  else if (operator == "division") {
    result = tellen / operand;
  }
  else if (operator == "modulus") {
    result = tellen % operand;
  }
  return Math.floor(result);
}

function parseToDutch(number) {
  var dutch = [];
  if (number < 15) {
    dutch.push(number);
  }
  else if (number < 20) {
    var ones = number - 10;
    dutch.push(ones, 10)
  }
  else {
    var tens = Math.floor(number / 10);
    var reminder = number % 10;
    if (reminder != 0) {
      var tensFileName = "en" + tens * 10;
      dutch.push(reminder, tensFileName);
    }
    else {
      dutch.push(number);
    }
  }
  return dutch;
}

function playAudio(filename, audio) {
  audio.src = getPath(filename);
  audio.play();
}

function getPath(filename) {
  return "audio/" + getVoiceDropDown().value +"/" + filename + ".mp3";
}

function slideTellenRangeSlider() {
  slide(getTellenRangeSlider(), getTellenText(), getTellenIncrementButton(), getTellenDecrementButton());
}

function slideTussentellenRangeSlider() {
  slide(getTussentellenRangeSlider(), getTussentellenText(), getTussentellenIncrementButton(), getTussentellenDecrementButton());
}

function slideRepetitionsRangeSlider() {
  slide(getRepetitionsRangeSlider(), getRepetitionsText(), getRepetitionsIncrementButton(), getRepetitionsDecrementButton());
}

function slideOperandRangeSlider() {
  slide(getOperandRangeSlider(), getOperandText(), getOperandIncrementButton(), getOperandDecrementButton());
}

function slidePauseDurationRangeSlider() {
  slide(getPauseDurationRangeSlider(), getPauseDurationText(), getPauseDurationIncrementButton(), getPauseDurationDecrementButton());
  changeRangeSliderStep(getPauseDurationRangeSlider());
}

function incrementTellen() {
  var rangeSlider = getTellenRangeSlider();
  var incrementButton = getTellenIncrementButton();
    if (!incrementButton.disabled) {
      rangeSlider.stepUp(5);
      incrementButton.disabled = true;
      setTimeout(function() {slide(rangeSlider, getTellenText(), incrementButton,  getTellenDecrementButton());}, 100);
    }
  }

  // function decrement(rangeSlider, text, incrementButton, decrementButton) {
  //   if (!decrementButton.disabled) {
  //     rangeSlider.stepDown(1);
  //     decrementButton.disabled = true;
  //     setTimeout(function() {slide(rangeSlider, text, incrementButton, decrementButton);}, 100);
  //   }
  // }

function decrementTellen() {
  var rangeSlider = getTellenRangeSlider();
  var decrementButton = getTellenDecrementButton();
    if (!decrementButton.disabled) {
      rangeSlider.stepDown(5);
      decrementButton.disabled = true;
      setTimeout(function() {slide(rangeSlider, getTellenText(), getTellenIncrementButton(), decrementButton);}, 100);
    }}

function incrementTussentellen() {
  increment(getTussentellenRangeSlider(), getTussentellenText(), getTussentellenIncrementButton(), getTussentellenDecrementButton());
}

function decrementTussentellen() {
  decrement(getTussentellenRangeSlider(), getTussentellenText(), getTussentellenIncrementButton(), getTussentellenDecrementButton());
}

function incrementRepetitions() {
  increment(getRepetitionsRangeSlider(), getRepetitionsText(), getRepetitionsIncrementButton(), getRepetitionsDecrementButton());
}

function decrementRepetitions() {
  decrement(getRepetitionsRangeSlider(), getRepetitionsText(), getRepetitionsIncrementButton(), getRepetitionsDecrementButton());
}

function incrementOperand() {
  increment(getOperandRangeSlider(), getOperandText(), getOperandIncrementButton(), getOperandDecrementButton());
}

function decrementOperand() {
  decrement(getOperandRangeSlider(), getOperandText(), getOperandIncrementButton(), getOperandDecrementButton());
}

function incrementPauseDuration() {
  increment(getPauseDurationRangeSlider(), getPauseDurationText(), getPauseDurationIncrementButton(), getPauseDurationDecrementButton());
  changeRangeSliderStep(getPauseDurationRangeSlider());
}

function decrementPauseDuration() {
  decrement(getPauseDurationRangeSlider(), getPauseDurationText(), getPauseDurationIncrementButton(), getPauseDurationDecrementButton());
  changeRangeSliderStep(getPauseDurationRangeSlider());
}

function enableChangePaceButton() {
  getChangePaceButton().disabled = false;
  getChangePaceButton().classList.remove("pressed");
}

function disableChangePaceButton() {
  getChangePaceButton().disabled = true;
}

function getDivElements() {
  return document.getElementsByTagName("div");
}

function getExtraOptionsElements() {
  return document.getElementsByClassName("extraOptions");
}

function getVoiceDropDown() {
  return getElement("voiceDropDown");
}

function getTelOrTeltText() {
  return getElement("telOrTeltText");
}

function getOptionsButton() {
  return getElement("optionsButton");
}

function getTellen() {
  return Number(getTellenRangeSlider().value);
}

function getTussentellen() {
  return Number(getTussentellenRangeSlider().value);
}

function getRepetitions() {
  return Number(getRepetitionsRangeSlider().value);
}

function getOperand() {
  return Number(getOperandRangeSlider().value);
}

function getPauseDuration() {
  return Number(getPauseDurationRangeSlider().value);
}

function getTellenText() {
  return getElement("tellenText");
}

function getTellenRangeSlider() {
  return getElement("tellenRangeSlider");
}

function getTellenIncrementButton() {
  return getElement("tellenIncrement");
}

function getTellenDecrementButton() {
  return getElement("tellenDecrement");
}

function getTussentellenText() {
  return getElement("tussentellenText");
}

function getTussentellenRangeSlider() {
  return getElement("tussentellenRangeSlider");
}

function getTussentellenIncrementButton() {
  return getElement("tussentellenIncrement");
}

function getTussentellenDecrementButton() {
  return getElement("tussentellenDecrement");
}

function getRepetitionsText() {
  return getElement("repetitionsText");
}

function getRepetitionsRangeSlider() {
  return getElement("repetitionsRangeSlider");
}

function getRepetitionsIncrementButton() {
  return getElement("repetitionsIncrement");
}

function getRepetitionsDecrementButton() {
  return getElement("repetitionsDecrement");
}

function getOperandText() {
  return getElement("operandText");
}

function getOperandRangeSlider() {
  return getElement("operandRangeSlider");
}

function getOperandIncrementButton() {
  return getElement("operandIncrement");
}

function getOperandDecrementButton() {
  return getElement("operandDecrement");
}

function getPauseDurationText() {
  return getElement("pauseDurationText");
}

function getPauseDurationRangeSlider() {
  return getElement("pauseDurationRangeSlider");
}

function getPauseDurationIncrementButton() {
  return getElement("pauseDurationIncrement");
}

function getPauseDurationDecrementButton() {
  return getElement("pauseDurationDecrement");
}

function getCountdownCheckbox() {
  return getElement("countdown");
}

function getOperatorDropDown() {
  return getElement("operator");
}

function getPaceRangeSlider() {
  return getElement("tempo");
}


function getFasterButton() {
  return getElement("faster");
}

function getSlowerButton() {
  return getElement("slower");
}

function getStartButton() {
  return getElement("startButton");
}

function getPauseButton() {
  return getElement("pauseButton");
}

function getStopButton() {
  return getElement("stopButton");
}

function getChangePaceButton() {
  return getElement("changePaceButton");
}

function getLeftChangePaceButton() {
  return getElement("leftChangePaceButton");
}

function getRightChangePaceButton() {
  return getElement("rightChangePaceButton");
}

function getElement(elementId) {
  return document.getElementById(elementId);
}

function isValidTellen(input) {
  return isParsableToSpeech(input);
}

function isValidTussentellen(input) {
  return isParsableToSpeech(input) || input == 0;
}

function isParsableToSpeech(input) {
  return Number.isInteger(input) && input > 0 && input < 100;
}

function isValidRepetitions(input) {
  return isPositiveInteger(input);
}

function isValidOperand(input) {
  return !isNaN(input);
}

function isValidPace(input) {
  return !isNaN(input);
}

function isPositiveInteger(input) {
  return Number.isInteger(input) && input >= 0;
}

function print(string) {
  document.getElementById("print").value = string;
}

function getCountdownFilenames() {
  return countdownFilenames;
}

// function count(tellen, current, audio) {
//     var dutch = parseToDutch(current);
//     var nbOfParts = dutch.length;
//     setTimeout(function() {playNumber(dutch, nbOfParts, 0, audio, tellen, current);}, 0);
// }

// function playNumber(dutch, nbOfParts, nbOfPartsDone, audio, tellen, current) {
//   audio.src = getPath(dutch[nbOfPartsDone]);
//   audio.play();
//   audio.onended = function() {handleAudioEnd(dutch, nbOfParts, nbOfPartsDone, tellen, current, audio)};
// }
//
// function handleAudioEnd(dutch, nbOfParts, nbOfPartsDone, tellen, current, audio) {
//   var newNbOfPartsDone = nbOfPartsDone + 1;
//   if (newNbOfPartsDone < nbOfParts) {
//     playNumber(dutch, nbOfParts, newNbOfPartsDone, audio, tellen, current);
//   }
//   else if (current < tellen) {
//     count(tellen, current + 1, audio);
//   }
// }



//
// function playNext(tellen, audioFile, audioSprite, current, passes) {
//   if (current < tellen) {
//     var currentSprite = audioSprite[current];
//     audioFile.currentTime = currentSprite.start;
//     audioFile.play();
//     handleEnd(tellen, audioFile, audioSprite, currentSprite.end, current, passes)
//   }
// }
//
// function handleEnd(tellen, audioFile, audioSprite, currentEnd, current, passes) {
//   var handleEnd = setInterval(function() {
//     passes.push(audioFile.currentTime);
//     if (audioFile.currentTime >= currentEnd) {
//       clearInterval(handleEnd);
//       audioFile.pause();
//       current += 1;
//       //document.getElementById("demo").innerHTML = passes;
//       playNext(tellen, audioFile, audioSprite, current, passes)
//     }
//   }, 50)
// }
//
// function generateSprite() {
//   return {
//     1: {
//       start: 0,
//       end: 0.35
//     },
//     2: {
//       start: 0.60,
//       end: 0.81
//     },
//     3: {
//       start: 1,
//       end: 1.34
//     }
//   };
// }

// end = 0;
//
// sound = 1;
//
// audiosprite = {
//       1: [ 0, 0.30 ],
//       2: [ 0.60, 0.81 ],
//       3: [ 1, 1.34],
//     },

// var audiosprite = {
//     1: {
//         start: 0,
//         length: 0.38;
//     },
//     2: {
//         start: 0.38,
//         length: 0.4
//     },
//     3: {
//         start: 0.78,
//         length: 0.4
//     },
//     4: {
//         start: 1.72,
//         length: 0.25
//     }
//     5: {
//         start: 2,
//         length: 5
//     }
// };
//
// function check() {
//   setInterval(function(){ myTimer() }, 500);
// }
//
// function myTimer() {
//   if (audio.currentTime > end) {
//     audio.pause();
//     sound = sound + 1;
//     play(sound);
//   }
// }
//
// function play(sound) {
//   if ( audiosprite[sound] ) {
//     audio.currentTime = audiosprite[sound][0];
//     end = audiosprite[sound][1];
//     audio.play();
//     check();
//   }
// }
// var passes = [];
// audio.addEventListener('timeupdate', function(ev) {
//   passes.push(audio.currentTime);
//   if (audio.currentTime > end) {
//     audio.pause();
//     sound = sound + 1;
//     play(sound);
//     document.getElementById("demo").innerHTML = passes;
//   }
// },false);
