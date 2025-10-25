// ==========================
// MOBILE NAVIGATION ENHANCEMENT
// ==========================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelectorAll("nav a");
if (menuToggle && navLinks) {
  navLinks.forEach(link => {
    link.addEventListener("click", () => { menuToggle.checked = false; });
  });
}

// Add slight scroll lock on mobile when nav is open
menuToggle.addEventListener("change", () => {
  if (menuToggle.checked) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "";
});

// ==========================
// HIDE HEADER ON SCROLL (mobile-safe)
// ==========================
const header = document.querySelector("header");
let lastScrollY = window.scrollY;
if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 80) header.classList.add("hide");
    else header.classList.remove("hide");
    lastScrollY = window.scrollY;
  });
}

// ==========================
// LIGHTBOX
// ==========================
const galleryContainer = document.querySelector(".preview-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");
const lightboxSize = document.getElementById("lightbox-size");
const lightboxPrice = document.getElementById("lightbox-price");
const lightboxThumbs = document.getElementById("lightbox-thumbs");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const closeBtn = document.getElementById("close-lightbox");

let currentSeries = [], currentIndex = 0;

function openLightboxSeries(seriesData, startIndex = 0) {
  currentSeries = seriesData;
  currentIndex = startIndex;
  updateLightbox();

  lightboxThumbs.innerHTML = "";
  currentSeries.forEach((item, idx) => {
    const thumb = document.createElement("img");
    thumb.src = item.src;
    thumb.classList.toggle("active-thumb", idx === currentIndex);
    thumb.addEventListener("click", () => {
      currentIndex = idx;
      updateLightbox();
    });
    lightboxThumbs.appendChild(thumb);
  });

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  lightbox.setAttribute("aria-hidden", "false");
}

function updateLightbox() {
  const imgData = currentSeries[currentIndex];
  lightboxImg.src = imgData.src;
  lightboxTitle.textContent = imgData.caption;
  lightboxDescription.textContent = imgData.description;
  lightboxSize.textContent = `Size: ${imgData.size || "—"}`;
  lightboxPrice.textContent = `Price: ${imgData.price || "—"}`;

  lightboxThumbs.querySelectorAll("img").forEach((thumb, idx) => {
    thumb.classList.toggle("active-thumb", idx === currentIndex);
  });
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  lightbox.setAttribute("aria-hidden", "true");
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentSeries.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentSeries.length) % currentSeries.length;
  updateLightbox();
}

galleryContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".hover-swap");
  if (!item) return;
  e.preventDefault();
  const seriesData = JSON.parse(item.dataset.images);
  openLightboxSeries(seriesData);
});

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// ==========================
// UPDATE LIGHTBOX
// ==========================
function updateLightbox() {
  const imgData = currentSeries[currentIndex];

  // Animate fade
  lightboxImg.classList.add("fade-out");
  setTimeout(() => {
    lightboxImg.src = imgData.src;
    lightboxTitle.textContent = imgData.caption;
    lightboxDescription.textContent = imgData.description;
    lightboxSize.textContent = `Size: ${imgData.size || "—"}`;
    lightboxPrice.textContent = `Price: ${imgData.price || "—"}`;

    // Update active thumbnail
    lightboxThumbs.querySelectorAll("img").forEach((thumb, idx) => {
      thumb.classList.toggle("active-thumb", idx === currentIndex);
    });

    lightboxImg.classList.remove("fade-out");
    lightboxImg.classList.add("fade-in");
    setTimeout(() => lightboxImg.classList.remove("fade-in"), 350);
  }, 200);
}

// ==========================
// CLOSE / NAVIGATION
// ==========================
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentSeries.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentSeries.length) % currentSeries.length;
  updateLightbox();
}

// ==========================
// GALLERY CLICK EVENTS
// ==========================
galleryContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".hover-swap");
  if (!item) return;
  e.preventDefault();
  const seriesData = JSON.parse(item.dataset.images);
  openLightboxSeries(seriesData);
});

galleryContainer.addEventListener("keydown", (e) => {
  const item = e.target.closest(".hover-swap");
  if (!item) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const seriesData = JSON.parse(item.dataset.images);
    openLightboxSeries(seriesData);
  }
});

// ==========================
// LIGHTBOX BUTTONS & KEYS
// ==========================
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);
closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

// ==========================
// PURCHASE BUTTON
// ==========================
const purchaseBtn = document.getElementById("purchase-btn");
if (purchaseBtn) {
  purchaseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(lightboxTitle.textContent);
    window.location.href = `contact.html?subject=${subject}`;
  });
}

// Autofill subject from URL
const urlParams = new URLSearchParams(window.location.search);
const subjectInput = document.querySelector('input[name="subject"]');
if (urlParams.has("subject") && subjectInput) {
  subjectInput.value = urlParams.get("subject");
}

// ==========================
// EMAILJS CONTACT FORM
// ==========================
if(document.getElementById("contact-form")) {
  // Load EmailJS SDK
  const emailjsScript = document.createElement("script");
  emailjsScript.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
  emailjsScript.onload = () => {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status") || document.createElement("p");
    if(!status.id) { status.id = "form-status"; form.after(status); }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      emailjs.sendForm('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',this)
        .then(()=>{
          status.textContent = "Message sent successfully!";
          status.style.color = "green";
          form.reset();
        },(err)=>{
          status.textContent = "Oops, something went wrong. Try again.";
          status.style.color = "red";
          console.error(err);
        });
    });
  };
  document.body.appendChild(emailjsScript);
}
