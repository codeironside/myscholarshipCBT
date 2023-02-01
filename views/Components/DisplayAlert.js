const alert = document.querySelector('.alert');

export default function displayAlert(txt) {
    alert.textContent = txt;
    alert.classList.add("alert-display")
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove("alert-display")
    }, 7000)
}