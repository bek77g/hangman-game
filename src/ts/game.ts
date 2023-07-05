import { WORDS } from './consts';
import { KEYBOARD_LETTERS } from './consts';

const gameDiv: HTMLDivElement = document.getElementById('game');
const logoH1: HTMLHeadingElement = document.getElementById('logo');

let triesLeft: number;
let winCount: number;

const createPlaceHoldersHTML = (): string => {
  const word: string = sessionStorage.getItem('word');
  const wordArray: array = word.split('');
  const placeholdersHTML: string = wordArray.reduce((acc, _, idx) => {
    return acc + `<h2 id="letter_${idx}" class="letter"> _ </h2>`;
  }, '');

  return `<div id="placeholders" class="placeholder-wrapper">${placeholdersHTML}</div>`;
};

const createKeyboard = (): HTMLDivElement => {
  const keyboard: HTMLDivElement = document.createElement('div');
  keyboard.classList.add('keyboard');
  keyboard.id = 'keyboard';

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr, idx) => {
    return (
      acc +
      `<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`
    );
  }, '');

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

const createHangManImg = (): HTMLImageElement => {
  const image: HTMLImageElement = document.createElement('img');
  image.src = 'images/hg-0.png';
  image.alt = 'hangman image';
  image.classList.add('hangman-img');
  image.id = 'hangman-img';

  return image;
};

const checkLetter = (letter): void => {
  const word: string = sessionStorage.getItem('word');
  const inputLetter: string = letter.toLowerCase();
  if (!word.includes(inputLetter)) {
    const triesCounter: HTMLSpanElement = document.getElementById('tries-left');
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;
    const hangmanImg: HTMLImageElement = document.getElementById('hangman-img');
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
    if (triesLeft === 0) stopGame('lose');
  } else {
    const wordArray: array = Array.from(word);
    wordArray.forEach((currentLetter: string, idx) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame('win');
          return;
        }
        document.getElementById(`letter_${idx}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status: string): void => {
  document.getElementById('placeholders').remove();
  document.getElementById('tries').remove();
  document.getElementById('keyboard').remove();

  const game: HTMLDivElement = document.getElementById('game');

  const word = sessionStorage.getItem('word');

  if (status === 'win') {
    document.getElementById('hangman-img').src = 'images/hg-win.png';
    game.innerHTML += "<h2 class='result-header win'>You win!</h2>";
  } else if (status === 'lose') {
    game.innerHTML += "<h2 class='result-header lose'>You lost :(</h2>";
  }

  game.innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-3">Play again</button>`;
  document.getElementById('play-again').onclick = startGame;
};

export const startGame = (): void => {
  triesLeft = 10;
  winCount = 0;
  logoH1.classList.add('logo-sm');

  const randomIndex: number = Math.floor(Math.random() * WORDS.length);
  const wordToGuess: string = WORDS[randomIndex];
  sessionStorage.setItem('word', wordToGuess);

  gameDiv.innerHTML = createPlaceHoldersHTML();
  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
      const letterButton: HTMLButtonElement = e.target;
      letterButton.disabled = true;
      checkLetter(letterButton.id);
    }
  });

  const hangmanImg = createHangManImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);
};
