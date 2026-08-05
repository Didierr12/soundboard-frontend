/**
 * ============================================================================
 * REVIEW PAGE - GLASS-CYAN NEON DESIGN SYSTEM
 * Complete Enterprise Client-Side Architecture & Controller
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURATION, CONSTANTS & INITIAL STATE
  // ==========================================================================
  const CONFIG = {
    STORAGE_KEYS: {
      REVIEWS: 'neon_app_reviews_v1',
      FAVORITES: 'neon_app_favorites_v1',
      RECENT_SEARCHES: 'neon_app_searches_v1'
    },
    DEBOUNCE_DELAY: 250,
    MAX_AUTOCOMPLETE_RESULTS: 6,
    MAX_FEED_ITEMS_PER_PAGE: 5,
    AUDIO_ENABLED: true
  };

  // Mock Database con datos enriquecidos
  const INITIAL_DATABASE = [
    {
      id: 'item-1',
      title: 'Midnight City',
      artist: 'M83',
      type: 'cancion',
      badgeClass: 'badge-cancion',
      badgeText: 'Canción',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      followers: '85.2K oyentes',
      year: '2011',
      genre: 'Synthwave / Electronic'
    },
    {
      id: 'item-2',
      title: 'Random Access Memories',
      artist: 'Daft Punk',
      type: 'album',
      badgeClass: 'badge-album',
      badgeText: 'Álbum',
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
      followers: '1.2M oyentes',
      year: '2013',
      genre: 'French House / Disco'
    },
    {
      id: 'item-3',
      title: 'The Weeknd',
      artist: 'Artista Principal',
      type: 'artista',
      badgeClass: 'badge-artista',
      badgeText: 'Artista',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      followers: '4.5M oyentes',
      year: 'Activo desde 2010',
      genre: 'R&B / Synthpop'
    },
    {
      id: 'item-4',
      title: 'After Hours',
      artist: 'The Weeknd',
      type: 'album',
      badgeClass: 'badge-album',
      badgeText: 'Álbum',
      img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
      followers: '980K oyentes',
      year: '2020',
      genre: 'Synthpop'
    },
    {
      id: 'item-5',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      type: 'cancion',
      badgeClass: 'badge-cancion',
      badgeText: 'Canción',
      img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
      followers: '3.1M oyentes',
      year: '2019',
      genre: 'Synth-wave'
    },
    {
      id: 'item-6',
      title: 'Kavinsky',
      artist: 'Artista Electrónico',
      type: 'artista',
      badgeClass: 'badge-artista',
      badgeText: 'Artista',
      img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
      followers: '420K oyentes',
      year: 'Activo desde 2006',
      genre: 'Outrun / Electro House'
    },
    {
      id: 'item-7',
      title: 'Nightcall',
      artist: 'Kavinsky',
      type: 'cancion',
      badgeClass: 'badge-cancion',
      badgeText: 'Canción',
      img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
      followers: '610K oyentes',
      year: '2010',
      genre: 'Synthwave'
    }
  ];

  // Estado global de la aplicación
  const state = {
    database: [...INITIAL_DATABASE],
    activeFilter: 'Todos',
    searchQuery: '',
    selectedItem: INITIAL_DATABASE[0],
    rating: 2.5,
    isFavorite: false,
    favorites: new Set(),
    reviews: [],
    currentPage: 1,
    audioCtx: null
  };

  // ==========================================================================
  // 2. SERVICIO DE AUDIO WEBAUDIO (Efectos de sonido Neón)
  // ==========================================================================
  class SoundEffects {
    static init() {
      if (!CONFIG.AUDIO_ENABLED) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          state.audioCtx = new AudioContext();
        }
      } catch (e) {
        console.warn('Web Audio API no soportado.');
      }
    }

    static playClick() {
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, state.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, state.audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, state.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, state.audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.05);
    }

    static playPop() {
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, state.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, state.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, state.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.08);
    }
  }

  // ==========================================================================
  // 3. SISTEMA DE NOTIFICACIONES TOAST (UI Feedback)
  // ==========================================================================
  class ToastManager {
    static container = null;

    static init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'neon-toast-container';
        Object.assign(this.container.style, {
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: '9999',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none'
        });
        document.body.appendChild(this.container);
      }
    }

    static show(message, type = 'info') {
      this.init();
      const toast = document.createElement('div');
      toast.className = `neon-toast neon-toast-${type}`;
      
      const colors = {
        info: '#00d2ff',
        success: '#34d399',
        error: '#ff5f5f'
      };

      Object.assign(toast.style, {
        background: 'rgba(18, 22, 28, 0.95)',
        border: `1px solid ${colors[type] || colors.info}`,
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px ${colors[type]}44`,
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        fontSize: '0.88rem',
        fontWeight: '600',
        pointerEvents: 'auto',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      });

      toast.textContent = message;
      this.container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // ==========================================================================
  // 4. STORAGE MANAGER (LOCAL STORAGE PERSISTENCE)
  // ==========================================================================
  class StorageManager {
    static load() {
      try {
        const savedReviews = localStorage.getItem(CONFIG.STORAGE_KEYS.REVIEWS);
        if (savedReviews) {
          state.reviews = JSON.parse(savedReviews);
        }

        const savedFavorites = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
        if (savedFavorites) {
          state.favorites = new Set(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error('Error al cargar LocalStorage:', e);
      }
    }

    static saveReviews() {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.REVIEWS, JSON.stringify(state.reviews));
      } catch (e) {
        console.error('Error al guardar reseñas:', e);
      }
    }

    static saveFavorites() {
      try {
        localStorage.setItem(
          CONFIG.STORAGE_KEYS.FAVORITES,
          JSON.stringify(Array.from(state.favorites))
        );
      } catch (e) {
        console.error('Error al guardar favoritos:', e);
      }
    }
  }

  // ==========================================================================
  // 5. HELPER UTILITIES
  // ==========================================================================
  const Utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, (tag) => {
        const chars = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        };
        return chars[tag] || tag;
      });
    },

    formatTimeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return 'Hace un momento';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min${minutes > 1 ? 's' : ''}`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
      const days = Math.floor(hours / 24);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  // ==========================================================================
  // 6. MODULE: DROPDOWN DE FILTROS & ACCESIBILIDAD
  // ==========================================================================
  class FilterDropdownModule {
    constructor() {
      this.wrapper = document.querySelector('.filter-dropdown-wrapper');
      this.btn = document.querySelector('.filter-btn');
      this.menu = document.querySelector('.filter-dropdown-menu');
      this.items = document.querySelectorAll('.filter-item');
      this.label = this.btn ? this.btn.querySelector('span:first-child') : null;

      this.init();
    }

    init() {
      if (!this.btn || !this.menu) return;

      this.btn.setAttribute('aria-haspopup', 'true');
      this.btn.setAttribute('aria-expanded', 'false');

      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      this.items.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this.select(item);
        });
      });

      document.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }

    toggle() {
      const isVisible = this.menu.style.display === 'flex';
      if (isVisible) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      SoundEffects.playClick();
      this.menu.style.display = 'flex';
      this.btn.setAttribute('aria-expanded', 'true');
    }

    close() {
      if (this.menu) {
        this.menu.style.display = 'none';
        this.btn.setAttribute('aria-expanded', 'false');
      }
    }

    select(item) {
      this.items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');

      const text = item.textContent.trim();
      state.activeFilter = text;

      if (this.label) this.label.textContent = text;
      this.close();

      // Notificar al buscador
      window.dispatchEvent(new CustomEvent('neon:filter-changed', { detail: { filter: text } }));
      ToastManager.show(`Filtro aplicado: ${text}`, 'info');
    }
  }

  // ==========================================================================
  // 7. MODULE: BÚSQUEDA Y AUTOCOMPLETADO INTERACTIVO
  // ==========================================================================
  class SearchModule {
    constructor() {
      this.input = document.querySelector('.search-input-field');
      this.clearBtn = document.querySelector('.clear-search-btn');
      this.submitBtn = document.querySelector('.search-submit-btn');
      this.autocomplete = document.querySelector('.autocomplete-dropdown');
      this.resultsGrid = document.querySelector('.results-grid');

      this.debouncedSearch = Utils.debounce(() => this.executeSearch(), CONFIG.DEBOUNCE_DELAY);
      this.init();
    }

    init() {
      if (!this.input) return;

      this.input.addEventListener('input', () => this.debouncedSearch());

      this.input.addEventListener('focus', () => {
        if (this.input.value.trim().length > 0) {
          this.executeSearch();
        }
      });

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => this.clear());
      }

      if (this.submitBtn) {
        this.submitBtn.addEventListener('click', () => {
          SoundEffects.playClick();
          this.executeSearch();
          this.hideAutocomplete();
        });
      }

      window.addEventListener('neon:filter-changed', () => {
        this.executeSearch();
      });

      // Primer renderizado con base de datos completa
      this.renderResultsGrid(state.database);
    }

    clear() {
      SoundEffects.playClick();
      this.input.value = '';
      state.searchQuery = '';
      this.hideAutocomplete();
      this.renderResultsGrid(state.database);
      this.input.focus();
    }

    hideAutocomplete() {
      if (this.autocomplete) {
        this.autocomplete.style.display = 'none';
      }
    }

    executeSearch() {
      const query = this.input.value.trim().toLowerCase();
      state.searchQuery = query;

      let filtered = [...state.database];

      // Aplicar filtro por categoría
      if (state.activeFilter !== 'Todos') {
        const typeMap = {
          'Álbumes': 'album',
          'Canciones': 'cancion',
          'Artistas': 'artista'
        };
        const targetType = typeMap[state.activeFilter];
        filtered = filtered.filter((item) => item.type === targetType);
      }

      // Aplicar búsqueda textual
      if (query.length > 0) {
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.artist.toLowerCase().includes(query) ||
            (item.genre && item.genre.toLowerCase().includes(query))
        );
        this.renderAutocomplete(filtered);
      } else {
        this.hideAutocomplete();
      }

      this.renderResultsGrid(filtered);
    }

    renderAutocomplete(items) {
      if (!this.autocomplete) return;

      if (items.length === 0) {
        this.hideAutocomplete();
        return;
      }

      const sliced = items.slice(0, CONFIG.MAX_AUTOCOMPLETE_RESULTS);

      this.autocomplete.innerHTML = sliced
        .map(
          (item) => `
        <div class="autocomplete-item" data-id="${item.id}" role="option">
          <div class="autocomplete-left">
            <img src="${item.img}" alt="${Utils.escapeHTML(item.title)}" class="autocomplete-thumb" />
            <div class="autocomplete-info">
              <strong>${Utils.escapeHTML(item.title)}</strong>
              <span>${Utils.escapeHTML(item.artist)}</span>
            </div>
          </div>
          <span class="card-badge ${item.badgeClass}">${item.badgeText}</span>
        </div>
      `
        )
        .join('');

      this.autocomplete.style.display = 'block';

      this.autocomplete.querySelectorAll('.autocomplete-item').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = el.getAttribute('data-id');
          const found = state.database.find((i) => i.id === id);
          if (found) {
            window.dispatchEvent(
              new CustomEvent('neon:item-selected', { detail: { item: found } })
            );
          }
          this.hideAutocomplete();
        });
      });
    }

    renderResultsGrid(items) {
      if (!this.resultsGrid) return;

      if (items.length === 0) {
        this.resultsGrid.innerHTML = `
          <div style="text-align: center; padding: 40px 10px; color: #64748b;">
            <p style="margin: 0; font-size: 0.95rem;">No se encontraron resultados.</p>
            <small style="color: #475569;">Intenta cambiar el término de búsqueda o el filtro.</small>
          </div>
        `;
        return;
      }

      this.resultsGrid.innerHTML = items
        .map((item) => {
          const isSelected = state.selectedItem && state.selectedItem.id === item.id;
          return `
          <div class="result-card ${isSelected ? 'selected' : ''}" data-id="${item.id}">
            <img src="${item.img}" alt="${Utils.escapeHTML(item.title)}" class="result-card-img" />
            <div class="result-card-info">
              <div class="result-card-header">
                <h3>${Utils.escapeHTML(item.title)}</h3>
                <span class="card-badge ${item.badgeClass}">${item.badgeText}</span>
              </div>
              <p>${Utils.escapeHTML(item.artist)}</p>
            </div>
          </div>
        `;
        })
        .join('');

      this.resultsGrid.querySelectorAll('.result-card').forEach((card) => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          const found = state.database.find((i) => i.id === id);
          if (found) {
            window.dispatchEvent(
              new CustomEvent('neon:item-selected', { detail: { item: found } })
            );
          }
        });
      });
    }
  }

  // ==========================================================================
  // 8. MODULE: SELECCIÓN & PREVIEW FORMULARIO
  // ==========================================================================
  class PreviewFormModule {
    constructor() {
      this.previewCard = document.querySelector('.selected-preview-card');
      this.previewImg = document.querySelector('.selected-preview-img');
      this.previewTitle = document.querySelector('.selected-preview-info h4');
      this.previewArtist = document.querySelector('.selected-preview-info p');
      this.previewFollowers = document.querySelector('.artist-followers');
      this.favoriteBtn = document.querySelector('.favorite-heart-btn');

      this.init();
    }

    init() {
      window.addEventListener('neon:item-selected', (e) => {
        this.updateSelected(e.detail.item);
      });

      if (this.favoriteBtn) {
        this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
      }

      // Render inicial con item por defecto
      if (state.selectedItem) {
        this.updateSelected(state.selectedItem, false);
      }
    }

    updateSelected(item, triggerToast = true) {
      state.selectedItem = item;
      SoundEffects.playClick();

      if (this.previewImg) this.previewImg.src = item.img;
      if (this.previewTitle) this.previewTitle.textContent = item.title;
      if (this.previewArtist) this.previewArtist.textContent = item.artist;
      if (this.previewFollowers) this.previewFollowers.textContent = item.followers;

      // Actualizar estado del corazón
      const isFav = state.favorites.has(item.id);
      state.isFavorite = isFav;
      this.syncFavoriteUI();

      // Notificar al módulo de lista de búsqueda
      window.dispatchEvent(new CustomEvent('neon:state-updated'));

      if (triggerToast) {
        ToastManager.show(`Seleccionado: ${item.title}`, 'info');
      }
    }

    toggleFavorite() {
      if (!state.selectedItem) return;

      const id = state.selectedItem.id;
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
        state.isFavorite = false;
        ToastManager.show('Eliminado de tus favoritos', 'info');
      } else {
        state.favorites.add(id);
        state.isFavorite = true;
        SoundEffects.playPop();
        ToastManager.show('¡Añadido a tus favoritos!', 'success');
      }

      StorageManager.saveFavorites();
      this.syncFavoriteUI();
    }

    syncFavoriteUI() {
      if (!this.favoriteBtn) return;
      if (state.isFavorite) {
        this.favoriteBtn.classList.add('is-favorite');
      } else {
        this.favoriteBtn.classList.remove('is-favorite');
      }
    }
  }

  // ==========================================================================
  // 9. MODULE: STAR RATING INTERACTIVO CON PRECISIÓN DUAL (MEDIAS ESTRELLAS)
  // ==========================================================================
  class RatingModule {
    constructor() {
      this.container = document.querySelector('.star-rating-container');
      this.starBtns = document.querySelectorAll('.star-rating-container .star-btn');
      this.init();
    }

    init() {
      if (!this.container || this.starBtns.length === 0) return;

      this.starBtns.forEach((btn, index) => {
        btn.addEventListener('mousemove', (e) => this.handleHover(e, index));
        btn.addEventListener('click', (e) => this.handleClick(e, index));
      });

      this.container.addEventListener('mouseleave', () => {
        this.render(state.rating);
      });

      // Render inicial
      this.render(state.rating);
    }

    calculateValue(e, index) {
      const btn = this.starBtns[index];
      const rect = btn.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const isHalf = clientX - rect.left < rect.width / 2;
      return index + (isHalf ? 0.5 : 1.0);
    }

    handleHover(e, index) {
      const hoverVal = this.calculateValue(e, index);
      this.render(hoverVal);
    }

    handleClick(e, index) {
      const clickedVal = this.calculateValue(e, index);
      state.rating = clickedVal;
      SoundEffects.playClick();
      this.render(state.rating);
      ToastManager.show(`Calificación: ${state.rating} estrellas`, 'info');
    }

    render(value) {
      this.starBtns.forEach((btn, index) => {
        const starVal = index + 1;
        btn.classList.remove('full', 'half');

        if (value >= starVal) {
          btn.classList.add('full');
        } else if (value >= starVal - 0.5) {
          btn.classList.add('half');
        }
      });
    }
  }

  // ==========================================================================
  // 10. MODULE: REVIEW FORM & FEED CREATOR
  // ==========================================================================
  class ReviewFormModule {
    constructor() {
      this.textarea = document.querySelector('.review-textarea');
      this.submitBtn = document.querySelector('.review-submit-btn');
      this.feedGrid = document.querySelector('.review-cards-grid');

      this.init();
    }

    init() {
      if (!this.submitBtn) return;

      this.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submit();
      });

      // Cargar reseñas previas almacenadas
      this.renderAllReviews();
    }

    submit() {
      if (!this.textarea) return;

      const comment = this.textarea.value.trim();

      if (!comment) {
        ToastManager.show('Escribe una opinión antes de publicar.', 'error');
        this.textarea.focus();
        return;
      }

      if (comment.length < 5) {
        ToastManager.show('Tu opinión debe tener al menos 5 caracteres.', 'error');
        return;
      }

      if (!state.selectedItem) {
        ToastManager.show('Por favor selecciona una obra.', 'error');
        return;
      }

      const newReview = {
        id: 'rev-' + Date.now(),
        itemId: state.selectedItem.id,
        itemTitle: state.selectedItem.title,
        itemArtist: state.selectedItem.artist,
        itemImg: state.selectedItem.img,
        badgeClass: state.selectedItem.badgeClass,
        badgeText: state.selectedItem.badgeText,
        rating: state.rating,
        comment: comment,
        author: 'Usuario Neón',
        createdAt: new Date().toISOString()
      };

      state.reviews.unshift(newReview);
      StorageManager.saveReviews();

      SoundEffects.playPop();
      ToastManager.show('¡Reseña publicada con éxito!', 'success');

      // Limpieza de campo
      this.textarea.value = '';
      state.rating = 5.0;
      window.dispatchEvent(new CustomEvent('neon:rating-reset'));

      // Re-render feed
      this.renderAllReviews();
    }

    renderAllReviews() {
      if (!this.feedGrid) return;

      if (state.reviews.length === 0) {
        // Mantener contenido demo estático si no hay reseñas guardadas en localStorage
        return;
      }

      const cardsHTML = state.reviews
        .map((rev) => this.generateCardHTML(rev))
        .join('');

      this.feedGrid.innerHTML = cardsHTML;
    }

    generateCardHTML(rev) {
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (rev.rating >= i) {
          starsHTML += `<span class="neon-star full">★</span>`;
        } else {
          starsHTML += `<span class="neon-star">★</span>`;
        }
      }

      return `
        <article class="feed-review-card" id="${rev.id}">
          <div class="feed-card-header">
            <img src="${rev.itemImg}" alt="${Utils.escapeHTML(rev.itemTitle)}" class="feed-card-thumb" />
            <div class="feed-card-item-info">
              <h3 class="feed-item-title">${Utils.escapeHTML(rev.itemTitle)}</h3>
              <p class="feed-item-artist">de <strong>${Utils.escapeHTML(rev.itemArtist)}</strong></p>
              <span class="card-badge ${rev.badgeClass}">${rev.badgeText}</span>
            </div>
          </div>

          <div class="feed-card-body">
            <div class="feed-rating-stars">
              ${starsHTML}
              <span class="rating-number">${Number(rev.rating).toFixed(1)}</span>
            </div>
            <p class="feed-comment">"${Utils.escapeHTML(rev.comment)}"</p>
          </div>

          <footer class="feed-card-meta">
            <span>Por <strong>${Utils.escapeHTML(rev.author)}</strong></span>
            <time datetime="${rev.createdAt}">${Utils.formatTimeAgo(rev.createdAt)}</time>
          </footer>
        </article>
      `;
    }
  }

  // ==========================================================================
  // 11. INITIALIZATION BOOTSTRAPPER
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar persistencia
    StorageManager.load();

    // 2. Inicializar subsistemas
    SoundEffects.init();
    ToastManager.init();

    // 3. Inicializar módulos UI
    const filterDropdown = new FilterDropdownModule();
    const searchModule = new SearchModule();
    const previewForm = new PreviewFormModule();
    const ratingModule = new RatingModule();
    const reviewForm = new ReviewFormModule();

    // Eventos globales adicionales
    window.addEventListener('neon:state-updated', () => {
      searchModule.executeSearch();
    });

    window.addEventListener('neon:rating-reset', () => {
      ratingModule.render(state.rating);
    });

    // Permitir inicializar el audio tras la primera interacción del usuario
    const unlockAudio = () => {
      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
  });
})();