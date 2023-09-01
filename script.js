//===== Set the height of each .do_circle to be equal to the height of its parent .who-we-are =====//
document.addEventListener("DOMContentLoaded", function () {
    var doCircles = document.querySelectorAll('.do_circle');

    doCircles.forEach(function (doCircle) {
        var parentWhoWeAre = doCircle.closest('.who-we-are');
        if (parentWhoWeAre) {
            doCircle.style.height = parentWhoWeAre.offsetHeight + 'px';
        }
    });
});

//===== typing animation =====//
var bannerTyping = new Typed('.multitext', {
    strings: ['URSAWORKS'],
    typeSpeed: 110,
    backSpeed: 80,
    backDelay: 1500,
    loop: false
});

var wustlTyping = new Typed('.wustl', {
    strings: ['robomasters from Washington University in St.Louis'],
    typeSpeed: 15,
    backSpeed: 80,
    backDelay: 1500,
    loop: false,
    showCursor: false
});

//===== scroll to top button =====//
const scrollToTopBtn = document.querySelector("#scroll-to-top-btn");
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});

//===== show menu in mobile view =====//
const menuIcon = document.getElementById('menu-icon');
const responsiveHeader = document.querySelector('.responsive-header');
let isOpen = false;

menuIcon.addEventListener('click', () => {
    if (isOpen) {
        responsiveHeader.style.right = '-190%';
        isOpen = false;
    } else {
        responsiveHeader.style.right = '0';
        isOpen = true;
    }
});

// Initialize the observer
function observeElement(selector, className) {
    const elements = document.querySelectorAll(selector);

    if (elements.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    observer.unobserve(entry.target);
                } else {
                    entry.target.classList.remove(className);
                }
            });
        });

        elements.forEach(element => observer.observe(element));
    }
}

// Use the observer function
// observeElement('.about-title', 'appear');
observeElement('.logo_circle', 'appear');
observeElement('.do_circle', 'appear');
observeElement('.team-text', 'appear');
observeElement('.members', 'appear');
observeElement('#events', 'appear');
observeElement('#contact', 'appear');
