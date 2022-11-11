"use strict";
import "./links/links.js";

const nav = document.querySelector(".js-header-nav-container");
const btnMenu = document.querySelector(".js-header-btn-menu");

function toggleNav() {
  nav.classList.toggle("active");
}

btnMenu.addEventListener("click", toggleNav);
