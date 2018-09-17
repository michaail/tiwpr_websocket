/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const smoothCanvas = document.getElementById('smoothCanvas');
const smoothCtx = smoothCanvas.getContext('2d');
const crunchyCanvas = document.getElementById('crunchyCanvas');
const crunchyCtx = crunchyCanvas.getContext('2d');
const stepScale = 0.5;

const scaleDown = function(image, targetScale) {
	let currentScale = 1;

	while ((currentScale * stepScale) > targetScale) {
		currentScale *= stepScale;
		image = stepDown(image);
	}

	return { image , remainingScale: targetScale / currentScale};
};

var stepDown = function(image) {
	const temp = {};
	temp.canvas = document.createElement('canvas');
	temp.ctx = temp.canvas.getContext('2d');

	// Size canvas and image to stepScale
	temp.canvas.width = (image.width * stepScale) + 1;
	temp.canvas.height = (image.height * stepScale) + 1;
	temp.ctx.scale(stepScale, stepScale);
	temp.ctx.drawImage(image, 0, 0);

	// 0.5 size'd canvas!
	return temp.canvas;
};

const applyScale = function(scale) {
	if (typeof scale !== 'number') {
		scale = scale.currentTarget.value;
	}

	// Match the canvas size (with some padding)
	smoothCanvas.width = (crunchyCanvas.width = Math.floor(testImage.width * scale) + 4);
	smoothCanvas.height = (crunchyCanvas.height = Math.floor(testImage.height * scale) + 4);

	// Draw smooth scaled version to canvas
	const scaledData = scaleDown(testImage, scale);
	smoothCtx.scale(scaledData.remainingScale, scaledData.remainingScale);
	smoothCtx.drawImage(scaledData.image, 2, 2);

	// Draw original scaled version
	crunchyCtx.scale(scale, scale);
	return crunchyCtx.drawImage(testImage, 2, 2);
};

const demoSetup = function() {
	const input = document.getElementById('input');
	input.addEventListener('change', applyScale);
	return applyScale(Number(input.value));
};

// Create Image and wait for it to load before working with it
var testImage = document.getElementById('test-image');
const testSrc = testImage.getAttribute('src');
testImage.onload = demoSetup;
testImage.src = testSrc;
