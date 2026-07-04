// ========== DOM Elements ==========
const header = document.querySelector("[data-header]");
const meter = document.querySelector(".scroll-meter");
const reveals = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");

// ========== Safeguard: clear stuck no-scroll on load ==========
document.body.classList.remove("no-scroll");

let activeGalleryIndex = 0;
let lightboxPrevFocus = null;

// ========== Reduced Motion Preference ==========
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ========== Gallery Items (60 images) ==========
// Categories sourced from Airbnb listing metadata (accessibilityLabel > AI tags > captions)
const galleryItems = [
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/51b7fe78-3d44-451a-b61f-c1f74ddd5ab9.jpeg", alt: "Open-plan dining area with modern furnishings at Haven Haraya", caption: "Dining area with modern furnishings", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7013f821-4e8e-4877-8ff0-5b830f845795.jpeg", alt: "Dining area with fully equipped kitchen beyond at Haven Haraya", caption: "Dining area with kitchen beyond", category: "kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/b7a2b92a-4fa9-4743-ba42-72ff5f5c6a8b.jpeg", alt: "Bedroom with queen bed and ample storage at Haven Haraya", caption: "Comfortable bedroom with ample storage", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/51ebdac2-04b9-4870-b9c6-9c32038c4f12.jpeg", alt: "Modern bathroom with walk-in shower at Haven Haraya", caption: "Clean and modern bathroom", category: "bathroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c15df783-166b-4ce2-bad6-86b29ece0cc2.jpeg", alt: "Resort-style swimming pool at Alder Residences, Taguig", caption: "Resort-style swimming pool", category: "pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/b3debb9b-ddca-4eae-a79e-dd683533491f.jpeg", alt: "Private balcony with garden view at Haven Haraya", caption: "Private balcony with garden view", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/e32e9834-8706-46f0-b016-dcb64230487a.jpeg", alt: "Bright living room with modern furnishings at Haven Haraya", caption: "Living room with modern furnishings", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/6a4cafc5-9f21-4193-8eb2-7086d7bcf36c.jpeg", alt: "Modern condominium building exterior at Alder Residences, Taguig", caption: "Modern condominium building exterior", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/1d949bee-9e0a-4681-a740-d5b734580124.jpeg", alt: "Open-plan dining area opening to the kitchen at Haven Haraya", caption: "Dining area opening to the kitchen", category: "kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/1e96ad70-0a02-4b87-aa4b-b160d5c8cddc.jpeg", alt: "Fully equipped kitchen with appliances at Haven Haraya", caption: "Kitchen with appliances and counter space", category: "kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/2175eb35-bbc0-46b7-b37f-8a33c5456825.jpeg", alt: "Elegant living room with modern decor at Haven Haraya", caption: "Elegant living room setup", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/22647fec-7a97-4a61-aed6-4f6d426ecbfa.jpeg", alt: "City view from the balcony at Haven Haraya", caption: "City view from the balcony", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/240bf565-d997-4a56-a2db-28660fd626e5.jpeg", alt: "Bedroom with comfortable bedding at Haven Haraya", caption: "Bedroom with comfortable bedding", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/2c01b68e-3690-47e9-8a65-da5bff3aecd0.jpeg", alt: "Bright living room with natural light at Haven Haraya", caption: "Living room with natural light", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/3032ec76-1b57-4753-828e-40a32d4f0437.jpeg", alt: "Stunning sunset view from the balcony at Haven Haraya", caption: "Stunning sunset view from the balcony", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/306fa7a8-3576-4575-8a4d-74ca726e20cd.jpeg", alt: "Open-concept dining and kitchen area at Haven Haraya", caption: "Open concept dining and kitchen area", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/35d721b5-2d02-4ae1-9997-9430f60a0ee4.jpeg", alt: "Dining room with modern decor at Haven Haraya", caption: "Dining area with modern decor", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/39043941-667c-4eb9-b0a0-8e62534c56df.jpeg", alt: "Dining area with comfortable seating at Haven Haraya", caption: "Dining space with seating", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/3be2a31e-d27a-4ce4-94ec-f9ddb7c13efe.jpeg", alt: "Dining room with elegant setting at Haven Haraya", caption: "Dining area with elegant setting", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/438edba1-1dfa-4878-be23-244b9cf65a1c.jpeg", alt: "Bedroom with comfortable bedding at Haven Haraya", caption: "Bedroom with comfortable bedding", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/4de7c8c1-ca3c-49db-91c1-7f7985b0ab74.jpeg", alt: "Landscaped garden area near the pool at Alder Residences, Taguig", caption: "Landscaped garden area near the pool", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/513e7e20-08dd-4aac-b157-c6f1b82db761.jpeg", alt: "Fully equipped kitchen with dining counter at Haven Haraya", caption: "Kitchen with dining counter", category: "kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/519eca45-5ec4-4a66-b318-a24783036e2b.jpeg", alt: "Dining space with table setting at Haven Haraya", caption: "Dining space with table setting", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/597b1374-ffe5-4f2d-92c5-563a075f0dfc.jpeg", alt: "Cozy living room setup at Haven Haraya", caption: "Cozy living room setup", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/5c509f85-e209-400d-8daa-c63403e9f00d.jpeg", alt: "Dining space with natural light at Haven Haraya", caption: "Dining space with natural light", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/60abf060-2dca-4e44-98d6-dc20f24d765f.jpeg", alt: "Bedroom with wardrobe at Haven Haraya", caption: "Bedroom with wardrobe", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/6b3df160-0cc9-41e5-a44d-9a5e1db79be1.jpeg", alt: "Building exterior view at Alder Residences, Taguig", caption: "Building exterior view", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/717e52c4-c9d6-4546-a962-456d50ba472e.jpeg", alt: "Pool and surrounding area at Alder Residences, Taguig", caption: "Pool and surrounding area", category: "pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7925f445-637f-43ef-9a35-27c02c862dc3.jpeg", alt: "Swimming pool with lounging area at Alder Residences, Taguig", caption: "Swimming pool with lounging area", category: "pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7aab381c-eee9-4bdf-887b-24def754e1fd.jpeg", alt: "Balcony patio area at Haven Haraya", caption: "Balcony patio area", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7ea73e3a-8601-4912-8520-acbe1d05c1d0.jpeg", alt: "Dining room setting at Haven Haraya", caption: "Dining room setting", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7f2f86f1-a62b-4343-a1a9-b99c2a1f5811.jpeg", alt: "Community garden pathway at Alder Residences, Taguig", caption: "Community garden pathway", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7fbc7015-cda7-46b3-86f4-935a4e2e0339.jpeg", alt: "Bedroom with soft lighting at Haven Haraya", caption: "Bedroom with soft lighting", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/8410e020-6c31-40ae-bb2f-405ca988c170.jpeg", alt: "Basketball court", caption: "Community basketball court", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/86607639-ad1b-4f4b-bb94-d11e8ba0102c.jpeg", alt: "Living room area at Haven Haraya", caption: "Living room area", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/899ee793-c645-40b2-a92e-3866e0dfa30e.jpeg", alt: "Landscaped garden pathway at Alder Residences, Taguig", caption: "Landscaped garden pathway", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/8ecff898-814e-46dd-a5a2-4800af9e0f3e.jpeg", alt: "Living room with dresser at Haven Haraya", caption: "Living room with dresser", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/94fccc84-6307-4894-987e-0eaa640e45bc.jpeg", alt: "Kitchen counter and appliances at Haven Haraya", caption: "Kitchen counter and appliances", category: "kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/95c6ca02-5e29-43e5-bb64-fd9e10493bfc.jpeg", alt: "Modern bathroom vanity at Haven Haraya", caption: "Bathroom vanity area", category: "bathroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/96e35b17-94d1-48fe-a3f2-119763889d67.jpeg", alt: "Bedroom with natural light at Haven Haraya", caption: "Bedroom with natural light", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/9a73e55d-bfa9-4a3e-84ff-45ddb18be55e.jpeg", alt: "Landscaped grounds near the building at Alder Residences, Taguig", caption: "Landscaped grounds near the building", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/9ad3f274-234e-49a5-bc06-2e298ae1d699.jpeg", alt: "Community garden and exterior area at Alder Residences, Taguig", caption: "Community garden and exterior area", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/a09b635d-1e6d-4233-8a5d-2413d4dd477b.jpeg", alt: "Outdoor dining and grilling area at Alder Residences, Taguig", caption: "Al fresco dining and grilling area", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/a586b3f8-b7e1-45ce-8ed6-e0c166672a32.jpeg", alt: "Building exterior with surroundings at Alder Residences, Taguig", caption: "Building exterior with surroundings", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/a9aa74fe-2a67-4ca0-89fa-68ecf6949c59.jpeg", alt: "Second bedroom with storage at Haven Haraya", caption: "Second bedroom with storage", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/a9f46548-e991-4e8d-9fb0-5cf470206ed4.jpeg", alt: "Community patio seating at Alder Residences, Taguig", caption: "Community patio seating", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/b890ac65-e300-4137-ab81-7eb84838afcf.jpeg", alt: "Bedroom with warm lighting at Haven Haraya", caption: "Bedroom with warm lighting", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/bca30aa1-e299-426e-893f-485628b5eba5.jpeg", alt: "Bedroom with work desk space at Haven Haraya", caption: "Bedroom with work desk space", category: "bedroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c234c902-f083-4659-b54c-fc14b3a8b178.jpeg", alt: "Dining area with table and chairs at Haven Haraya", caption: "Dining area with table and chairs", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c2c9b0b7-0e80-4055-bef5-73830c8a2fb4.jpeg", alt: "Dining room with modern decor at Haven Haraya", caption: "Dining room with modern decor", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c404c693-347c-44dc-834a-117f883bdd36.jpeg", alt: "Swimming pool and deck at Alder Residences, Taguig", caption: "Swimming pool and deck", category: "pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c4b02746-d250-4fea-9557-0c9f30f1a35e.jpeg", alt: "Evening city view from the balcony at Haven Haraya", caption: "Evening city view from the balcony", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c75e481a-39aa-4850-8517-ab8ef6a45f30.jpeg", alt: "Living room with decor at Haven Haraya", caption: "Living room with decor", category: "living" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c87c4d86-3027-45fd-9c8f-ae15d2cd2290.jpeg", alt: "Private balcony with outdoor seating and sunset view at Haven Haraya", caption: "Private balcony with outdoor seating and sunset view", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/d33e925f-9ad8-4db4-9099-d63fc4b98114.jpeg", alt: "City view from balcony at Haven Haraya", caption: "City view from balcony", category: "balcony" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/dbdada38-1aab-4d0c-8553-2a0f9e11fc78.jpeg", alt: "Modern bathroom with fixtures at Haven Haraya", caption: "Bathroom with modern fixtures", category: "bathroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/e7a386ac-5998-4b6b-91ee-14a1c16b5223.jpeg", alt: "Pool and lounging area at Alder Residences, Taguig", caption: "Pool and lounging area", category: "pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/f0c2cb32-84d7-40b2-92f2-899c6b73a767.jpeg", alt: "Community playground with play equipment at Alder Residences, Taguig", caption: "Community playground with play equipment", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/fb855ef4-b0e9-45ff-b262-905a37b912a8.jpeg", alt: "Building exterior view at Alder Residences, Taguig", caption: "Building exterior view", category: "exterior" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/ff03a03f-8a87-463f-8e38-77936d6cfa0f.jpeg", alt: "Living room interior at Haven Haraya", caption: "Living room interior", category: "living" },
];

// ========== Scroll Meter & Header ==========
function updateScrollState() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (header) header.classList.toggle("scrolled", scrollTop > 40);
  if (meter && maxScroll > 0) meter.style.width = `${(scrollTop / maxScroll) * 100}%`;
}
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

// ========== Scroll Reveal (Intersection Observer) ==========
const revealTargets = document.querySelectorAll(".reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale-in, .reveal-stagger, .reveal-clip");
function activateReveal(el) {
  el.classList.add("visible");
  el.querySelectorAll("[data-reveal-words], [data-reveal-letters]").forEach(child => {
    child.classList.add("visible");
  });
}
if (prefersReducedMotion) {
  revealTargets.forEach(el => activateReveal(el));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateReveal(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => activateReveal(el));
}

// ========== Tabs (Amenities) ==========
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const selectedId = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach(t => {
      const isActive = t === tab;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", isActive);
    });
    document.querySelectorAll(".tab-panel").forEach(panel => {
      const isActive = panel.id === selectedId;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  });
  // Keyboard arrow navigation per WAI-ARIA Tabs pattern
  tab.addEventListener("keydown", (e) => {
    const tabs = Array.from(tab.closest(".tab-list").querySelectorAll('[role="tab"]'));
    const idx = tabs.indexOf(tab);
    let next;
    if (e.key === "ArrowRight") {
      next = tabs[(idx + 1) % tabs.length];
    } else if (e.key === "ArrowLeft") {
      next = tabs[(idx - 1 + tabs.length) % tabs.length];
    } else if (e.key === "Home") {
      next = tabs[0];
    } else if (e.key === "End") {
      next = tabs[tabs.length - 1];
    }
    if (next) {
      e.preventDefault();
      next.click();
      next.focus();
    }
  });
});

// ========== Gallery Lightbox ==========
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
let filteredIndices = [];

function showGallery(index) {
  if (!lightbox || !lightboxImage) return;
  lightboxPrevFocus = document.activeElement;
  const items = filteredIndices.length ? filteredIndices : galleryItems.map((_, i) => i);
  activeGalleryIndex = items[(items.indexOf(index) + items.length) % items.length];
  const item = galleryItems[activeGalleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  if (lightboxCaption) lightboxCaption.textContent = item.caption;
  if (lightboxCounter) lightboxCounter.textContent = `${items.indexOf(activeGalleryIndex) + 1} / ${items.length}`;
  lightbox.showModal();
  var closeBtn = lightbox.querySelector("[data-close-gallery]");
  if (closeBtn) closeBtn.focus();
}

// ========== Inquiry Form Handling ==========
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  // Set min date to today on the date inputs
  const today = new Date().toISOString().split("T")[0];
  const checkinInput = bookingForm.querySelector('input[name="checkin"]');
  const checkoutInput = bookingForm.querySelector('input[name="checkout"]');
  if (checkinInput) checkinInput.min = today;
  if (checkoutInput) checkoutInput.min = today;
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener("change", () => {
      checkoutInput.min = checkinInput.value || today;
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = "";
      }
    });
  }

  bookingForm.addEventListener("submit", function(e) {
    const name = bookingForm.name.value.trim();
    const email = bookingForm.email.value.trim();
    const checkin = bookingForm.checkin.value;
    const checkout = bookingForm.checkout.value;
    const guests = bookingForm.guests.value;
    const statusDiv = bookingForm.querySelector(".form-status");

    if (!name || !email || !checkin || !checkout || !guests) {
      e.preventDefault();
      statusDiv.textContent = "Please fill in all required fields.";
      statusDiv.className = "form-status visible error";
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      e.preventDefault();
      statusDiv.textContent = "Please enter a valid email address.";
      statusDiv.className = "form-status visible error";
      return;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkinDate < todayDate) {
      e.preventDefault();
      statusDiv.textContent = "Check-in date cannot be in the past.";
      statusDiv.className = "form-status visible error";
      return;
    }
    if (checkoutDate <= checkinDate) {
      e.preventDefault();
      statusDiv.textContent = "Check-out must be at least one night after check-in.";
      statusDiv.className = "form-status visible error";
      return;
    }

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusDiv.textContent = "Submitting your inquiry...";
    statusDiv.className = "form-status visible success";
  });
}

document.querySelector("[data-close-gallery]")?.addEventListener("click", () => {
  lightbox.close();
  if (lightboxPrevFocus && lightboxPrevFocus.focus) {
    lightboxPrevFocus.focus();
    lightboxPrevFocus = null;
  }
});
document.querySelector("[data-prev]")?.addEventListener("click", () => {
  const items = filteredIndices.length ? filteredIndices : galleryItems.map((_, i) => i);
  const idx = items.indexOf(activeGalleryIndex);
  showGallery(items[(idx - 1 + items.length) % items.length]);
});
document.querySelector("[data-next]")?.addEventListener("click", () => {
  const items = filteredIndices.length ? filteredIndices : galleryItems.map((_, i) => i);
  const idx = items.indexOf(activeGalleryIndex);
  showGallery(items[(idx + 1) % items.length]);
});

lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) {
    lightbox.close();
    if (lightboxPrevFocus && lightboxPrevFocus.focus) {
      lightboxPrevFocus.focus();
      lightboxPrevFocus = null;
    }
  }
});
document.addEventListener("keydown", e => {
  if (!lightbox?.open) return;
  if (e.key === "ArrowLeft") document.querySelector("[data-prev]")?.click();
  if (e.key === "ArrowRight") document.querySelector("[data-next]")?.click();
  if (e.key === "Escape") {
    lightbox.close();
    if (lightboxPrevFocus && lightboxPrevFocus.focus) {
      lightboxPrevFocus.focus();
      lightboxPrevFocus = null;
    }
  }
  // Focus trap: keep Tab cycling within the dialog
  if (e.key === "Tab") {
    const focusable = lightbox.querySelectorAll("[data-close-gallery], [data-prev], [data-next]");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ========== Interactive Gallery Grid ==========
const galleryGrid = document.getElementById("gallery-grid");
const galleryCount = document.getElementById("gallery-count");
const filterBtns = document.querySelectorAll(".gallery-filter");
let activeFilter = "all";

function buildGrid(filter) {
  if (!galleryGrid) return;
  filteredIndices = galleryItems
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => filter === "all" || item.category === filter)
    .map(({ i }) => i);

  const featuredIndices = new Set([4, 6, 7, 27, 5, 3]);
  const tallIndices = new Set([1, 9, 14, 20, 23, 33, 39, 44, 49, 52, 56, 59]);
  const wideIndices = new Set([10, 16, 29, 37, 46, 58]);

  galleryGrid.innerHTML = filteredIndices.map((idx) => {
    const item = galleryItems[idx];
    const isFeatured = featuredIndices.has(idx);
    const isTall = tallIndices.has(idx);
    const isWide = wideIndices.has(idx);
    const sizeClass = isFeatured ? " featured" : isTall ? " tall" : isWide ? " wide" : "";
    return `<button class="gallery-grid-item reveal-mask-up hover-zoom card-lift${sizeClass}" data-gallery-index="${idx}" data-loading="true" style="animation-delay:${Math.random() * 0.15}s" aria-label="View ${item.alt}">
      <img src="${item.src}" alt="${item.alt}" loading="lazy" />
      <span class="hover-caption">${item.caption || item.alt}</span>
    </button>`;
  }).join("");

  if (galleryCount) {
    galleryCount.textContent = `Showing ${filteredIndices.length} of ${galleryItems.length} photos`;
  }

  filterBtns.forEach(btn => {
    const cat = btn.dataset.filter;
    const count = cat === "all" ? galleryItems.length : galleryItems.filter(i => i.category === cat).length;
    const badge = btn.querySelector(".filter-count");
    if (badge) badge.textContent = count;
  });

  galleryGrid.querySelectorAll("[data-gallery-index]").forEach(btn => {
    btn.addEventListener("click", () => showGallery(Number(btn.dataset.galleryIndex)));
  });

  // ========== Gallery Grid Accessibility ==========
  galleryGrid.setAttribute("role", "grid");
  galleryGrid.setAttribute("aria-label", "Photo gallery");

  var gridItems = galleryGrid.querySelectorAll("[data-gallery-index]");
  gridItems.forEach(function (item, idx) {
    item.setAttribute("role", "gridcell");
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", function (e) {
      var target = null;
      if (e.key === "ArrowRight") {
        target = gridItems[(idx + 1) % gridItems.length];
      } else if (e.key === "ArrowLeft") {
        target = gridItems[(idx - 1 + gridItems.length) % gridItems.length];
      } else if (e.key === "Home") {
        target = gridItems[0];
      } else if (e.key === "End") {
        target = gridItems[gridItems.length - 1];
      }
      if (target) {
        e.preventDefault();
        target.focus();
      }
    });
  });

  applySkeleton();
  observeNewReveals();

  galleryGrid.querySelectorAll("[data-gallery-index]").forEach(el => {
    var img = el.querySelector('img');
    if (img) {
      img.addEventListener('load', function() {
        el.removeAttribute('data-loading');
      }, { once: true });
    }
  });

  if (typeof motionCache !== 'undefined') {
    registerMotionEls(galleryGrid.querySelectorAll('img[data-motion-y]'));
    if (typeof updateMotion === 'function') requestAnimationFrame(updateMotion);
  }
}

function applySkeleton() {
  document.querySelectorAll(".gallery-grid-item img").forEach(img => {
    const item = img.closest(".gallery-grid-item");
    if (item) item.classList.add("loading");
    const reveal = () => {
      if (item && !item.classList.contains("loaded")) {
        item.classList.remove("loading");
        item.classList.add("loaded");
        item.classList.add("visible");
      }
    };
    if (img.complete && img.naturalWidth > 0) {
      reveal();
      return;
    }
    img.addEventListener("load", reveal, { once: true });
    img.addEventListener("error", () => {
      if (item) {
        item.classList.remove("loading");
        item.classList.add("loaded");
      }
    }, { once: true });
    requestAnimationFrame(() => {
      if (img.complete && img.naturalWidth > 0) reveal();
    });
    setTimeout(() => {
      if (img.complete && img.naturalWidth > 0) reveal();
    }, 1500);
    setTimeout(() => {
      if (img.complete && img.naturalWidth > 0) reveal();
    }, 3000);
  });
}

// ========== Motion Cache (declared early to avoid TDZ ReferenceError) ==========
let motionCache = [];

// ========== Generic reveal observer (declared early to avoid TDZ ReferenceError) ==========
let genericRevealObserver = null;

// ========== Generic reveal selector (declared early to avoid TDZ ReferenceError) ==========
const REVEAL_SELECTOR = [
  ".reveal-words",
  ".reveal-letters",
  ".reveal-clip-img",
  ".reveal-mask-up",
  ".reveal-blur",
  ".reveal-from-left",
  ".reveal-from-right",
  ".underline-draw",
  ".heading-line",
  ".reveal-number"
].join(",");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    activeFilter = btn.dataset.filter;
    buildGrid(activeFilter);
  });
});

// Initialize aria-pressed on page load for the active filter
filterBtns.forEach(btn => {
  btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
});

buildGrid("all");

// ========== Count Up Stats with Intersection Observer ==========
const statNumbers = document.querySelectorAll("[data-count]");
if (statNumbers.length) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!Number.isFinite(target)) {
        countObserver.unobserve(el);
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(t * target);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
  statNumbers.forEach(el => countObserver.observe(el));
}

// ========== Hero 3D Tilt (desktop only) ==========
// ========== 3D Card Tilt (all card types) ==========
const cardTypes = '.detail-card, .feature-card, .page-card, .guidebook-card, .pricing-card, .testimonial-card, .detail-panel';
const tiltCards = document.querySelectorAll(cardTypes);

if (tiltCards.length && !prefersReducedMotion) {
  let tiltRaf = null;
  const handleTiltMove = (e) => {
    if (tiltRaf) cancelAnimationFrame(tiltRaf);
    tiltRaf = requestAnimationFrame(() => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -12;
      const tiltY = (x - 0.5) * 12;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
  };
  const handleTiltLeave = (e) => {
    e.currentTarget.style.transform = '';
  };
  let tiltActive = false;
  function enableTilt() {
    if (tiltActive) return;
    tiltActive = true;
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', handleTiltMove);
      card.addEventListener('mouseleave', handleTiltLeave);
    });
  }
  function disableTilt() {
    if (!tiltActive) return;
    tiltActive = false;
    tiltCards.forEach(card => {
      card.removeEventListener('mousemove', handleTiltMove);
      card.removeEventListener('mouseleave', handleTiltLeave);
      card.style.transform = '';
    });
  }
  const mql = window.matchMedia('(min-width: 769px)');
  function checkTilt() { mql.matches ? enableTilt() : disableTilt(); }
  checkTilt();
  mql.addEventListener('change', checkTilt);
}

// ========== AMBIENT AUDIO ==========
const audio = document.getElementById('ambient-audio');
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = audioToggle?.querySelector('i');

function updateAudioIcon() {
  if (!audioIcon) return;
  audioIcon.className = audio && !audio.paused
    ? 'fa-solid fa-volume-high'
    : 'fa-solid fa-volume-xmark';
}

if (audio) {

    // Restore position once metadata is loaded
    const savedTime = localStorage.getItem('ambientAudioTime');
    if (savedTime) {
        const seek = () => {
            const t = parseFloat(savedTime);
            if (Number.isFinite(t)) audio.currentTime = t;
            audio.removeEventListener('loadedmetadata', seek);
        };
        if (audio.readyState >= 1) {
            seek();
        } else {
            audio.addEventListener('loadedmetadata', seek);
        }
    }

    // If user previously enabled music, start it
    const wasEnabled = localStorage.getItem('ambientAudioEnabled') === 'true';
    if (wasEnabled) {
        audio.play().then(updateAudioIcon).catch(() => {});
    }
    updateAudioIcon();

    // Resume music on nav only if user had it enabled (not if they muted it)
    document.querySelectorAll('.nav-links a, .nav-action').forEach(link => {
        link.addEventListener('click', () => {
            if (localStorage.getItem('ambientAudioEnabled') === 'true' && audio.paused) {
                audio.play().then(updateAudioIcon).catch(() => {});
            }
        });
    });

    // Debounced save of current position
    let saveTimer = null;
    audio.addEventListener('timeupdate', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            localStorage.setItem('ambientAudioTime', audio.currentTime);
        }, 3000);
    });

    // Save position before leaving page
    window.addEventListener('beforeunload', () => {
        clearTimeout(saveTimer);
        localStorage.setItem('ambientAudioTime', audio.currentTime);
    });

    // Pause audio when tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !audio.paused) {
            audio.pause();
            updateAudioIcon();
        } else if (!document.hidden && localStorage.getItem('ambientAudioEnabled') === 'true' && audio.paused) {
            audio.play().then(updateAudioIcon).catch(() => {});
        }
    });

    // Mute toggle button
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    localStorage.setItem('ambientAudioEnabled', 'true');
                    updateAudioIcon();
                }).catch(() => {});
            } else {
                audio.pause();
                localStorage.setItem('ambientAudioEnabled', 'false');
                updateAudioIcon();
            }
        });
    }
}

// ========== Mobile Hamburger Menu ==========
const menuToggle = document.querySelector(".menu-toggle");
const navOverlay = document.querySelector(".nav-overlay");
function closeMobileMenu() {
  if (!menuToggle || !navOverlay) return;
  menuToggle.classList.remove("active");
  navOverlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}
function openMobileMenu() {
  if (!menuToggle || !navOverlay) return;
  menuToggle.classList.add("active");
  navOverlay.classList.add("open");
  document.body.classList.add("no-scroll");
}
if (menuToggle && navOverlay) {
  menuToggle.addEventListener("click", () => {
    if (navOverlay.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  navOverlay.addEventListener("click", e => {
    if (e.target === navOverlay) {
      closeMobileMenu();
    }
  });
  navOverlay.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navOverlay.classList.contains("open")) {
      closeMobileMenu();
      menuToggle.focus();
    }
  });
  let resizeRaf = null;
  window.addEventListener("resize", () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (window.innerWidth > 860 && navOverlay.classList.contains("open")) {
        closeMobileMenu();
      }
    });
  }, { passive: true });
}

// ========== Back to Top Button ==========
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const arrow = backToTop.querySelector("svg, i");
  let backTicking = false;

  function updateBackToTop() {
    backTicking = false;
    backToTop.classList.toggle("visible", window.scrollY > 400);
    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  }

  window.addEventListener("scroll", () => {
    if (!backTicking) {
      requestAnimationFrame(updateBackToTop);
      backTicking = true;
    }
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateBackToTop();
}

// ========== Sticky Mobile CTA ==========
const stickyCta = document.querySelector(".sticky-cta");
if (stickyCta) {
  const isMobile = () => window.matchMedia("(max-width: 860px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ctaTicking = false;
  const updateCta = () => {
    ctaTicking = false;
    if (!isMobile()) {
      stickyCta.classList.remove("visible");
      return;
    }
    if (document.body.classList.contains("no-scroll") || document.body.classList.contains("lightbox-open")) {
      stickyCta.classList.remove("visible");
      return;
    }
    if (new URLSearchParams(window.location.search).has("sticky")) {
      stickyCta.classList.add("visible");
      return;
    }
    const footer = document.querySelector(".site-footer");
    const footerInView = footer && (() => {
      const r = footer.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    })();
    const scrolled = window.scrollY > 400;
    stickyCta.classList.toggle("visible", scrolled && !footerInView);
  };
  const onScrollCta = () => {
    if (!ctaTicking) {
      requestAnimationFrame(updateCta);
      ctaTicking = true;
    }
  };
  window.addEventListener("scroll", onScrollCta, { passive: true });
  window.addEventListener("resize", onScrollCta, { passive: true });
  window.matchMedia("(max-width: 860px)").addEventListener?.("change", onScrollCta);
  updateCta();
  if (reduceMotion) {
    stickyCta.style.transition = "none";
  }
  const stickyBtn = stickyCta.querySelector(".sticky-cta-button");
  stickyBtn?.addEventListener("click", (e) => {
    if (stickyBtn.getAttribute("href") === window.location.pathname.split("/").pop()) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
}

// ========== 3D Scroll Z-Depth Parallax ==========
const depthSections = document.querySelectorAll('.band[data-depth]');
if (depthSections.length && !prefersReducedMotion) {
  function updateDepth() {
    const vh = window.innerHeight;
    depthSections.forEach(sec => {
      const d = parseFloat(sec.dataset.depth) || 0;
      const rect = sec.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        const centerDist = (rect.top + rect.height / 2) - vh / 2;
        const offset = centerDist * d * 0.12;
        sec.style.transform = `translateZ(${offset.toFixed(2)}px)`;
      } else {
        sec.style.transform = '';
      }
    });
  }
  let depthRaf = null;
  window.addEventListener("scroll", () => {
    if (depthRaf) cancelAnimationFrame(depthRaf);
    depthRaf = requestAnimationFrame(updateDepth);
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (depthRaf) cancelAnimationFrame(depthRaf);
    depthRaf = requestAnimationFrame(updateDepth);
  }, { passive: true });
  // Apply initial transforms so the depth offset is set on first paint.
  requestAnimationFrame(updateDepth);
}

// ========== 3D Hero Floating Shapes Mouse Response ==========
const heroFloats = document.querySelector('.hero-floats');
const floatShapes = heroFloats?.querySelectorAll('.float-shape');
if (heroFloats && floatShapes?.length && window.innerWidth > 768 && !prefersReducedMotion) {
  document.querySelector('.hero')?.addEventListener('mousemove', e => {
    const rect = heroFloats.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / cx;
    const py = (e.clientY - cy) / cy;
    floatShapes.forEach((shape, i) => {
      const speed = 6 + i * 4;
      shape.style.transform = `translateX(${px * speed}px) translateY(${py * speed}px)`;
    });
  });
}

// ========== FAQ Accordion ==========
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// ========== Scroll Motion Effects ==========
// Auto-target content images for subtle scroll motion;
// elements with explicit data-motion-* attributes also get picked up.
// Skip images inside .hover-zoom so their CSS hover scale isn't clobbered
// by our inline transform, and skip .reveal-mask-up images (the mask owns
// the image transform).
if (!prefersReducedMotion) {
  document.querySelectorAll('img:not(.brand-logo):not(.hero-media img):not([data-lightbox-image])').forEach(img => {
    if (img.closest('.hover-zoom, .reveal-mask-up, .map-overlay, .lightbox')) return;
    if (!img.dataset.motionY && !img.dataset.motionScale && !img.dataset.motionOpacity && !img.dataset.motionRotate) {
      img.setAttribute('data-motion-y', '30');
      img.setAttribute('data-motion-opacity', '1');
    }
  });
}

const motionEls = document.querySelectorAll('[data-motion-y], [data-motion-scale], [data-motion-opacity], [data-motion-rotate]');

function registerMotionEls(nodeList) {
  nodeList.forEach(el => {
    if (motionCache.some(item => item.el === el)) return;
    const motionY = parseFloat(el.dataset.motionY) || 0;
    const motionScale = parseFloat(el.dataset.motionScale) || 1;
    const motionOpacity = parseFloat(el.dataset.motionOpacity) || 0.85;
    const motionRotate = parseFloat(el.dataset.motionRotate) || 0;
    motionCache.push({ el, motionY, motionScale, motionOpacity, motionRotate });
    el.style.willChange = 'transform, opacity';
    // Only apply the short smoothing transition on elements that DON'T have
    // a CSS reveal entrance (those use the entrance's longer transition and
    // get the short one re-applied after onReady()).
    if (!el.matches('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale-in, .reveal-clip')) {
      el.style.transition = 'transform 100ms linear, opacity 100ms linear';
    }
  });
}

function updateMotion() {
  const vh = window.innerHeight;
  const revealTypes = '.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale-in, .reveal-clip';
  motionCache.forEach(({ el, motionY, motionScale, motionOpacity, motionRotate }) => {
    if (el.matches(revealTypes) && (!el.classList.contains('visible') || !el.dataset.motionEntranceDone)) return;
    const rect = el.getBoundingClientRect();
    const elTop = rect.top;
    const elBottom = rect.bottom;
    if (elBottom < 0 || elTop > vh) return;
    const progress = Math.max(0, Math.min(1, (vh - elTop) / (vh + el.offsetHeight)));
    const ty = motionY * (1 - progress);
    const sc = 1 - (1 - motionScale) * (1 - progress);
    const op = 1 - (1 - motionOpacity) * (1 - progress);
    const rot = motionRotate * (1 - progress);
    el.style.transform = `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
    el.style.opacity = op;
  });
}

if (motionEls.length && !prefersReducedMotion) {
  registerMotionEls(motionEls);

  const revealMotionEls = motionCache.filter(({ el }) =>
    el.matches('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale-in, .reveal-clip')
  );
  revealMotionEls.forEach(({ el }) => {
    const onReady = () => {
      clearTimeout(fallback);
      el.removeEventListener('transitionend', onEnd);
      el.dataset.motionEntranceDone = '1';
      // Restore the short motion-smoothing transition now that the entrance
      // animation has finished. (Was set in registerMotionEls but the CSS
      // reveal transition took over during the entrance phase.)
      el.style.transition = 'transform 100ms linear, opacity 100ms linear';
    };
    const onEnd = (e) => { if (e.propertyName === 'opacity') onReady(); };
    let fallback;
    const wait = () => {
      if (el.classList.contains('visible')) {
        el.addEventListener('transitionend', onEnd);
        fallback = setTimeout(onReady, 900);
      } else {
        requestAnimationFrame(wait);
      }
    };
    requestAnimationFrame(wait);
  });

  let motionRaf = null;
  window.addEventListener("scroll", () => {
    if (motionRaf) cancelAnimationFrame(motionRaf);
    motionRaf = requestAnimationFrame(updateMotion);
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (motionRaf) cancelAnimationFrame(motionRaf);
    motionRaf = requestAnimationFrame(updateMotion);
  }, { passive: true });
  // Apply initial transforms so content is at its parallax position from
  // first paint (prevents the "jump" on first scroll).
  requestAnimationFrame(updateMotion);
}

// ========== Wix-Style Effects ==========

// 1) Text Splitter: word-by-word and letter-by-letter
function splitText(node, mode) {
  if (!node || node.dataset.splitDone === "1") return;
  const text = node.textContent;
  const tokens = mode === "words"
    ? text.trim().split(/\s+/)
    : Array.from(text);
  // Check if the element is already visible (parent has .visible)
  // or prefers-reduced-motion is set — in either case, show text immediately
  const isAlreadyVisible = prefersReducedMotion
    || node.classList.contains("visible")
    || node.closest(".visible") !== null;
  node.textContent = "";
  let animIndex = 0;
  tokens.forEach((token, i) => {
    if (mode === "letters" && token === " ") {
      node.appendChild(document.createTextNode(" "));
      return;
    }
    const wrapper = document.createElement("span");
    wrapper.className = mode === "words" ? "word" : "letter";
    const inner = document.createElement("span");
    if (mode === "words") {
      inner.textContent = token;
    } else {
      inner.textContent = token;
    }
    wrapper.appendChild(inner);
    node.appendChild(wrapper);
    if (mode === "words" && i < tokens.length - 1) {
      node.appendChild(document.createTextNode(" "));
    }
    const delay = mode === "words" ? i * 70 : animIndex * 25;
    inner.style.setProperty("--word-delay", `${delay}ms`);
    inner.style.setProperty("--letter-delay", `${delay}ms`);
    animIndex++;
    if (isAlreadyVisible) {
      inner.style.transform = "translateY(0)";
    }
  });
  if (isAlreadyVisible) {
    node.classList.add("visible");
  }
  node.dataset.splitDone = "1";
}

function initTextSplits() {
  document.querySelectorAll("[data-reveal-words]").forEach(el => splitText(el, "words"));
  document.querySelectorAll("[data-reveal-letters]").forEach(el => splitText(el, "letters"));
}

// 2) Generic reveal observer for all new effect classes
function initGenericReveals() {
  if (prefersReducedMotion) {
    document.querySelectorAll(REVEAL_SELECTOR).forEach(el => el.classList.add("visible"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(REVEAL_SELECTOR).forEach(el => el.classList.add("visible"));
    return;
  }
  if (!genericRevealObserver) {
    genericRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          genericRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  }
  document.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
    if (!el.classList.contains("visible") && !el._revealObserved) {
      genericRevealObserver.observe(el);
      el._revealObserved = true;
    }
  });
}

function observeNewReveals() {
  initGenericReveals();
}

// 3) Stagger reveal observer
function initStaggerReveal() {
  const targets = document.querySelectorAll(".reveal-stagger-up");
  if (!targets.length) return;
  if (prefersReducedMotion) {
    targets.forEach(el => el.classList.add("visible"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  targets.forEach(el => obs.observe(el));
}

// 4) Multi-layer parallax
function initParallax() {
  if (prefersReducedMotion) return;
  const bgs = document.querySelectorAll("[data-parallax-speed]");
  if (!bgs.length) return;
  let ticking = false;
  function update() {
    ticking = false;
    bgs.forEach(bg => {
      const speed = parseFloat(bg.dataset.parallaxSpeed) || 0.2;
      const rect = bg.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vh = window.innerHeight;
      const offset = (center - vh / 2) * speed;
      bg.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

// 5) Magnetic buttons
function initMagnetic() {
  if (prefersReducedMotion) return;
  if (window.matchMedia("(max-width: 620px)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const els = document.querySelectorAll(".magnetic");
  els.forEach(el => {
    el.addEventListener("mouseenter", () => el.classList.add("magnetic-active"));
    el.addEventListener("mouseleave", () => {
      el.classList.remove("magnetic-active");
      el.style.transform = "translate(0, 0)";
    });
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = parseFloat(el.dataset.magneticStrength) || 0.3;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
  });
}

// 6) Color tint on scroll
function initColorTint() {
  if (prefersReducedMotion) return;
  const tints = document.querySelectorAll("[data-color-tint]");
  if (!tints.length) return;
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.3 });
  tints.forEach(el => obs.observe(el));
}

// 7) Initialize all Wix-style effects
function initWixEffects() {
  initTextSplits();
  initGenericReveals();
  initStaggerReveal();
  initParallax();
  initMagnetic();
  initColorTint();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWixEffects);
} else {
  initWixEffects();
}

/* =============================================================
   PAGE LOADER
   - Shows the logo + brand text + progress bar
   - Hides after window.load with a min display of 800ms
   - Skips on subsequent navigations within the same session
   ============================================================= */
(function initPageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  if (sessionStorage.getItem("haven-loader-shown") || new URLSearchParams(location.search).has("nopreload")) {
    loader.classList.add("hidden");
    loader.setAttribute("aria-hidden", "true");
    return;
  }

  const minDisplay = 2000;
  const maxWait = 4000;
  const startTime = Date.now();
  let hidden = false;

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, minDisplay - elapsed);
    setTimeout(() => {
      loader.classList.add("hidden");
      sessionStorage.setItem("haven-loader-shown", "1");
    }, wait);
  }

if (document.readyState === "complete") {
  hideLoader();
} else {
  window.addEventListener("load", hideLoader, { once: true });
  setTimeout(hideLoader, maxWait);
}
})();

// ========== Lazy-load Background Images ==========
(function () {
  var targets = document.querySelectorAll('[style*="background-image"]');
  if (!targets.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var bg = e.target.getAttribute('data-bg');
        if (bg) e.target.style.backgroundImage = bg;
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px 0px' });
  targets.forEach(function (el) {
    var bg = el.style.backgroundImage;
    if (!bg || bg === 'none') return;
    el.setAttribute('data-bg', bg);
    el.style.backgroundImage = 'none';
    io.observe(el);
  });
})();

/* =============================================================
   THEME TOGGLE
   - Light/dark mode with localStorage persistence
   - FOUC prevention handled by inline script in <head>
   - Syncs with prefers-color-scheme on first visit
   ============================================================= */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const icon = toggle.querySelector("i");
    if (theme === "dark") {
      icon.className = "fa-solid fa-sun";
      toggle.setAttribute("aria-label", "Switch to light mode");
      toggle.setAttribute("aria-pressed", "true");
    } else {
      icon.className = "fa-solid fa-moon";
      toggle.setAttribute("aria-label", "Switch to dark mode");
      toggle.setAttribute("aria-pressed", "false");
    }
  }

  // Sync the toggle icon with the theme already set by the head script
  applyTheme(root.getAttribute("data-theme") || "light");

  toggle.addEventListener("click", () => {
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("haven-theme", next); } catch (e) { /* storage may be blocked */ }
  });
})();

// ========== Page Transitions (View Transitions API) ==========
if (document.startViewTransition) {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:') || link.target === '_blank') return;
    if (new URL(href, location.origin).origin !== location.origin) return;
    e.preventDefault();
    document.startViewTransition(function () {
      window.location.href = href;
    });
  });
}

// ========== Service Worker ==========
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

// ========== Handle Formspree submission ==========
(function() {
  var form = document.querySelector('form[action*="formspree"]');
  if (!form) return;
  if (location.search.includes('success')) {
    form.style.display = 'none';
    var success = document.getElementById('form-success');
    if (success) success.style.display = 'block';
    showToast('Thank you! Your inquiry has been submitted.', 'success');
  }
})();

// ========== Toast Notifications ==========
function showToast(message, type) {
  var existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  
  var toast = document.createElement('div');
  toast.className = 'toast-notification toast-' + (type || 'success');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = '<span>' + message + '</span><button class="toast-close" aria-label="Dismiss">&times;</button>';
  document.body.appendChild(toast);
  
  requestAnimationFrame(function() {
    toast.classList.add('toast-visible');
  });
  
  toast.querySelector('.toast-close').addEventListener('click', function() {
    toast.classList.remove('toast-visible');
    setTimeout(function() { toast.remove(); }, 300);
  });
  
  setTimeout(function() {
    if (toast.parentNode) {
      toast.classList.remove('toast-visible');
      setTimeout(function() { toast.remove(); }, 300);
    }
  }, 5000);
}

// ========== Scroll Restoration ==========
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', function () {
  if (sessionStorage.getItem('haven-scroll')) {
    window.scrollTo(0, parseInt(sessionStorage.getItem('haven-scroll'), 10));
    sessionStorage.removeItem('haven-scroll');
  }
});
window.addEventListener('beforeunload', function () {
  sessionStorage.setItem('haven-scroll', window.scrollY);
});

// ========== Cross-page Section Scroll ==========
(function() {
  var hash = location.hash;
  if (!hash || hash === '#top') return;
  var target = document.querySelector(hash);
  if (target) {
    setTimeout(function() {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600); // after page loader hides
  }
})();

