var closeIcon = document.getElementById("close");
var menu = document.getElementById("menuMobile");
var bar = document.getElementById("barIcon");
var liOne = document.getElementById("listOne");
var liOTow = document.getElementById("listTow");
var lists = document.getElementById("listAll");

closeIcon.onclick = function () {
  menu.style.transform = "translateX(-100%)";
};

bar.onclick = function () {
  menu.style.transform = "translateX(0%)";
  lists.classList.add("slide-up");
  lists.classList.add("reveal");
};

var swiper = new Swiper(".episodes-mySwiper", {
  slidesPerView: 5,
  loop: true,
  spaceBetween: 15,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    "@1.50": {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
});

var swiper = new Swiper(" .more-links-mySwiper", {
  slidesPerView: 5,
  loop: true,
  spaceBetween: 15,
  navigation: {
    nextEl: ".swiper-button-next-2",
    prevEl: ".swiper-button-prev-2",
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    "@1.50": {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
});
