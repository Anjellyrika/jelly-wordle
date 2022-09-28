function linebreak() {
    return document.createElement('br');
}

function displayText(text: string) {
    const textToDisplay = document.createElement('p');
    textToDisplay.textContent = text;
    return textToDisplay;
}

function showLetterhints(letter: string, type: string) {
    const newSpan = document.createElement('span');
    newSpan.classList.add(type);
    newSpan.textContent = letter;
    return newSpan;
}

const apiEndpoint : string = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";
const appdiv = document.getElementById('appdiv');

function startscreen() {
    
    if (appdiv !== null) {

        let elements : HTMLElement[] = [];

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.value = apiEndpoint;
        elements.push(textInput);

        const startbutton = document.createElement('input');
        startbutton.setAttribute('type', 'button');
        startbutton.value = "Get a random word!";
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
                    
                    var wordle : string = wordList[randomIndex]
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

    const textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    elements.push(textInput);

    elements.push(linebreak());

    elements.push(displayText("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z"));

    appdiv.replaceChildren(...elements);

    // Processing input
    let num_guesses : number = 0;
    var gameHandler = function(key : KeyboardEvent) {
        if (key.code === 'Enter') {
            if (textInput.value.length !== 5)
                alert("Please enter a five-letter word!");

            else {
                num_guesses++;
                let guess : string = textInput.value.toLowerCase();
                textInput.value = '';

                checkanswer(guess, wordle);

                // Correct answer
                if (guess === wordle) {
                    alert(`${wordle.toUpperCase()} is the correct word!`);
                    textInput.removeEventListener('keydown', gameHandler);
                }

                // Game over (exceeded six valid guesses)
                console.log(num_guesses);
                if (num_guesses === 6 && guess !== wordle) {
                    alert(`Game over! The word was ${wordle.toUpperCase()}!`);
                    textInput.removeEventListener('keydown', gameHandler);
                }
            }
        }
    }
    textInput.addEventListener('keydown', gameHandler);
}

function checkanswer(guess : string, wordle: string) {
    if (appdiv === null) return;

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
    for (let j = 0; j < hints.length; j++) {
        let coloredLetter = showLetterhints(guess[j], hints[j]);
        appdiv.appendChild(coloredLetter);
    }
    appdiv.appendChild(linebreak())
}

alert("Welcome to Jelly's bootleg Wordle!"); /// debugging
startscreen();