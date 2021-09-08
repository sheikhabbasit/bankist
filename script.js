'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling and Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  e.preventDefault(); // to prevent it from acting based on the html

  // Matching strategy, to ignore clicks from the rest of the page
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Building a tabbed component
const operationTabBtn = document.querySelectorAll('.operations__tab');
const btnTabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// // Using event delegation
btnTabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  if (!clicked) {
    /*null(falsy) will become true*/
    return;
  }
  //Active Tab
  operationTabBtn.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//
//
// Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
  logo.style.opacity = this;
};

// // Passing an argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
// // It can take only one argument
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation

// const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNavBar = function (
  entries /*entries are generated while scrolling*/
) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

//                                               callback fx, options
const headerObserver = new IntersectionObserver(stickyNavBar, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Revealing elements on scroll
const revealElements = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealElements, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('section');

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//
//
// Lazy loading images

const allImages = document.querySelectorAll('img[data-src]');

const revealImages = function (entries, observer) {
  const [img] = entries;
  // console.log(img);
  if (!img.isIntersecting) return;
  img.target.src = img.target.dataset.src;

  img.target.addEventListener('load', function () {
    //load event fires up when the browser finishes loading all images
    img.target.classList.remove('lazy-img');
  });
  observer.unobserve(img.target);
};

const imgObserver = new IntersectionObserver(revealImages, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

allImages.forEach(image => imgObserver.observe(image));
//
//
//

// Slider / Carousel Section

// consts initializer
const sliderInitializer = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const maxSlides = slides.length;
  let curSlide = 0;

  // fx
  const slideFx = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  const incCurSlide = function () {
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    slideFx(curSlide);
    activateDot(curSlide);
  };

  const decCurSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }
    slideFx(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide= "${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //main function call initializers
  slideFx(0);
  createDots();
  activateDot(0);

  //event listeners

  // // buttons
  btnRight.addEventListener('click', incCurSlide);
  btnLeft.addEventListener('click', decCurSlide);

  // // arrow keys
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && decCurSlide();
    e.key === 'ArrowRight' && incCurSlide();
  });

  // // dot btns
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slidenumber = e.target.dataset.slide;

      slideFx(slidenumber);
      activateDot(slidenumber);
    }
  });
};

sliderInitializer();
