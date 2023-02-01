const nav = document.querySelector('nav');

export default function() {
    const scrollHeight = nav.getBoundingClientRect().top

    if (scrollHeight === 0) {
        nav.classList.remove("nav-fixed")
    } else {
        nav.classList.add("nav-fixed")
    }
}