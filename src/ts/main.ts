import '../css/style.css';
import { darkModeHandler } from './utils';

darkModeHandler();

const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', () => {
  console.log('Start Game');
});
