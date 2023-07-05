export const darkModeHandler = (): void => {
  const darkModeSwitcher: HTMLInputElement | null = document.getElementById(
    'toggleDarkMode'
  ) as HTMLInputElement | null;
  const htmlElement: HTMLElement = document.documentElement;

  if (localStorage.getItem('mode') === 'dark') {
    htmlElement.classList.add('dark');
    if (darkModeSwitcher) {
      darkModeSwitcher.checked = true;
    }
  }

  if (darkModeSwitcher) {
    darkModeSwitcher.addEventListener('input', () => {
      htmlElement.classList.toggle('dark');

      if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('mode', 'dark');
      } else {
        localStorage.setItem('mode', 'light');
      }
    });
  }
};

function generateRandomKey(length: number): string {
  let key = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }
  sessionStorage.setItem('key', key);
  return key;
}

export function encryptWord(word: string): string {
  const key: string = generateRandomKey(word.length)!;
  let encryptedWord = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const keyChar = key[i % key.length];
    const encryptedChar = String.fromCharCode(
      char.charCodeAt(0) ^ keyChar.charCodeAt(0)
    );
    encryptedWord += encryptedChar;
  }
  return encryptedWord;
}

export function decryptWord(encryptedWord: string): string {
  const key: string = sessionStorage.getItem('key')!;
  let decryptedWord = '';
  for (let i = 0; i < encryptedWord.length; i++) {
    const char = encryptedWord[i];
    const keyChar = key[i % key.length];
    const decryptedChar = String.fromCharCode(
      char.charCodeAt(0) ^ keyChar.charCodeAt(0)
    );
    decryptedWord += decryptedChar;
  }
  return decryptedWord;
}
