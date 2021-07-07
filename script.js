// Author: Jordan Muturi

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let upButton;
let downButton;
let leftButton;
let rightButton;
let centerButton;
let buttonDiv2;
let saveButton;

// Global ML Variables
let featureExtractor;
let imgFeatures;
let knnClassifier;
let video;
let isModelReady;
let ups;
let downs;
let lefts;
let rights;
let centers;
let ballX;
let ballY;
let ballSpeed;

function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  textP2 = createP("[Training data here.]");
  textP2.parent(textDiv);
  buildButtons();
  ups = 0;
  downs = 0;
  lefts = 0;
  rights = 0;
  centers = 0;
  // new code below
  ballX = width / 2;
  ballY = height / 2;
  ballSpeed = 10;
  video = createCapture(VIDEO, videoReady);
  video.parent(canvasDiv);
}

function draw() {
  if(isModelReady) {
    imgFeatures = featureExtractor.infer(canvas);
    if(knnClassifier.getNumLabels() > 0) {
      knnClassifier.classify(imgFeatures, gotResults);
      // new code below
      background(255);
      drawBall();
    }
  }
}

function drawBall() {
  fill(50, 255, 255);
  ellipse(ballX, ballY, 40);
  let labelString = textP.html().toLowerCase();
  if(labelString.include("up")) {
    ballY -= ballSpeed;
  } else if(labelString.include("down")) {
    ballY += ballSpeed;
  } else if(labelString.include("left")) {
    ballY -= ballSpeed;
  } else if(labelString.include("right")) {
    ballY += ballSpeed;
  }
  ballX = constrain(ballX, width - 16);
  ballY = constrain(ballY, height - 16);

}

function buildButtons() {
  buttonDiv = createDiv();
  upButton = createButton("Up");
  upButton.parent(buttonDiv);
  upButton.mousePressed(function () {
    ups++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Up");
  });
  downButton = createButton("Down");
  downButton.parent(buttonDiv);
  downButton.mousePressed(function () {
    downs++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Down");
  });
  leftButton = createButton("Left");
  leftButton.parent(buttonDiv);
  leftButton.mousePressed(function () {
    lefts++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Left");
  });
  rightButton = createButton("Right");
  rightButton.parent(buttonDiv);
  rightButton.mousePressed(function () {
    rights++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Right");
  });
  centerButton = createButton("Center");
  centerButton.parent(buttonDiv);
  centerButton.mousePressed(function () {
    centers++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Center");
  });
  buttonDiv2 = createDiv();
  saveButton = createButton("Save Model");
  saveButton.parent(buttonDiv2);
  saveButton.mousePressed(function () {
    knnClassifier.save();
  });
  buttonDiv.style("display", "none");
  buttonDiv2.style("display", "none");
}

function videoReady() {
  //video.style("display", "none");
  // new code below
  video.style("transform", "scale(-1, 1)" );
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

function featureExtractorLoaded() {
  knnClassifier = ml5.KNNClassifier();
  knnClassifier.load("model/myKNN.json", function() {
    isModelReady = true;
    textP.html("Begin adding examples!");
    buttonDiv.style("display", "block");
    buttonDiv2.style("display", "block");
  });
}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let labelString = getLabel(results);
    textP.html("Label: " + labelString);
  }
}

// Don't touch this, it "fixes" a bug in ml5.js
function getLabel(results) {
  const entries = Object.entries(results.confidencesByLabel);
  let greatestConfidence = entries[0];
  for(let i = 0; i < entries.length; i++) {
    if(entries[i][1] > greatestConfidence[1]) {
      greatestConfidence = entries[i];
    }
  }
  return greatestConfidence[0];
}
