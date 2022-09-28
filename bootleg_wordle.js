"use strict";
function linebreak() {
    return document.createElement('br');
}
function displayText(text) {
    const textToDisplay = document.createElement('p');
    textToDisplay.textContent = text;
    return textToDisplay;
}
function showLetterhints(letter, type) {
    const newSpan = document.createElement('span');
    newSpan.classList.add(type);
    newSpan.textContent = letter;
    return newSpan;
}
const apiEndpoint = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
const appdiv = document.getElementById('appdiv');
function startscreen() {
    if (appdiv !== null) {
        let elements = [];
        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.value = apiEndpoint;
        elements.push(textInput);
        const startbutton = document.createElement('input');
        startbutton.setAttribute('type', 'button');
        startbutton.value = "Click to get a random word!";
        elements.push(startbutton);
        appdiv.replaceChildren(...elements);
        // Clicking the start button
        startbutton.addEventListener('click', () => {
            if (textInput.value === '')
                alert("No URL specified!");
            else {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', apiEndpoint, true);
                xhr.onload = function () {
                    // Fetch a random word
                    const wordList = (xhr.responseText).split('\n');
                    const randomIndex = Math.floor(Math.random() * wordList.length);
                    var wordle = wordList[randomIndex];
                    console.log(wordle);
                    gamestart(wordle);
                };
                xhr.send();
            }
        });
    }
}
function gamestart(wordle) {
    if (appdiv === null)
        return;
    let elements = [];
    const textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    elements.push(textInput);
    elements.push(linebreak());
    elements.push(displayText("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z"));
    appdiv.replaceChildren(...elements);
    // Processing input
    let num_guesses = 0;
    var gameHandler = function (key) {
        if (key.code === 'Enter') {
            if (textInput.value.length !== 5)
                alert("Please enter a five-letter word!");
            else {
                num_guesses++;
                let guess = textInput.value.toLowerCase();
                textInput.value = '';
                checkanswer(guess, wordle);
                // Correct answer
                if (guess === wordle) {
                    alert(`${wordle.toUpperCase()} is the correct word!`);
                    textInput.removeEventListener('keydown', gameHandler);
                }
                // Game over (exceeded six valid guesses)
                if (num_guesses === 6 && guess !== wordle) {
                    alert(`Game over! The word was ${wordle.toUpperCase()}!`);
                    textInput.removeEventListener('keydown', gameHandler);
                }
            }
        }
    };
    textInput.addEventListener('keydown', gameHandler);
}
function checkanswer(guess, wordle) {
    if (appdiv === null)
        return;
    let hints = Array(5).fill('incorrect');
    let correctPositions = [];
    for (let i = 0; i < 5; i++) {
        if (guess[i] === wordle[i]) {
            hints[i] = 'correct';
            correctPositions.push(i);
        }
    }
    let wordleArray = Array.from(wordle);
    correctPositions.forEach(index => wordleArray[index] = ''); // remove already correct answers
    for (let i = 0; i < 5; i++) {
        if (wordleArray.includes(guess[i]) && guess[i] !== wordle[i]) {
            hints[i] = 'misplaced';
            wordleArray[wordleArray.indexOf(guess[i])] = ''; // handling duplicates
        }
    }
    // Displaying text
    for (let j = 0; j < hints.length; j++) {
        let coloredLetter = showLetterhints(guess[j], hints[j]);
        appdiv.appendChild(coloredLetter);
    }
    appdiv.appendChild(linebreak());
}
startscreen();
