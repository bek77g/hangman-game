import { WORDS } from './consts';
import { KEYBOARD_LETTERS } from './consts';

const gameDiv: HTMLDivElement = document.getElementById('game');
const logoH1: HTMLHeadingElement = document.getElementById('logo');

let triesLeft: number;

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
  } else {
    const wordArray: array = Array.from(word);
    wordArray.forEach((currentLetter: string, idx) => {
      if (currentLetter === inputLetter) {
        document.getElementById(`letter_${idx}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

export const startGame = (): void => {
  triesLeft = 10;
  logoH1.classList.add('logo-sm');

  const randomIndex: number = Math.floor(Math.random() * WORDS.length);
  const wordToGuess: string = WORDS[randomIndex];
  sessionStorage.setItem('word', wordToGuess);

  gameDiv.innerHTML = createPlaceHoldersHTML();
  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const hangmanImg = createHangManImg();
  gameDiv.prepend(hangmanImg);

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
      const letterButton: HTMLButtonElement = e.target;
      letterButton.disabled = true;
      checkLetter(letterButton.id);
    }
  });

  gameDiv.appendChild(keyboardDiv);
};
