"use strict";
function linebreak() {
    return document.createElement('br');
}
const apiEndpoint = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
function startscreen() {
    const inputdiv = document.getElementById('URL Input');
    if (inputdiv !== null) {
        let elements = [];
        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.value = apiEndpoint;
        elements.push(textInput);
        const startbutton = document.createElement('input');
        startbutton.setAttribute('type', 'button');
        startbutton.value = "Get a random word!";
        elements.push(startbutton);
        inputdiv.replaceChildren(...elements);
        // Clicking the start button
        startbutton.addEventListener('click', () => {
            if (textInput.value === '')
                alert("No URL specified!");
            else {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', apiEndpoint, true);
                xhr.onload = function () {
                    // Fetch a random word
                    const wordlist = (xhr.responseText).split('\n');
                    const randomIndex = Math.floor(Math.random() * wordlist.length);
                    var wordle = wordlist[randomIndex];
                    console.log(wordle);
                    gamestart(wordle);
                };
                xhr.send();
            }
        });
    }
}
function gamestart(wordle) {
    alert(wordle);
}
alert("Welcome to bootleg Wordle!"); // debugging
startscreen();
// if (textinput.value === '') {
//     alert("No URL specified.");
// }
// elements.push(linebreak());
