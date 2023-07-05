import { WORDS } from './consts';
import { KEYBOARD_LETTERS } from './consts';

const gameDiv: HTMLDivElement = document.getElementById('game');
const logoH1: HTMLHeadingElement = document.getElementById('logo');

const createPlaceHoldersHTML = (): string => {
  const word = sessionStorage.getItem('word');
  const wordArray = word.split('');
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

export const startGame = (): void => {
  logoH1.classList.add('logo-sm');
  const randomIndex: number = Math.floor(Math.random() * WORDS.length);
  const wordToGuess: string = WORDS[randomIndex];
  sessionStorage.setItem('word', wordToGuess);

  gameDiv.innerHTML = createPlaceHoldersHTML();
  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const hangmanImg = createHangManImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(createKeyboard());
};
