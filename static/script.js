const tabNav = document.getElementById('tabNavbar');
const nav = document.getElementById('navbar');
const closeTabNavBar = document.getElementById('closeTabNavBar');

if (tabNav) {
    tabNav.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (closeTabNavBar) {
    closeTabNavBar.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}