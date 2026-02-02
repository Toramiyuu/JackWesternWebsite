// ========================================
// JACK WESTERN CUISINE - Restaurant Website Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Loading screen ---
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1200);

  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile menu toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    navLinks.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  };

  navToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // --- Menu category tabs ---
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      menuItems.forEach(item => {
        if (item.dataset.category === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Smooth reveal on scroll ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--color-accent)';
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- Hero hours badge (multi-branch) ---
  const heroBadge = document.getElementById('heroBadge');
  if (heroBadge) {
    const branches = [
      { name: 'Tg. Tokong', open: 16 * 60 + 30, close: 23 * 60 + 30 },   // 4:30 PM - 11:30 PM
      { name: 'Georgetown', open: 17 * 60, close: 24 * 60 },               // 5:00 PM - 12:00 AM
      { name: 'Ayer Itam', open: 16 * 60, close: 23 * 60 + 30 }            // 4:00 PM - 11:30 PM
    ];

    const updateHoursBadge = () => {
      const now = new Date();
      const myTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
      const hours = myTime.getHours();
      const minutes = myTime.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      const dot = heroBadge.querySelector('.badge-dot');
      const text = heroBadge.querySelector('.badge-text');

      const openBranches = branches.filter(b => currentMinutes >= b.open && currentMinutes < b.close);

      if (openBranches.length > 0) {
        dot.classList.remove('closed');
        if (openBranches.length === branches.length) {
          text.textContent = 'All branches open now';
        } else {
          text.textContent = openBranches.map(b => b.name).join(' & ') + ' open now';
        }
      } else {
        dot.classList.add('closed');
        // Find earliest opening branch
        const earliest = branches.reduce((a, b) => a.open < b.open ? a : b);
        const earlyHour = Math.floor(earliest.open / 60);
        const earlyMin = earliest.open % 60;
        const timeStr = `${earlyHour > 12 ? earlyHour - 12 : earlyHour}:${earlyMin.toString().padStart(2, '0')} PM`;
        if (currentMinutes < earliest.open) {
          text.textContent = `Opens today at ${timeStr}`;
        } else {
          text.textContent = `Closed \u2014 Opens tomorrow at ${timeStr}`;
        }
      }
    };

    updateHoursBadge();
    setInterval(updateHoursBadge, 60000);
  }

  // --- Mobile CTA bar visibility ---
  const mobileCta = document.getElementById('mobileCta');
  const heroSection = document.getElementById('hero');

  if (mobileCta && heroSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileCta.classList.remove('visible');
        } else {
          mobileCta.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    ctaObserver.observe(heroSection);
  }

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.label || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(currentLightboxIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

});

// ========================================
// Google Places API — Reviews & Rating
// ========================================
const PLACE_ID_REVIEWS = 'ChIJbXbsIUqjSjARCVaw8_P-FC0'; // Georgetown (most reviews)
const PLACE_ID_PHOTOS = 'ChIJUTCte7vDSjARmn3hzBFnA8c';  // Tg. Tokong (photos)
const CACHE_KEY = 'jackwestern_google_reviews_v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function initPlaces() {
  const div = document.createElement('div');
  const service = new google.maps.places.PlacesService(div);

  // Fetch reviews from Georgetown branch (with cache)
  const cachedReviews = loadCache(CACHE_KEY, CACHE_DURATION);
  if (cachedReviews) {
    renderGoogleData(cachedReviews);
  } else {
    service.getDetails({
      placeId: PLACE_ID_REVIEWS,
      fields: ['rating', 'user_ratings_total', 'reviews']
    }, (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;
      const reviewData = {
        rating: place.rating,
        totalReviews: place.user_ratings_total,
        reviews: (place.reviews || []).map(r => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description
        }))
      };
      saveCache(CACHE_KEY, reviewData);
      renderGoogleData(reviewData);
    });
  }

  // Fetch real photos from Tg. Tokong branch
  service.getDetails({
    placeId: PLACE_ID_PHOTOS,
    fields: ['photos']
  }, (place, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !place.photos) return;
    renderGooglePhotos(place.photos);
  });
}

function loadCache(key, duration) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch {}
}

function renderGoogleData(data) {
  const ratingNum = document.getElementById('googleRatingNumber');
  const ratingLabel = document.getElementById('googleRatingLabel');
  const ratingInline = document.getElementById('googleRatingInline');
  const reviewCount = document.getElementById('googleReviewCount');

  if (ratingNum && data.rating) {
    ratingNum.textContent = data.rating.toFixed(1);
  }
  if (ratingLabel && data.totalReviews) {
    ratingLabel.textContent = `Google Rating`;
  }
  if (ratingInline && data.rating) {
    ratingInline.textContent = data.rating.toFixed(1);
  }
  if (reviewCount && data.totalReviews) {
    reviewCount.textContent = `${data.totalReviews} reviews`;
  }

  const grid = document.getElementById('reviewsGrid');
  if (!grid || !data.reviews || data.reviews.length === 0) return;

  const starSvg = '<svg viewBox="0 0 20 20" width="18" height="18" fill="#d4863a"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.28l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78z"/></svg>';
  const emptyStarSvg = '<svg viewBox="0 0 20 20" width="18" height="18" fill="#352e26"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.28l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78z"/></svg>';

  const goodReviews = data.reviews
    .filter(r => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  if (goodReviews.length === 0) return;

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const cards = goodReviews.map(review => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < review.rating ? starSvg : emptyStarSvg
    ).join('');

    const text = review.text.length > 200
      ? review.text.substring(0, 200).trim() + '...'
      : review.text;

    return `
      <div class="testimonial-card">
        <div class="testimonial-stars">${stars}</div>
        <p class="testimonial-text">"${esc(text)}"</p>
        <div class="testimonial-author">
          <span class="testimonial-name">${esc(review.author)}</span>
          <span class="testimonial-source"><span class="review-source-badge">Google</span> ${esc(review.time || '')}</span>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

// ========================================
// Google Places API — Real Photos
// ========================================
function renderGooglePhotos(photos) {
  if (!photos || photos.length === 0) return;

  // Replace hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && photos[0]) {
    heroBg.src = photos[0].getUrl({ maxWidth: 1920 });
    heroBg.alt = 'Jack Western Cuisine +';
  }

  // Replace about image
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg && photos[1]) {
    aboutImg.src = photos[1].getUrl({ maxWidth: 800 });
    aboutImg.alt = 'Jack Western Cuisine dining';
  }

  // Replace gallery images
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item img');
  const galleryPhotos = photos.slice(1); // skip hero photo
  galleryItems.forEach((img, i) => {
    if (galleryPhotos[i]) {
      img.src = galleryPhotos[i].getUrl({ maxWidth: 800 });
      img.alt = 'Jack Western Cuisine';
    }
  });

  // Replace OG image meta tag
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && photos[0]) {
    ogImage.content = photos[0].getUrl({ maxWidth: 1200 });
  }
}
