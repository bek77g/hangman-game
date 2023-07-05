import { GameStatus } from '../types/types';
import { WORDS } from './consts';
import { KEYBOARD_LETTERS } from './consts';
import { decryptWord, encryptWord } from './utils';

const gameDiv: HTMLDivElement = document.getElementById(
  'game'
) as HTMLDivElement;
const logoH1: HTMLHeadingElement = document.getElementById(
  'logo'
) as HTMLHeadingElement;

let triesLeft: number;
let winCount: number;

const createPlaceHoldersHTML = (): string => {
  const word: string = decryptWord(sessionStorage.getItem('word')!);
  const wordArray: string[] = word.split('');
  const placeholdersHTML: string = wordArray.reduce((acc, _, idx) => {
    return acc + `<h2 id="letter_${idx}" class="letter"> _ </h2>`;
  }, '');

  return `<div id="placeholders" class="placeholder-wrapper">${placeholdersHTML}</div>`;
};

const createKeyboard = (): HTMLDivElement => {
  const keyboard: HTMLDivElement = document.createElement('div');
  keyboard.classList.add('keyboard');
  keyboard.id = 'keyboard';

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
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

const checkLetter = (letter: string): void => {
  const word: string = decryptWord(sessionStorage.getItem('word')!);
  const inputLetter: string = letter.toLowerCase();
  if (!word.includes(inputLetter)) {
    const triesCounter: HTMLSpanElement = document.getElementById(
      'tries-left'
    ) as HTMLSpanElement;
    triesLeft -= 1;
    triesCounter.innerText = triesLeft.toString();
    const hangmanImg: HTMLImageElement = document.getElementById(
      'hangman-img'
    ) as HTMLImageElement;
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
    if (triesLeft === 0) stopGame('lose');
  } else {
    const wordArray: string[] = Array.from(word);
    wordArray.forEach((currentLetter: string, idx) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame('win');
          return;
        }
        (
          document.getElementById(`letter_${idx}`) as HTMLHeadingElement
        ).innerText = inputLetter.toUpperCase();
      }
    });
  }
};

const stopGame = (status: GameStatus): void => {
  const placeholdersDiv: HTMLElement | null =
    document.getElementById('placeholders');
  const triesDiv: HTMLElement | null = document.getElementById('tries');
  const keyboardDiv: HTMLElement | null = document.getElementById('keyboard');
  const quitButton: HTMLElement | null = document.getElementById('quit');

  placeholdersDiv?.remove();
  triesDiv?.remove();
  keyboardDiv?.remove();
  quitButton?.remove();

  const game: HTMLDivElement = document.getElementById(
    'game'
  ) as HTMLDivElement;
  const hangmanImg: HTMLImageElement = document.getElementById(
    'hangman-img'
  ) as HTMLImageElement;

  const word: string = decryptWord(sessionStorage.getItem('word')!);

  if (status === 'win') {
    hangmanImg.src = 'images/hg-win.png';
    game.innerHTML += "<h2 class='result-header win'>You win!</h2>";
  } else if (status === 'lose') {
    game.innerHTML += "<h2 class='result-header lose'>You lost :(</h2>";
  } else if (status === 'quit') {
    logoH1.classList.remove('logo-sm');
    hangmanImg.remove();
  }

  game.innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`;
  document.getElementById('play-again')?.addEventListener('click', startGame);
};

export const startGame = (): void => {
  triesLeft = 10;
  winCount = 0;
  logoH1.classList.add('logo-sm');

  const randomIndex: number = Math.floor(Math.random() * WORDS.length);
  const wordToGuess: string = WORDS[randomIndex];

  sessionStorage.setItem('word', encryptWord(wordToGuess));

  gameDiv.innerHTML = createPlaceHoldersHTML();
  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    if (target.tagName.toLowerCase() === 'button') {
      const letterButton: HTMLButtonElement = target;
      letterButton.disabled = true;
      checkLetter(letterButton.id);
    }
  });

  const hangmanImg = createHangManImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);

  gameDiv.insertAdjacentHTML(
    'beforeend',
    "<button id='quit' class='button-secondary px-2 py-1 mt-4'>Quit</button>"
  );

  document.getElementById('quit')?.addEventListener('click', () => {
    const sure = confirm('Are you sure you want to quit and lose the game?');
    if (sure) {
      stopGame('quit');
    }
  });
};
