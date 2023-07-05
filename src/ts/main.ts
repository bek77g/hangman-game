import '../css/style.css';
import { darkModeHandler } from './utils';
import { startGame } from './game';

darkModeHandler();

const startGameButton: HTMLButtonElement = document.getElementById('startGame');
startGameButton.addEventListener('click', startGame);
