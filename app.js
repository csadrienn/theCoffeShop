gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);
animate();

// Gsap animation
function animate() {
  const ease = "power2.inOUt";
  const toggleActions = "play none restart reset";
  const start = "top bottom";

  //hero animation
  tlHero = gsap.timeline({
    scrollTrigger: { trigger: "#hero", toggleActions: toggleActions, start: start },
    defaults: { duration: 1, ease: ease },
  });

  const logoWrapperHeight = document.querySelector("#hero .logo-wrapper").clientHeight;
  const wrapperHeight = document.querySelector("#hero .wrapper").clientHeight;

  tlHero
    .from("#hero .logo-wrapper .logo", { y: -logoWrapperHeight, opacity: 0 })
    .from("#hero .wrapper h1", { y: wrapperHeight, opacity: 0 }, "-=0.3")
    .from("#hero .wrapper .btn", { y: wrapperHeight, opacity: 0 }, "-=0.8");

  //selection animation
  const selectionTexts = document.querySelectorAll(".cards .card-text .text-wrapper");
  selectionTexts.forEach(cardText => {
    const cardWidth = cardText.parentElement.clientWidth;
    const xMovement = cardText.parentElement.classList.contains("text2") ? cardWidth : -cardWidth;
    gsap.from(cardText, {
      scrollTrigger: {
        trigger: cardText,
        toggleActions: toggleActions,
        start: start,
      },
      x: xMovement,
      opacity: 0,
      duration: 2,
      ease: ease,
    });
  });

  //scroll back button visibility
  const selection = document.getElementById("#selection");
  gsap.to("#scroll-up-btn", {
    scrollTrigger: {
      trigger: "#selection",
      toggleActions: "play none none reverse",
      start: "top center",
    },
    opacity: 0.6,
    duration: 0.3,
    ease: ease,
  });

  //gallery animation
  gsap.from(".images .img-wrapper", {
    scrollTrigger: {
      trigger: ".images",
      toggleActions: toggleActions,
      start: start,
    },
    yPercent: 7,
    opacity: 0,
    duration: 1,
    ease: ease,

    stagger: { amount: 1 },
  });

  const tlAbout = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      toggleActions: toggleActions,
      start: start,
    },
    defaults: { duration: 0.6, ease: ease },
  });
  const tlContact = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact",
      toggleActions: toggleActions,
      start: start,
    },
    defaults: { duration: 0.6, ease: ease },
  });

  tlAbout
    .from("#about .card-right", { yPercent: 10 })
    .from("#about .card-left", { yPercent: -10 }, "-=0.8")
    .from("#about .card-left .card-content", { opacity: 0 }, "-=0.5")
    .from("#about .card-bordered", { yPercent: 20, opacity: 0 }, "-=0.3");

  tlContact
    .from("#contact .card-left", { yPercent: 10 })
    .from("#contact .card-right", { yPercent: -10 }, "-=0.8")
    .from("#contact .card-right .card-content", { opacity: 0 }, "-=0.5")
    .from("#contact .card-bordered", { yPercent: 20, opacity: 0 }, "-=0.3");
}

//Carousel
const imagesEl = document.querySelector(".images");
const images = imagesEl.querySelectorAll(".img-wrapper img");
const carouselContainer = document.querySelector(".carousel-container");

const carouselSlide = document.querySelector(".carousel-slide");
let carouselImages = carouselSlide.querySelectorAll("img");
const carouselPrevBtn = document.getElementById("carousel-prev-btn");
const carouselNextBtn = document.getElementById("carousel-next-btn");
const carouselCloseBtn = document.getElementById("carousel-close-btn");

let counter = 1;
let size;

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    showCarousel(index);
  });
});

function showCarousel(index) {
  carouselContainer.classList.add("active");
  counter = index + 1;

  // Clone the last and the first image container
  const lastClone = makeClone(carouselImages[carouselImages.length - 1]);
  lastClone.setAttribute("id", "last-clone");
  const firstClone = makeClone(carouselImages[0]);
  firstClone.setAttribute("id", "first-clone");

  carouselSlide.insertBefore(lastClone, carouselSlide.firstElementChild);
  carouselSlide.appendChild(firstClone);
  carouselImages = carouselSlide.querySelectorAll("img");

  size = carouselImages[index + 1].clientWidth;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
}

function makeClone(elem) {
  const cloneImg = document.createElement("img");
  const src = elem.getAttribute("src");
  const alt = elem.getAttribute("alt");
  cloneImg.setAttribute("src", src);
  cloneImg.setAttribute("alt", alt);
  return cloneImg;
}

const showNextImg = e => {
  e.preventDefault();

  if (counter < carouselImages.length - 1) {
    carouselSlide.style.transition = "transform 0.3s ease-in-out";

    counter++;

    carouselSlide.style.transform = `translateX(${-size * counter}px`;
    e.target.style.pointerEvents = "none";
  }
};

const showPrevImg = e => {
  e.preventDefault();
  if (counter > 0) {
    carouselSlide.style.transition = "transform 0.3s ease-in-out";
    counter--;

    carouselSlide.style.transform = `translateX(${-size * counter}px`;
    e.target.style.pointerEvents = "none";
  }
};

const closeCarousel = e => {
  e.preventDefault();
  carouselContainer.classList.remove("active");
  carouselSlide.style.transition = "none";
  document.getElementById("last-clone").remove();
  document.getElementById("first-clone").remove();
  carouselImages = carouselSlide.querySelectorAll("img");
};

//Event Listeners

carouselNextBtn.addEventListener("click", e => showNextImg(e));

carouselPrevBtn.addEventListener("click", e => showPrevImg(e));

carouselSlide.addEventListener("transitionend", () => {
  if (carouselImages[counter].id === "last-clone") {
    carouselSlide.style.transition = "none";
    counter = carouselImages.length - 2;
    carouselSlide.style.transform = `translateX(${-size * counter}px`;
  }

  if (carouselImages[counter].id === "first-clone") {
    carouselSlide.style.transition = "none";
    counter = carouselImages.length - counter;
    carouselSlide.style.transform = `translateX(${-size * counter}px`;
  }
  carouselNextBtn.style.pointerEvents = "all";
  carouselPrevBtn.style.pointerEvents = "all";
});

carouselCloseBtn.addEventListener("click", closeCarousel);
window.addEventListener("resize", () => {
  size = carouselImages[counter].clientWidth;
  carouselSlide.style.transition = "none";
  carouselSlide.style.transform = `translateX(${-size * counter}px`;
});

//Navigation and mobile navigation

const burger = document.getElementById("burger");
const mobNavLinks = document.querySelector(".mob-nav-links");
const mobNavLinkEls = mobNavLinks.querySelectorAll("li");
const navLinks = document.querySelector(".nav-links");
const navLinksEls = navLinks.querySelectorAll("li");
const scrollUpBtn = document.getElementById("scroll-up-btn");

function toggleNav(e) {
  e.preventDefault();
  mobNavLinks.classList.toggle("active");
  if (mobNavLinks.classList.contains("active")) {
    gsap.fromTo(
      ".mob-nav-links li",
      { x: 500, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: "power2", stagger: { each: 0.1 } }
    );
  } else {
    gsap.to(".mob-nav-links li", { opacity: 0, duration: 0.2 });
  }
}

function scroll(link) {
  const target = link.getAttribute("href");
  gsap.to(window, { duration: 1, scrollTo: target });
}

navLinksEls.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    scroll(link.firstElementChild);
  });
});

mobNavLinkEls.forEach(link => {
  link.addEventListener("click", e => {
    toggleNav(e);
    scroll(link.firstElementChild);
  });
});

burger.addEventListener("click", toggleNav);

scrollUpBtn.addEventListener("click", e => {
  e.preventDefault();
  scroll(scrollUpBtn);
});

// disable buttons
const buttons = document.querySelectorAll(".btn");
buttons.forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
  });
});
