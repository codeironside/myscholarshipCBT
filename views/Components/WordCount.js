const textarea = document.getElementById('essay');
const wordCountDisplay = document.getElementById('count');
const hearAbout = document.getElementById('information');

export default function WordCount() {
    let textareaValue = textarea.value.trim().split(" ");
    let wordLength = textareaValue.length;
    let wordLengthDiff = 150 - textareaValue.length;
    wordCountDisplay.textContent = `you have ${wordLengthDiff} words left`;
    wordCountDisplay.style.color = 'green';
    if (wordLengthDiff === 0) {
        hearAbout.focus();
    } else if (wordLength < 10) {
        textarea.focus()
        wordCountDisplay.textContent = `Please enter atleast 10 words, you have entered only ${wordLength} ${wordLength === 1 ? 'word' : "words"}`;
        wordCountDisplay.style.color = 'red'
    }
}