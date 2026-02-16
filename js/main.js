const state = { items: [], activeFilter: 'all' };
const workGrid = document.getElementById('workGrid');
const featuredGrid = document.getElementById('featuredGrid');
const filterButtons = document.querySelectorAll('.filter__pill');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');
const modalTools = document.getElementById('modalTools');
const modalLinks = document.getElementById('modalLinks');
const modalCta = document.querySelector('.modal a[href="#contact"]');
const yearEl = document.getElementById('year');
const cursorGlow = document.querySelector('.cursor-glow');

fetch(`data/portfolio.json?v=${Date.now()}`, { cache: 'no-store' })
  .then((res) => res.json())
  .then((items) => {
    state.items = items;
    renderPortfolio();
  })
  .catch((err) => console.error('Portfolio data load error', err));

function renderPortfolio() {
  renderFeatured();
  renderGrid();
}

function renderFeatured() {
  const featured = state.items.filter((item) => item.featured);
  featuredGrid.innerHTML = featured
    .map((item) => cardTemplate(item, true))
    .join('');
  attachCardHandlers(featuredGrid, featured);
  observeTargets(featuredGrid.querySelectorAll('.card'));
  attachPreviewHover(featuredGrid);
}

function renderGrid() {
  const filtered = state.items.filter((item) =>
    state.activeFilter === 'all' ? true : item.category === state.activeFilter
  );
  workGrid.innerHTML = filtered.map((item) => cardTemplate(item)).join('');
  attachCardHandlers(workGrid, filtered);
  observeTargets(workGrid.querySelectorAll('.card'));
  attachPreviewHover(workGrid);
}

function cardTemplate(item, isFeatured = false) {
  const tagList = (item.tools || []).map((tool) => `<span class="tag">${tool}</span>`).join('');
  const media = mediaPreview(item);
  return `
    <article class="card ${isFeatured ? 'card--featured' : ''}" data-id="${item.id}">
      <div class="card__media">
        ${media}
      </div>
      <div class="card__top">
        <span class="badge">${readableCategory(item.category)}</span>
        <span class="inline-btn" aria-hidden="true">Details</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.shortDescription}</p>
      <div class="tags">${tagList}</div>
    </article>
  `;
}

function attachCardHandlers(container, items) {
  container.querySelectorAll('[data-id]').forEach((card) => {
    card.addEventListener('click', (e) => {
      const item = items.find((i) => i.id === card.dataset.id);
      if (item) openModal(item);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = items.find((i) => i.id === card.dataset.id);
        if (item) openModal(item);
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    state.activeFilter = btn.dataset.filter;
    renderGrid();
  });
});

function openModal(item) {
  modal.setAttribute('aria-hidden', 'false');
  modalMedia.innerHTML = mediaTemplate(item.media, item.title);
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalCategory.textContent = readableCategory(item.category);
  modalTools.innerHTML = (item.tools || []).map((tool) => `<span class="chip">${tool}</span>`).join('');
  modalLinks.innerHTML = buildLinks(item.links);
  document.body.style.overflow = 'hidden';
}

function buildLinks(links = {}) {
  const entries = [];
  if (links.live) entries.push(`<a href="${links.live}" target="_blank" rel="noopener">Live</a>`);
  if (links.github) entries.push(`<a href="${links.github}" target="_blank" rel="noopener">GitHub</a>`);
  if (links.caseStudy) entries.push(`<a href="${links.caseStudy}" target="_blank" rel="noopener">Case Study</a>`);
  return entries.length ? entries.join('') : '<span class="muted">No external links provided</span>';
}

function mediaTemplate(media, title) {
  if (!media) return '';
  if (media.type === 'video' && media.embedUrl) {
    return `<iframe src="${media.embedUrl}" title="${title}" allowfullscreen loading="lazy"></iframe>`;
  }
  if (media.type === 'video' && media.src) {
    const poster = media.poster ? `poster="${media.poster}"` : '';
    return `<video src="${media.src}" ${poster} controls playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
  }
  if (media.type === 'gallery' && Array.isArray(media.src)) {
    return `<div class="gallery">${media.src
      .map((src) => `<img src="${src}" alt="${title} gallery image">`)
      .join('')}</div>`;
  }
  return `<img src="${media.src}" alt="${title} preview">`;
}

function mediaPreview(item) {
  const media = item.media || {};
  if (media.type === 'video' && media.src) {
    const poster = media.poster ? `poster="${media.poster}"` : `poster="${item.thumbnail}"`;
    return `<video class="card__video" data-preview muted loop preload="metadata" ${poster}>
      <source src="${media.src}" type="video/mp4">
    </video>`;
  }
  return `<img src="${item.thumbnail}" alt="Thumbnail for ${item.title}">`;
}

function attachPreviewHover(container) {
  container.querySelectorAll('[data-preview]').forEach((vid) => {
    vid.addEventListener('mouseenter', () => {
      const playPromise = vid.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    });
    vid.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });
    vid.addEventListener('focus', () => {
      const playPromise = vid.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    });
    vid.addEventListener('blur', () => {
      vid.pause();
      vid.currentTime = 0;
    });
  });
}

modal.addEventListener('click', (e) => {
  if (e.target.dataset.close !== undefined || e.target === modal) closeModal();
});

if (modalCta) {
  modalCta.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
  });
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modalMedia.innerHTML = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    const data = new FormData(contactForm);
    if (data.get('website')) return; // honeypot
    const errors = validateForm();
    if (errors.length) {
      formStatus.textContent = errors[0];
      return;
    }
    try {
      const response = await fetch('https://formspree.io/f/mldedzlj', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (response.ok) {
        formStatus.textContent = 'Thanks! I will reply within 1 business day.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Hmm, something went wrong. Email me directly at monzirali@outlook.com';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please email monzirali@outlook.com';
    }
  });
}

function validateForm() {
  const messages = [];
  contactForm.querySelectorAll('.field-msg').forEach((el) => (el.textContent = ''));
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name) messages.push('Name is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) messages.push('Valid email is required.');
  if (!message) messages.push('Please add a short project description.');
  if (messages[0]) {
    const first = messages[0].toLowerCase().includes('name')
      ? contactForm.name
      : messages[0].toLowerCase().includes('email')
      ? contactForm.email
      : contactForm.message;
    first.parentElement.querySelector('.field-msg').textContent = messages[0];
  }
  return messages;
}

if (yearEl) yearEl.textContent = new Date().getFullYear();

document.addEventListener('pointermove', (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.transform = `translate(${e.clientX - 90}px, ${e.clientY - 90}px)`;
});

function readableCategory(cat) {
  if (cat === 'ai-videos') return 'AI Videos';
  if (cat === 'websites') return 'Websites';
  if (cat === 'projects') return 'Projects';
  return cat;
}

// simple reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.card, .hero, .about, .cv, .contact, .featured').forEach((el) => observer.observe(el));

function observeTargets(nodes) {
  nodes.forEach((node) => observer.observe(node));
}
