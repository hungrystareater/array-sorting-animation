import { sleep } from "./sleep.js";

let arrWidth, //array width
arrHeight, //array height
scale, //canvas scale
speed, //milliseconds between frames
skipRate, //how many frames are skipped between each displayed frame
arrayGlobal, //array to sort
fgColor, //canvas foreground color
bgColor, //canvas background color
canvas, //canvas
ctx; //canvas context

$(document).ready(function () {
    arrWidth = 60;
    arrHeight = 15;
    scale = 10;
    speed = 10;
    skipRate = 0;
    arrayGlobal = [];
    fgColor = "#ddd";
    bgColor = "transparent";
	
    canvas = $('#canvas-box')[0];
    ctx = canvas.getContext("2d");
    ctx.canvas.width = arrWidth * scale;
    ctx.canvas.height = arrHeight * scale;

    arrayGlobal = generateArray(arrWidth, arrHeight);
    displayArrayCanvas(arrayGlobal, arrWidth, arrHeight, scale);

    $('#control-button').click(launchSortingAnimation);
    $('#height-range').on('input', updateRangeLabel);
    $('#width-range').on('input', updateRangeLabel);
    $('#scale-range').on('input', updateRangeLabel);
    $('#speed-range').on('input', updateRangeLabel);
    $('#skip-range').on('input', updateRangeLabel);
});
function generateArray(width, height) {
    let arr = [];
    for (let i = 0; i < width; i++) {
        arr.push(Math.floor(Math.random() * height));
    }
    return arr;
}
function displayArrayCanvas(values, width, height, scl) {
    ctx.lineWidth = scl - 2;
    ctx.strokeStyle = fgColor;
    for (let i = 0; i < width; i++) {
        ctx.beginPath();
        ctx.moveTo(i * scl + scl / 2, height * scl);
        ctx.lineTo(i * scl + scl / 2, values[i] * scl);
        ctx.stroke();
    }
}
function disableControls() {
    $('#height-range')[0].disabled = true;
    $('#width-range')[0].disabled = true;
    $('#scale-range')[0].disabled = true;
    $('#speed-range')[0].disabled = true;
    $('#skip-range')[0].disabled = true;
    $('#control-button')[0].disabled = true;
}
function enableControls() {
    $('#height-range')[0].disabled = false;
    $('#width-range')[0].disabled = false;
    $('#scale-range')[0].disabled = false;
    $('#speed-range')[0].disabled = false;
    $('#skip-range')[0].disabled = false;
    $('#control-button')[0].disabled = false;
}
function updateRangeLabel() {
    switch (this.id) {
    case "height-range":
        $('#height-range-label')[0].innerHTML = "Height: " + this.value;
        arrHeight = $('#height-range')[0].value;
        applySizeCanvas();
        break;
    case "width-range":
        $('#width-range-label')[0].innerHTML = "Width: " + this.value;
        arrWidth = $('#width-range')[0].value;
        applySizeCanvas();
        break;
    case "scale-range":
        $('#scale-range-label')[0].innerHTML = "Scale: " + this.value;
        scale = $('#scale-range')[0].value;
        applySizeCanvas();
        break;
    case "speed-range":
        $('#speed-range-label')[0].innerHTML = "Frame delay (ms): " + this.value;
        speed = $('#speed-range')[0].value;
        break;
    case "skip-range":
        $('#skip-range-label')[0].innerHTML = "Skip frames: " + this.value;
        skipRate = $('#skip-range')[0].value;
        break;
    default:
        alert("No handler function for this range.");
    }
}
function applySizeCanvas() {
    ctx.canvas.width = arrWidth * scale;
    ctx.canvas.height = arrHeight * scale;
    arrayGlobal = generateArray(arrWidth, arrHeight);
    displayArrayCanvas(arrayGlobal, arrWidth, arrHeight, scale);
}
function launchSortingAnimation() {
    switch ($('#algo-select')[0].value) {
    case "Bubble":
        arrayGlobal = generateArray(arrWidth, arrHeight);
        bubbleSort(arrayGlobal);
        break;
    case "Selection":
        arrayGlobal = generateArray(arrWidth, arrHeight);
        selectionSort(arrayGlobal);
        break;
    case "Insertion":
        arrayGlobal = generateArray(arrWidth, arrHeight);
        insertionSort(arrayGlobal);
        break;
    case "Shell":
        arrayGlobal = generateArray(arrWidth, arrHeight);
        shellSort(arrayGlobal);
        break;
    default:
        alert("No handler function for this algorythm.");
    }
}
async function bubbleSort(arr) {
    let swapped = true;
    let frameCnt = 0;
    disableControls();
    do {
        swapped = false;
        for (let j = 0; j < arr.length; j++) {
            frameCnt++;
            if (arr[j] < arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
                if (skipRate == 0 || frameCnt % skipRate == 0) {
                    await sleep(speed);
                    ctx.clearRect(0, 0, arrWidth * scale, arrHeight * scale);
                    displayArrayCanvas(arr, arrWidth, arrHeight, scale);
                }
            }
        }
    } while (swapped);
    displayArrayCanvas(arr, arrWidth, arrHeight, scale);
    enableControls();
    return arr;
}
async function selectionSort(inputArr) {
    let n = inputArr.length,
    frameCnt;
    disableControls();
    for (let i = 0; i < n; i++) {
        let min = i;
        for (let j = i + 1; j < n; j++) {
            if (inputArr[j] < inputArr[min]) {
                min = j;
            }
        }
        if (min != i) {
            frameCnt++;
            let tmp = inputArr[i];
            inputArr[i] = inputArr[min];
            inputArr[min] = tmp;
            if (skipRate == 0 || frameCnt % skipRate == 0) {
                await sleep(speed);
                ctx.clearRect(0, 0, arrWidth * scale, arrHeight * scale);
                displayArrayCanvas(inputArr, arrWidth, arrHeight, scale);
            }
        }
    }
    displayArrayCanvas(inputArr, arrWidth, arrHeight, scale);
    enableControls();
    return inputArr;
}
async function insertionSort(inputArr) {
    let n = inputArr.length,
    frameCnt;
    disableControls();
    for (let i = 1; i < n; i++) {
        let current = inputArr[i];
        let j = i - 1;
        while ((j > -1) && (current < inputArr[j])) {
            inputArr[j + 1] = inputArr[j];
            j--;
            frameCnt++;
            if (skipRate == 0 || frameCnt % skipRate == 0) {
                await sleep(speed);
                ctx.clearRect(0, 0, arrWidth * scale, arrHeight * scale);
                displayArrayCanvas(inputArr, arrWidth, arrHeight, scale);
            }
        }
        inputArr[j + 1] = current;
    }
    displayArrayCanvas(inputArr, arrWidth, arrHeight, scale);
    enableControls();
    return inputArr;
}
async function shellSort(arr) {
    let n = arr.length,

    frameCnt;
    disableControls();
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i += 1) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
                if (skipRate == 0 || frameCnt % skipRate == 0) {
                    await sleep(speed);
                    ctx.clearRect(0, 0, arrWidth * scale, arrHeight * scale);
                    displayArrayCanvas(arr, arrWidth, arrHeight, scale);
                }
            }
            arr[j] = temp;
        }
    }
    enableControls();
    displayArrayCanvas(arr, arrWidth, arrHeight, scale);
    return arr;
}