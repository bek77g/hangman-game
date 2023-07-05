import { WORDS } from './consts';
import { KEYBOARD_LETTERS } from './consts';

const gameDiv: HTMLDivElement = document.getElementById('game');

const createPlaceHoldersHTML = (): void => {
  const word = sessionStorage.getItem('word');
  const wordArray = word.split('');
  const placeholdersHTML: string = wordArray.reduce((acc, _, idx) => {
    return acc + `<h2 id="letter_${idx}" class="letter"> _ </h2>`;
  }, '');

  return `<div id="placeholders" class="placeholder-wrapper">${placeholdersHTML}</div>`;
};

export const startGame = (): void => {
  const randomIndex: number = Math.floor(Math.random() * WORDS.length);
  const wordToGuess: string = WORDS[randomIndex];
  sessionStorage.setItem('word', wordToGuess);

  gameDiv.innerHTML = createPlaceHoldersHTML();
};
