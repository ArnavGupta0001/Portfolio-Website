'use strict';

// Preloader
window.addEventListener("DOMContentLoaded", function () {
  const preloader = document.querySelector("[data-preloader]");
  preloader?.classList.add("loaded");
  document.body.classList.add("loaded");
});

// Event Helper
const addEventOnElements = (elements, eventType, callback) => {
  elements.forEach(el => el.addEventListener(eventType, callback));
};

// Navbar toggle
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

addEventOnElements(navTogglers, "click", () => {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
});

addEventOnElements(navLinks, "click", () => {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-active");
});

// Sticky header
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => {
  header.classList.toggle("active", window.scrollY > 100);
});

// Element tilt
const tiltElements = document.querySelectorAll("[data-tilt]");
addEventOnElements(tiltElements, "mousemove", function (e) {
  const centerX = this.offsetWidth / 2;
  const centerY = this.offsetHeight / 2;
  const tiltX = ((e.offsetY - centerY) / centerY) * 10;
  const tiltY = ((e.offsetX - centerX) / centerX) * 10;
  this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY * -1}deg)`;
});
addEventOnElements(tiltElements, "mouseout", function () {
  this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});

// Tab system
const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabContents = document.querySelectorAll("[data-tab-content]");
let lastActiveTabBtn = tabBtns[0];
let lastActiveTabContent = tabContents[0];

addEventOnElements(tabBtns, "click", function () {
  if (this !== lastActiveTabBtn) {
    lastActiveTabBtn.classList.remove("active");
    lastActiveTabContent.classList.remove("active");

    this.classList.add("active");
    lastActiveTabBtn = this;

    const newContent = document.querySelector(`[data-tab-content="${this.dataset.tabBtn}"]`);
    newContent.classList.add("active");
    lastActiveTabContent = newContent;
  }
});

// Custom cursor
const cursors = document.querySelectorAll("[data-cursor]");
const hoveredElements = [...document.querySelectorAll("button"), ...document.querySelectorAll("a")];

window.addEventListener("mousemove", function (e) {
  const { clientX, clientY } = e;
  cursors[0].style.left = `${clientX}px`;
  cursors[0].style.top = `${clientY}px`;
  setTimeout(() => {
    cursors[1].style.left = `${clientX}px`;
    cursors[1].style.top = `${clientY}px`;
  }, 80);
});
addEventOnElements(hoveredElements, "mouseover", () => cursors.forEach(c => c.classList.add("hovered")));
addEventOnElements(hoveredElements, "mouseout", () => cursors.forEach(c => c.classList.remove("hovered")));

// Tab title on focus/blur
window.onblur = () => (document.title = "Come back!");
window.onfocus = () => (document.title = "Welcome back!");

// Modal logic
const openModal = document.getElementById('openProjectModal');
const modal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeProjectModal');

openModal?.addEventListener('click', () => {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});
closeModal?.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: contactForm.name.value.trim(),
      email_address: contactForm.email_address.value.trim(),
      phone: contactForm.phone.value.trim(),
      message: contactForm.message.value.trim()
    };

    if (!formData.name || !formData.email_address || !formData.message) {
      return alert("Please fill in all required fields.");
    }

    try {
      const response = await fetch('http://localhost:5500/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        contactForm.reset();
      } else {
        alert(result.message || 'Submission failed. Try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send. Server error.');
    }
  });
}
