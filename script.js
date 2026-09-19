// ========== TRACK DATA ==========
const tracks = [
  { id: 1,  title: "Ambient Dreams",     artist: "SoundHelix",  duration: "6:10", genre: "chill",  color: "#2d8a6e", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2,  title: "Electric Pulse",     artist: "SoundHelix",  duration: "7:45", genre: "energy", color: "#c95d1e", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3,  title: "Midnight Journey",   artist: "SoundHelix",  duration: "5:30", genre: "focus",  color: "#5a3fbf", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4,  title: "Sunset Groove",      artist: "SoundHelix",  duration: "8:03", genre: "chill",  color: "#d97706", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5,  title: "Neon Lights",        artist: "SoundHelix",  duration: "4:15", genre: "energy", color: "#e04080", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6,  title: "Deep Blue",          artist: "SoundHelix",  duration: "9:20", genre: "focus",  color: "#2563eb", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: 7,  title: "Cosmic Flow",        artist: "SoundHelix",  duration: "6:55", genre: "chill",  color: "#7c3aed", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: 8,  title: "Thunder Road",       artist: "SoundHelix",  duration: "5:48", genre: "energy", color: "#dc2626", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 9,  title: "Crystal Waves",      artist: "SoundHelix",  duration: "7:12", genre: "focus",  color: "#0891b2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: 10, title: "Golden Hour",        artist: "SoundHelix",  duration: "6:30", genre: "chill",  color: "#ca8a04", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { id: 11, title: "Starlight Express",  artist: "SoundHelix",  duration: "8:10", genre: "energy", color: "#9333ea", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  { id: 12, title: "Silent Forest",      artist: "SoundHelix",  duration: "5:05", genre: "focus",  color: "#16a34a", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
];

const genres = [
  { name: "Chill",       key: "chill",    icon: "spa",           bg: "linear-gradient(135deg, #1a4a5e, #2d8a6e)" },
  { name: "Energy",      key: "energy",   icon: "bolt",          bg: "linear-gradient(135deg, #8a3a2d, #c95d1e)" },
  { name: "Focus",       key: "focus",    icon: "psychology",    bg: "linear-gradient(135deg, #2d2a6e, #5a3fbf)" },
  { name: "Electronic",  key: "energy",   icon: "electric_bolt", bg: "linear-gradient(135deg, #4a1a6e, #9333ea)" },
  { name: "Acoustic",    key: "chill",    icon: "music_note",    bg: "linear-gradient(135deg, #5a4a1a, #ca8a04)" },
  { name: "Ambient",     key: "focus",    icon: "cloud",         bg: "linear-gradient(135deg, #1a3a5e, #2563eb)" },
];

// ========== STATE ==========
let currentTrackIndex = -1;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let favorites = new Set();
let isDark = true;
let currentGenreFilter = null;

const audio = new Audio();
audio.volume = 0.8;
audio.preload = 'metadata';

// ========== DOM HELPERS ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ========== DOM ELEMENTS ==========
const playBtn        = $('#playBtn');
const playIcon       = $('#playIcon');
const prevBtn        = $('#prevBtn');
const nextBtn        = $('#nextBtn');
const shuffleBtn     = $('#shuffleBtn');
const repeatBtn      = $('#repeatBtn');
const progressTrack  = $('#progressTrack');
const progressFill   = $('#progressFill');
const currentTimeEl  = $('#currentTime');
const durationEl     = $('#duration');
const volumeTrack    = $('#volumeTrack');
const volumeFill     = $('#volumeFill');
const volumeIcon     = $('#volumeIcon');
const muteBtn        = $('#muteBtn');
const npbTitle       = $('#npbTitle');
const npbArtist      = $('#npbArtist');
const npbDisc        = $('#npbDisc');
const npbFavBtn      = $('#npbFavBtn');
const npbFavIcon     = $('#npbFavIcon');
const searchInput    = $('#searchInput');
const searchClear    = $('#searchClear');
const queueBtn       = $('#queueBtn');
const queuePanel     = $('#queuePanel');
const queueOverlay   = $('#queueOverlay');
const closeQueue     = $('#closeQueue');
const queueList      = $('#queueList');
const sidebar        = $('#sidebar');
const sidebarOverlay = $('#sidebarOverlay');
const menuToggle     = $('#menuToggle');
const themeToggle    = $('#themeToggle');
const darkModeSwitch = $('#darkModeSwitch');
const favCount       = $('#favCount');
const profileBtn     = $('#profileBtn');
const profileDropdown = $('#profileDropdown');
const toastEl        = $('#toast');

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  setGreeting();
  buildHeroVisualizer();
  renderRecentGrid();
  renderTrendingGrid();
  renderGenreGrid();
  renderAllTracksList();
  renderLibrary();
  renderPlaylistPages();
  updateFavoritesPage();
  updateVolumeUI();
  setupNavigation();
  setupPlayerControls();
  setupDragProgress();
  setupDragVolume();
  setupQueuePanel();
  setupSearch();
  setupTheme();
  setupMobileMenu();
  setupProfile();
  setupSeeAllButtons();
  setupShortcutsButton();
});

// ========== GREETING ==========
function setGreeting() {
  const h = new Date().getHours();
  let greeting;
  if (h < 12) greeting = 'Good Morning ☀️';
  else if (h < 17) greeting = 'Good Afternoon 🌤️';
  else if (h < 21) greeting = 'Good Evening 🎵';
  else greeting = 'Good Night 🌙';
  $('#greetingText').textContent = greeting;
}

// ========== TOAST ==========
let toastTimeout = null;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ========== HERO VISUALIZER ==========
function buildHeroVisualizer() {
  const container = $('#heroVisualizer');
  for (let i = 0; i < 16; i++) {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    const h = 15 + Math.random() * 45;
    bar.style.setProperty('--target-height', h + 'px');
    bar.style.animationDelay = (Math.random() * 1.2) + 's';
    container.appendChild(bar);
  }
}

// ========== RENDER FUNCTIONS ==========

function createTrackCard(track, index) {
  const card = document.createElement('div');
  card.className = 'track-card';
  card.innerHTML = `
    <div class="track-card-art" style="background:${track.color}">
      <span class="material-icons-round card-icon">music_note</span>
      <div class="card-play-overlay">
        <span class="material-icons-round">play_arrow</span>
      </div>
    </div>
    <div class="track-card-title">${track.title}</div>
    <div class="track-card-artist">${track.artist}</div>
  `;
  card.addEventListener('click', () => playTrack(index));
  return card;
}

function createTrackRow(track, index, num) {
  const row = document.createElement('div');
  row.className = 'track-row';
  row.dataset.index = index;
  if (index === currentTrackIndex) row.classList.add('active');

  const isLiked = favorites.has(track.id);
  row.innerHTML = `
    <span class="track-row-num">${num}</span>
    <span class="material-icons-round row-play-icon">${index === currentTrackIndex && isPlaying ? 'pause' : 'play_arrow'}</span>
    <div class="track-row-art" style="background:${track.color}">
      <span class="material-icons-round">music_note</span>
    </div>
    <div class="track-row-info">
      <div class="track-row-title">${track.title}</div>
      <div class="track-row-artist">${track.artist}</div>
    </div>
    <div class="track-row-actions">
      <button class="icon-btn fav-btn ${isLiked ? 'liked' : ''}" data-id="${track.id}" title="${isLiked ? 'Unlike' : 'Like'}">
        <span class="material-icons-round">${isLiked ? 'favorite' : 'favorite_border'}</span>
      </button>
    </div>
    <span class="track-row-duration">${track.duration}</span>
  `;

  row.addEventListener('click', (e) => {
    if (e.target.closest('.fav-btn')) return;
    if (index === currentTrackIndex && isPlaying) {
      audio.pause();
      isPlaying = false;
      updatePlayerUI();
    } else if (index === currentTrackIndex && !isPlaying) {
      audio.play();
      isPlaying = true;
      updatePlayerUI();
    } else {
      playTrack(index);
    }
  });

  const favBtn = row.querySelector('.fav-btn');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  });

  return row;
}

function renderRecentGrid() {
  const grid = $('#recentGrid');
  grid.innerHTML = '';
  tracks.slice(0, 6).forEach((t, i) => grid.appendChild(createTrackCard(t, i)));
}

function renderTrendingGrid() {
  const grid = $('#trendingGrid');
  grid.innerHTML = '';
  tracks.slice(6).forEach((t, i) => grid.appendChild(createTrackCard(t, i + 6)));
}

function renderGenreGrid() {
  const grid = $('#genreGrid');
  grid.innerHTML = '';
  genres.forEach(g => {
    const card = document.createElement('div');
    card.className = 'genre-card';
    card.style.background = g.bg;
    card.innerHTML = `<span class="material-icons-round">${g.icon}</span>${g.name}`;
    card.addEventListener('click', () => filterByGenre(g.key, g.name));
    grid.appendChild(card);
  });
}

function renderAllTracksList(filter) {
  const list = $('#allTracksList');
  list.innerHTML = '';
  const filtered = filter ? tracks.filter(t => t.genre === filter) : tracks;
  filtered.forEach((t, i) => {
    const idx = tracks.indexOf(t);
    list.appendChild(createTrackRow(t, idx, i + 1));
  });
}

function filterByGenre(genreKey, genreName) {
  currentGenreFilter = genreKey;
  $('#exploreListTitle').textContent = genreName + ' Tracks';
  $('#clearGenreFilter').style.display = 'inline';
  renderAllTracksList(genreKey);
  showToast(`Showing ${genreName} tracks`);
}

function renderLibrary() {
  const statsContainer = $('#libraryStats');
  statsContainer.innerHTML = `
    <div class="stat-card"><div class="stat-num">${tracks.length}</div><div class="stat-label">Total Songs</div></div>
    <div class="stat-card"><div class="stat-num">${genres.length}</div><div class="stat-label">Genres</div></div>
    <div class="stat-card"><div class="stat-num">${favorites.size}</div><div class="stat-label">Favorites</div></div>
  `;
  const list = $('#libraryList');
  list.innerHTML = '';
  tracks.forEach((t, i) => list.appendChild(createTrackRow(t, i, i + 1)));
}

function renderPlaylistPages() {
  const mapping = {
    chill: '#chillList',
    energy: '#energyList',
    focus: '#focusList',
  };

  Object.entries(mapping).forEach(([genre, selector]) => {
    const list = $(selector);
    list.innerHTML = '';
    const filtered = tracks.filter(t => t.genre === genre);
    filtered.forEach((t, i) => {
      const idx = tracks.indexOf(t);
      list.appendChild(createTrackRow(t, idx, i + 1));
    });
  });
}

function updateFavoritesPage() {
  const list = $('#favoritesList');
  const empty = $('#emptyFavorites');
  list.innerHTML = '';

  const favTracks = tracks.filter(t => favorites.has(t.id));
  if (favTracks.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    favTracks.forEach((t, i) => {
      const idx = tracks.indexOf(t);
      list.appendChild(createTrackRow(t, idx, i + 1));
    });
  }

  favCount.textContent = favorites.size;
  if (favorites.size === 0) {
    favCount.style.display = 'none';
  } else {
    favCount.style.display = '';
  }
}

function refreshAllLists() {
  renderAllTracksList(currentGenreFilter);
  renderLibrary();
  renderPlaylistPages();
  updateFavoritesPage();
  updateActiveRows();
  renderQueue();
}

// ========== PLAYER ==========

function playTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  audio.src = track.src;
  audio.play().catch(() => {});
  isPlaying = true;
  updatePlayerUI();
  showToast(`Now playing: ${track.title}`);
}

function updatePlayerUI() {
  const track = tracks[currentTrackIndex];
  if (!track) return;

  npbTitle.textContent = track.title;
  npbArtist.textContent = track.artist;
  playIcon.textContent = isPlaying ? 'pause' : 'play_arrow';

  if (isPlaying) {
    npbDisc.classList.add('spinning');
  } else {
    npbDisc.classList.remove('spinning');
  }

  const isLiked = favorites.has(track.id);
  npbFavIcon.textContent = isLiked ? 'favorite' : 'favorite_border';
  npbFavBtn.classList.toggle('liked', isLiked);

  updateActiveRows();
  renderQueue();
}

function updateActiveRows() {
  $$('.track-row').forEach(row => {
    const idx = parseInt(row.dataset.index);
    row.classList.toggle('active', idx === currentTrackIndex);
    const icon = row.querySelector('.row-play-icon');
    if (icon) {
      icon.textContent = (idx === currentTrackIndex && isPlaying) ? 'pause' : 'play_arrow';
    }
  });
}

function setupPlayerControls() {
  playBtn.addEventListener('click', () => {
    if (currentTrackIndex === -1) { playTrack(0); return; }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updatePlayerUI();
  });

  prevBtn.addEventListener('click', () => {
    if (currentTrackIndex === -1) { playTrack(0); return; }
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    let idx = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(idx);
  });

  nextBtn.addEventListener('click', () => nextTrack());

  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    showToast(isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
  });

  repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const icons = ['repeat', 'repeat', 'repeat_one'];
    const labels = ['Repeat OFF', 'Repeat ALL', 'Repeat ONE'];
    repeatBtn.querySelector('.material-icons-round').textContent = icons[repeatMode];
    repeatBtn.classList.toggle('active', repeatMode > 0);
    showToast(labels[repeatMode]);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || isDraggingProgress) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (repeatMode === 2) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      nextTrack();
    }
  });

  // Click on progress bar
  progressTrack.addEventListener('click', (e) => {
    if (isDraggingProgress) return;
    seekFromEvent(e);
  });

  // Volume click
  volumeTrack.addEventListener('click', (e) => {
    if (isDraggingVolume) return;
    setVolumeFromEvent(e);
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateVolumeUI();
    showToast(audio.muted ? 'Muted' : 'Unmuted');
  });

  npbFavBtn.addEventListener('click', () => {
    if (currentTrackIndex >= 0) {
      toggleFavorite(tracks[currentTrackIndex].id);
    }
  });
}

function nextTrack() {
  if (currentTrackIndex === -1) { playTrack(0); return; }

  let idx;
  if (isShuffle) {
    idx = Math.floor(Math.random() * tracks.length);
  } else {
    idx = (currentTrackIndex + 1) % tracks.length;
  }

  if (repeatMode === 0 && idx === 0 && !isShuffle) {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updatePlayerUI();
    return;
  }

  playTrack(idx);
}

// ========== DRAG PROGRESS ==========
let isDraggingProgress = false;

function setupDragProgress() {
  progressTrack.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    progressTrack.classList.add('dragging');
    seekFromEvent(e);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingProgress) return;
    seekFromEvent(e);
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingProgress) {
      isDraggingProgress = false;
      progressTrack.classList.remove('dragging');
    }
  });

  // Touch support
  progressTrack.addEventListener('touchstart', (e) => {
    isDraggingProgress = true;
    progressTrack.classList.add('dragging');
    seekFromTouch(e);
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDraggingProgress) return;
    seekFromTouch(e);
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (isDraggingProgress) {
      isDraggingProgress = false;
      progressTrack.classList.remove('dragging');
    }
  });
}

function seekFromEvent(e) {
  if (!audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.currentTime = pct * audio.duration;
  progressFill.style.width = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

function seekFromTouch(e) {
  if (!audio.duration || !e.touches[0]) return;
  const rect = progressTrack.getBoundingClientRect();
  let pct = (e.touches[0].clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.currentTime = pct * audio.duration;
  progressFill.style.width = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

// ========== DRAG VOLUME ==========
let isDraggingVolume = false;

function setupDragVolume() {
  volumeTrack.addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    volumeTrack.classList.add('dragging');
    setVolumeFromEvent(e);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingVolume) return;
    setVolumeFromEvent(e);
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingVolume) {
      isDraggingVolume = false;
      volumeTrack.classList.remove('dragging');
    }
  });

  // Touch support
  volumeTrack.addEventListener('touchstart', (e) => {
    isDraggingVolume = true;
    volumeTrack.classList.add('dragging');
    setVolumeFromTouch(e);
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDraggingVolume) return;
    setVolumeFromTouch(e);
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (isDraggingVolume) {
      isDraggingVolume = false;
      volumeTrack.classList.remove('dragging');
    }
  });
}

function setVolumeFromEvent(e) {
  const rect = volumeTrack.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.volume = pct;
  audio.muted = false;
  updateVolumeUI();
}

function setVolumeFromTouch(e) {
  if (!e.touches[0]) return;
  const rect = volumeTrack.getBoundingClientRect();
  let pct = (e.touches[0].clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.volume = pct;
  audio.muted = false;
  updateVolumeUI();
}

function updateVolumeUI() {
  const vol = audio.muted ? 0 : audio.volume;
  volumeFill.style.width = (vol * 100) + '%';
  if (audio.muted || vol === 0) volumeIcon.textContent = 'volume_off';
  else if (vol < 0.5) volumeIcon.textContent = 'volume_down';
  else volumeIcon.textContent = 'volume_up';
}

function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ========== FAVORITES ==========
function toggleFavorite(trackId) {
  const track = tracks.find(t => t.id === trackId);
  if (favorites.has(trackId)) {
    favorites.delete(trackId);
    showToast(`Removed "${track.title}" from favorites`);
  } else {
    favorites.add(trackId);
    showToast(`Added "${track.title}" to favorites`);
  }
  refreshAllLists();
  updatePlayerUI();
}

// ========== QUEUE ==========
function setupQueuePanel() {
  queueBtn.addEventListener('click', () => {
    const isOpen = queuePanel.classList.contains('open');
    if (isOpen) {
      closeQueuePanel();
    } else {
      queuePanel.classList.add('open');
      queueOverlay.classList.add('show');
      queueBtn.classList.add('active');
      renderQueue();
    }
  });

  closeQueue.addEventListener('click', closeQueuePanel);
  queueOverlay.addEventListener('click', closeQueuePanel);
}

function closeQueuePanel() {
  queuePanel.classList.remove('open');
  queueOverlay.classList.remove('show');
  queueBtn.classList.remove('active');
}

function renderQueue() {
  queueList.innerHTML = '';
  tracks.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'queue-item' + (i === currentTrackIndex ? ' current' : '');
    item.innerHTML = `
      <span class="queue-item-num">${i + 1}</span>
      <div class="queue-item-info">
        <div class="queue-item-title">${t.title}</div>
        <div class="queue-item-artist">${t.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      playTrack(i);
    });
    queueList.appendChild(item);
  });

  // Scroll current track into view in queue
  const currentItem = queueList.querySelector('.current');
  if (currentItem) {
    currentItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ========== SEARCH ==========
function setupSearch() {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    searchClear.style.display = q ? 'flex' : 'none';

    if (q.length === 0) {
      // Go back to previous page or home
      const activePage = $('.page.active');
      if (activePage && activePage.id === 'page-search') {
        switchPage('home');
        $$('.nav-item').forEach(n => n.classList.remove('active'));
        $(`.nav-item[data-page="home"]`).classList.add('active');
      }
      return;
    }

    // Switch to search results page
    switchPage('search');
    $$('.nav-item').forEach(n => n.classList.remove('active'));

    const lower = q.toLowerCase();
    const results = tracks.filter(t =>
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      t.genre.toLowerCase().includes(lower)
    );

    const list = $('#searchResultsList');
    const empty = $('#emptySearch');
    list.innerHTML = '';

    $('#searchResultsSubtitle').textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`;

    if (results.length === 0) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      results.forEach((t, i) => {
        const idx = tracks.indexOf(t);
        list.appendChild(createTrackRow(t, idx, i + 1));
      });
    }
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // Keyboard shortcut: Ctrl+K to focus search
  document.addEventListener('keydown', (e) => {
    const isTyping = document.activeElement === searchInput || document.activeElement.tagName === 'INPUT';

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      return;
    }

    // Escape to clear search or close shortcuts help
    if (e.key === 'Escape') {
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        searchInput.dispatchEvent(new Event('input'));
      }
      const helpModal = $('#shortcutsHelp');
      if (helpModal && helpModal.classList.contains('open')) {
        helpModal.classList.remove('open');
      }
      return;
    }

    // All shortcuts below only work when NOT typing in an input
    if (isTyping) return;

    // Space — play/pause
    if (e.key === ' ') {
      e.preventDefault();
      playBtn.click();
    }

    // ArrowRight — next track
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }

    // ArrowLeft — previous track
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    }

    // ArrowUp — volume up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      audio.volume = Math.min(1, audio.volume + 0.1);
      audio.muted = false;
      updateVolumeUI();
    }

    // ArrowDown — volume down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      audio.volume = Math.max(0, audio.volume - 0.1);
      updateVolumeUI();
    }

    // M — mute/unmute
    if (e.key === 'm' || e.key === 'M') {
      muteBtn.click();
    }

    // S — toggle shuffle
    if (e.key === 's' || e.key === 'S') {
      shuffleBtn.click();
    }

    // R — toggle repeat
    if (e.key === 'r' || e.key === 'R') {
      repeatBtn.click();
    }

    // ? — show keyboard shortcuts help
    if (e.key === '?') {
      toggleShortcutsHelp();
    }
  });
}

// ========== NAVIGATION ==========
function setupNavigation() {
  $$('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      switchPage(page);

      $$('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Close mobile sidebar
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');

      // Clear search when navigating
      searchInput.value = '';
      searchClear.style.display = 'none';

      // Scroll page content to top
      $('#pageContent').scrollTop = 0;
    });
  });

  // Clear genre filter button
  $('#clearGenreFilter').addEventListener('click', () => {
    currentGenreFilter = null;
    $('#exploreListTitle').textContent = 'All Tracks';
    $('#clearGenreFilter').style.display = 'none';
    renderAllTracksList();
    showToast('Filter cleared');
  });
}

function switchPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = $(`#page-${pageId}`);
  if (target) target.classList.add('active');

  // Scroll to top on page switch
  $('#pageContent').scrollTop = 0;
}

// ========== SEE ALL BUTTONS ==========
function setupSeeAllButtons() {
  $$('.see-all-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      switchPage(target);
      $$('.nav-item').forEach(n => n.classList.remove('active'));
      const navItem = $(`.nav-item[data-page="${target}"]`);
      if (navItem) navItem.classList.add('active');
    });
  });
}

// ========== THEME ==========
function setupTheme() {
  themeToggle.addEventListener('click', toggleTheme);
  darkModeSwitch.addEventListener('change', (e) => {
    isDark = e.target.checked;
    document.body.classList.toggle('light-theme', !isDark);
    themeToggle.querySelector('.material-icons-round').textContent = isDark ? 'dark_mode' : 'light_mode';
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
  });
}

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light-theme', !isDark);
  themeToggle.querySelector('.material-icons-round').textContent = isDark ? 'dark_mode' : 'light_mode';
  darkModeSwitch.checked = isDark;
  showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
}

// ========== MOBILE MENU ==========
function setupMobileMenu() {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
  });
}

// ========== PROFILE ==========
function setupProfile() {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      profileDropdown.classList.remove('open');
    }
  });

  // Profile menu items
  $('#profileEditBtn').addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    showToast('Profile editing coming soon!');
  });

  $('#profileUpgradeBtn').addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    showToast('Premium upgrade coming soon!');
  });

  // Settings link in profile dropdown
  const settingsLink = profileDropdown.querySelector('[data-page="settings"]');
  if (settingsLink) {
    settingsLink.addEventListener('click', () => {
      profileDropdown.classList.remove('open');
      switchPage('settings');
      $$('.nav-item').forEach(n => n.classList.remove('active'));
      const navItem = $(`.nav-item[data-page="settings"]`);
      if (navItem) navItem.classList.add('active');
    });
  }
}

// ========== KEYBOARD SHORTCUTS HELP ==========
function toggleShortcutsHelp() {
  let modal = $('#shortcutsHelp');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'shortcutsHelp';
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
      <div class="shortcuts-modal-content">
        <div class="shortcuts-modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button class="icon-btn shortcuts-close">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="shortcuts-list">
          <div class="shortcut-item"><kbd>Space</kbd><span>Play / Pause</span></div>
          <div class="shortcut-item"><kbd>←</kbd><span>Previous Track</span></div>
          <div class="shortcut-item"><kbd>→</kbd><span>Next Track</span></div>
          <div class="shortcut-item"><kbd>↑</kbd><span>Volume Up</span></div>
          <div class="shortcut-item"><kbd>↓</kbd><span>Volume Down</span></div>
          <div class="shortcut-item"><kbd>M</kbd><span>Mute / Unmute</span></div>
          <div class="shortcut-item"><kbd>S</kbd><span>Toggle Shuffle</span></div>
          <div class="shortcut-item"><kbd>R</kbd><span>Toggle Repeat</span></div>
          <div class="shortcut-item"><kbd>Ctrl+K</kbd><span>Search</span></div>
          <div class="shortcut-item"><kbd>Esc</kbd><span>Close / Clear</span></div>
          <div class="shortcut-item"><kbd>?</kbd><span>Show This Help</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.shortcuts-close').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
  modal.classList.toggle('open');
}

// ========== SHORTCUTS BUTTON ==========
function setupShortcutsButton() {
  const btn = $('#shortcutsBtn');
  if (btn) {
    btn.addEventListener('click', toggleShortcutsHelp);
  }
}
