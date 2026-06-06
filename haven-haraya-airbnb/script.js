// ========== DOM Elements ==========
const header = document.querySelector("[data-header]");
const meter = document.querySelector(".scroll-meter");
const reveals = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");

let activeGalleryIndex = 0;

// ========== Gallery Items (6 images) ==========
const galleryItems = [
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/51b7fe78-3d44-451a-b61f-c1f74ddd5ab9.jpeg", alt: "Living and dining area", caption: "Spacious living and dining area" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/7013f821-4e8e-4877-8ff0-5b830f845795.jpeg", alt: "Kitchen and dining", caption: "Fully equipped kitchen" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/b7a2b92a-4fa9-4743-ba42-72ff5f5c6a8b.jpeg", alt: "Bedroom", caption: "Comfortable bedroom with ample storage" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/51ebdac2-04b9-4870-b9c6-9c32038c4f12.jpeg", alt: "Bathroom", caption: "Clean and modern bathroom" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/c15df783-166b-4ce2-bad6-86b29ece0cc2.jpeg", alt: "Pool", caption: "Resort-style swimming pool" },
  { src: "https://a0.muscache.com/im/pictures/hosting/Hosting-1629801564228977399/original/b3debb9b-ddca-4eae-a79e-dd683533491f.jpeg", alt: "Balcony", caption: "Private balcony with garden view" }
];

// ========== Scroll Meter & Header ==========
function updateScrollState() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (header) header.classList.toggle("scrolled", scrollTop > 40);
  if (meter) meter.style.width = `${(scrollTop / maxScroll) * 100}%`;
}
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

// ========== Scroll Reveal (Intersection Observer) ==========
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
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
});

// ========== Gallery Lightbox ==========
function showGallery(index) {
  if (!lightbox || !lightboxImage) return;
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  if (lightboxCaption) lightboxCaption.textContent = item.caption;
  lightbox.showModal();
}

document.querySelectorAll("[data-gallery-index]").forEach(btn => {
  btn.addEventListener("click", () => showGallery(Number(btn.dataset.galleryIndex)));
});

document.querySelector("[data-close-gallery]")?.addEventListener("click", () => lightbox.close());
document.querySelector("[data-prev]")?.addEventListener("click", () => showGallery(activeGalleryIndex - 1));
document.querySelector("[data-next]")?.addEventListener("click", () => showGallery(activeGalleryIndex + 1));

lightbox?.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });
document.addEventListener("keydown", e => {
  if (!lightbox?.open) return;
  if (e.key === "ArrowLeft") showGallery(activeGalleryIndex - 1);
  if (e.key === "ArrowRight") showGallery(activeGalleryIndex + 1);
  if (e.key === "Escape") lightbox.close();
});

// ========== Count Up Stats with Intersection Observer ==========
const statNumbers = document.querySelectorAll("[data-count]");
if (statNumbers.length) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => countObserver.observe(el));
}

// ========== Hero Parallax (desktop only) ==========
const heroImg = document.querySelector(".hero-media img");
if (heroImg && window.innerWidth > 768) {
  document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    heroImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
  });
}

// ========== Glowing Cursor Card Effect ==========
const handleCardMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
};

const cards = document.querySelectorAll('.detail-card, .feature-card');
cards.forEach(card => {
  card.addEventListener('mousemove', handleCardMouseMove);
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  });
});

// ========== Custom Cursor ==========
if (window.matchMedia("(pointer: fine) and (hover: hover)").matches) {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);
  document.addEventListener("mousemove", e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  document.querySelectorAll("a, button, .tab, .detail-card, .feature-card").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

// ========== Booking Form ==========
const bookingForm = document.querySelector("[data-booking-form]");
if (bookingForm) {
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const checkin = formData.get("checkin");
    const checkout = formData.get("checkout");
    if (!checkin || !checkout) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(checkin) >= new Date(checkout)) {
      alert("Check-out must be after check-in.");
      return;
    }
    const subject = "Haven Haraya Stay Inquiry";
    const body = `Hello Haven Haraya,\n\nI would like to inquire about availability from ${checkin} to ${checkout} for ${formData.get("guests")} guest(s).\n\nMessage: ${formData.get("message") || "No additional message."}\n\nThank you.`;
    window.location.href = `mailto:haven.haraya@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// ========== Lazy Load Images ==========
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => img.setAttribute("loading", "lazy"));
}

// ========== AMBIENT AUDIO ==========
const audio = document.getElementById('ambient-audio');

if (audio) {

    // If user previously enabled music, start it
    if (localStorage.getItem('ambientAudioEnabled') === 'true') {
        audio.play().catch(() => {});
    }

    // Enable music when any header nav link is clicked
    document.querySelectorAll('.nav-links a, .nav-action').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.setItem('ambientAudioEnabled', 'true');
        });
    });

    // Remember current position
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('ambientAudioTime', audio.currentTime);
    });

    // Restore position
    const savedTime = localStorage.getItem('ambientAudioTime');

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Save position before leaving page
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('ambientAudioTime', audio.currentTime);
    });
}