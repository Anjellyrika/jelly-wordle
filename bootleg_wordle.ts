function displayText(text: string) {
    const textToDisplay = document.createElement('p');
    textToDisplay.textContent = text;
    return textToDisplay;
}

function showLetterhints(letter: string, type: string) {
    const newSpan = document.createElement('span');
    newSpan.classList.add(type);
    newSpan.textContent = letter.toUpperCase();
    return newSpan;
}

const apiEndpoint : string = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
const appdiv = document.getElementById('appdiv');

function startscreen() {
    
    if (appdiv !== null) {

        let elements : HTMLElement[] = [];

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.className = 'textinput'
        textInput.value = apiEndpoint;
        elements.push(textInput);

        const startbutton = document.createElement('input');
        startbutton.setAttribute('type', 'button');
        startbutton.className = 'startbutton';
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
                    const wordList : string[] = (xhr.responseText).split('\n');
                    const randomIndex : number = Math.floor(Math.random() * wordList.length);
                    
                    var wordle : string = wordList[randomIndex];
                    console.log(wordle);
                    gamestart(wordle);
                };
                xhr.send();
            }
        });
    }
}

function gamestart(wordle : string){
    if (appdiv === null) return;
    let elements : HTMLElement[] = [];
    appdiv.replaceChildren(...elements);

    const body = document.getElementById('body');
    if (body === null) return;

    // Generate empty game board
    const board = document.getElementById('board');
    if (board === null) return;
    for (let i = 0; i <= 5; i++){
        const row = document.createElement('div');
            row.className = 'letterBoxRow';
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'letterBox';
            box.textContent = ' ';
            row.appendChild(box);
        }
        board.appendChild(row);
    }

    // Generate key buttons
    const buttonsdiv = document.getElementById('keyboard-buttons');
    if (buttonsdiv === null) return;

    const alphabet : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (const letter of alphabet) {
        const letterbutton = document.createElement('input');
        letterbutton.setAttribute('type', 'button');
        letterbutton.className = 'clickableLetter';
        letterbutton.value = letter;
        buttonsdiv.appendChild(letterbutton);

        // Make clickable
        letterbutton.addEventListener('mouseup', () => {
            let key : string = letterbutton.value;
            body.dispatchEvent(new KeyboardEvent('keydown',{'key' : key}));
        });
    }

    // Processing input    
    let num_guesses : number = 0;
    let nextBoxIndex : number = 0;
    var gameHandler = function(key : KeyboardEvent) {

        let rowToFill = document.getElementsByClassName('letterBoxRow')[num_guesses];

        // Insert letter
        if (nextBoxIndex !== 5 && key.key.length == 1) {
            let boxToFill = rowToFill.children[nextBoxIndex];
            boxToFill.textContent = (key.key).toUpperCase();
            nextBoxIndex++;
        }
    
        // Delete letter
        if (nextBoxIndex !== 0 && key.key === 'Backspace') {
            let boxToFill = document.getElementsByClassName('letterBox')[nextBoxIndex-1];
            boxToFill.textContent = ' ';
            nextBoxIndex--;
        }
    
        // Check input
        let guess : string = '';
        if (key.key === 'Enter') {
            if (nextBoxIndex !== 5) {
                return;
            }
    
            else {
                num_guesses++;
                nextBoxIndex = 0;

                for (let i = 0; i < 5; i++) {
                    guess = guess.concat((rowToFill.children[i]).innerHTML).toLowerCase();
                }

                checkanswer(guess, wordle, num_guesses-1);
    
                // Correct answer
                if (guess === wordle) {
                    alert(`${wordle.toUpperCase()} is the correct word!`);
                    body.removeEventListener('keydown', gameHandler);
                }
    
                // Game over (exceeded six valid guesses)
                if (num_guesses === 6 && guess !== wordle) {
                    alert(`Game over! The word was ${wordle.toUpperCase()}!`);
                    body.removeEventListener('keydown', gameHandler);
                }
            }
        }
    }
    body.addEventListener('keydown', gameHandler);
}

function checkanswer(guess : string, wordle: string, guessNo: number) {
    const board = document.getElementById('board');
    if (board === null) return;

    const buttonsdiv = document.getElementById('keyboard-buttons');
    if (buttonsdiv === null) return;

    let hints : string[] = Array(5).fill('incorrect');
    let correctPositions : number[] = [];

    for(let i = 0; i < 5; i++) {
        if (guess[i] === wordle[i]) {
            hints[i] = 'correct';
            correctPositions.push(i);
        }
    }

    let wordleArray : string[] = Array.from(wordle);
    correctPositions.forEach(index => wordleArray[index] = ''); // remove already correct answers

    for(let i = 0; i < 5; i++) {
        if (wordleArray.includes(guess[i]) && guess[i] !== wordle[i]) {
            hints[i] = 'misplaced';
            wordleArray[wordleArray.indexOf(guess[i])] = ''; // handling duplicates
        }
    }

    // Displaying text
    let currentRow = board.children[guessNo];
    for (let j = 0; j < wordle.length; j++) {
        let coloredBox : HTMLSpanElement = showLetterhints(guess[j], hints[j]);
        let boxToColor = (currentRow.children[j]);
        currentRow.replaceChild(coloredBox, boxToColor);
    }
}

startscreen();