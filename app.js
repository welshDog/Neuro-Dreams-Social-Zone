// NeuroDreams Social JavaScript

// Application data from the provided JSON
const appData = {
  users: [
    {"id": 1, "name": "Alex Chen", "type": "ADHD Creator", "coins": 150, "avatar": "👨‍💻", "dreams": 3},
    {"id": 2, "name": "Maya Rodriguez", "type": "Dyslexic Designer", "coins": 230, "avatar": "👩‍🎨", "dreams": 5},
    {"id": 3, "name": "Sam Taylor", "type": "Autistic Developer", "coins": 180, "avatar": "🧑‍💼", "dreams": 4}
  ],
  dreams: [
    {"id": 1, "title": "Build Accessible Game", "author": "Alex Chen", "status": "In Progress", "category": "Tech", "color": "#8B5CF6", "progress": 60},
    {"id": 2, "title": "Launch Art Gallery", "author": "Maya Rodriguez", "status": "Planning", "category": "Creative", "color": "#10B981", "progress": 25},
    {"id": 3, "title": "Write Inclusive Guide", "author": "Sam Taylor", "status": "Research", "category": "Education", "color": "#F59E0B", "progress": 40}
  ],
  circles: [
    {"id": 1, "name": "ADHD Creators", "members": 7, "topic": "Creative Projects", "nextSession": "Today 3PM"},
    {"id": 2, "name": "Dyslexic Devs", "members": 5, "topic": "Accessible Tech", "nextSession": "Tomorrow 10AM"},
    {"id": 3, "name": "Autism Artists", "members": 8, "topic": "Visual Expression", "nextSession": "Sunday 2PM"}
  ],
  posts: [
    {"id": 1, "author": "Alex Chen", "content": "Just finished a 45-minute hyperfocus session! Built the login system for my accessible game. The flow state was incredible! 🚀", "likes": 12, "time": "2 hours ago", "type": "achievement", "avatar": "👨‍💻"},
    {"id": 2, "author": "Maya Rodriguez", "content": "Sharing my latest design principles for neurodivergent-friendly interfaces. Color contrast is KEY! 🎨", "likes": 18, "time": "4 hours ago", "type": "insight", "avatar": "👩‍🎨"},
    {"id": 3, "author": "Sam Taylor", "content": "Research phase complete! Found amazing resources on inclusive documentation. Ready to start writing! 📚", "likes": 9, "time": "6 hours ago", "type": "milestone", "avatar": "🧑‍💼"}
  ],
  focusSessions: [
    {"date": "Today", "completed": 3, "target": 4, "coins": 15},
    {"date": "Yesterday", "completed": 2, "target": 3, "coins": 10},
    {"date": "Tuesday", "completed": 4, "target": 4, "coins": 20}
  ]
};

// Application state
const state = {
  currentUser: appData.users[0],
  currentPage: 'landing',
  currentSection: 'feed',
  theme: 'light',
  fontSize: 'medium',
  animationsEnabled: true,
  dyslexicFont: false,
  focusTimer: null,
  focusTimeLeft: 0,
  focusActive: false,
  quickTimer: null,
  quickTimeLeft: 0
};

// DOM Elements
const elements = {
  // Pages
  landingPage: document.getElementById('landing-page'),
  dashboard: document.getElementById('dashboard'),
  
  // Accessibility controls
  themeToggle: document.getElementById('theme-toggle'),
  fontSizeToggle: document.getElementById('font-size-toggle'),
  animationToggle: document.getElementById('animation-toggle'),
  dyslexiaFontToggle: document.getElementById('dyslexia-font-toggle'),
  
  // Landing page
  signupBtn: document.getElementById('signup-btn'),
  loginBtn: document.getElementById('login-btn'),
  
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  
  // Content sections
  feedSection: document.getElementById('feed-section'),
  dreamsSection: document.getElementById('dreams-section'),
  circlesSection: document.getElementById('circles-section'),
  focusSection: document.getElementById('focus-section'),
  profileSection: document.getElementById('profile-section'),
  
  // Containers
  postsContainer: document.getElementById('posts-container'),
  dreamsContainer: document.getElementById('dreams-container'),
  circlesContainer: document.getElementById('circles-container'),
  
  // Buttons
  newPostBtn: document.getElementById('new-post-btn'),
  newDreamBtn: document.getElementById('new-dream-btn'),
  joinCircleBtn: document.getElementById('join-circle-btn'),
  startFocusBtn: document.getElementById('start-focus-btn'),
  quickFocusBtn: document.getElementById('quick-focus-btn'),
  
  // Modals
  dreamBoardModal: document.getElementById('dream-board-modal'),
  focusModeModal: document.getElementById('focus-mode-modal'),
  closeDreamBoard: document.getElementById('close-dream-board'),
  closeFocusMode: document.getElementById('close-focus-mode'),
  
  // Dream board
  dreamBoardTitle: document.getElementById('dream-board-title'),
  dreamBoardCanvas: document.getElementById('dream-board-canvas'),
  
  // Focus timer
  focusTimerDisplay: document.getElementById('focus-timer-display'),
  focusProgressBar: document.getElementById('focus-progress-bar'),
  pauseTimer: document.getElementById('pause-timer'),
  stopTimer: document.getElementById('stop-timer'),
  
  // Quick timer
  quickTimer: document.getElementById('quick-timer')
};

// Initialize the application
function init() {
  setupEventListeners();
  loadUserPreferences();
  renderInitialContent();
  updateAccessibilityIcons();
}

// Event listeners
function setupEventListeners() {
  // Accessibility controls
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.fontSizeToggle.addEventListener('click', cycleFontSize);
  elements.animationToggle.addEventListener('click', toggleAnimations);
  elements.dyslexiaFontToggle.addEventListener('click', toggleDyslexicFont);
  
  // Landing page
  elements.signupBtn.addEventListener('click', () => showDashboard());
  elements.loginBtn.addEventListener('click', () => showDashboard());
  
  // Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      showSection(section);
    });
  });
  
  // Buttons
  elements.newPostBtn.addEventListener('click', createNewPost);
  elements.newDreamBtn.addEventListener('click', openDreamBoard);
  elements.joinCircleBtn.addEventListener('click', joinCircle);
  elements.startFocusBtn.addEventListener('click', startFocusMode);
  elements.quickFocusBtn.addEventListener('click', startQuickFocus);
  
  // Modals
  elements.closeDreamBoard.addEventListener('click', closeDreamBoard);
  elements.closeFocusMode.addEventListener('click', closeFocusMode);
  elements.pauseTimer.addEventListener('click', pauseFocusTimer);
  elements.stopTimer.addEventListener('click', stopFocusTimer);
  
  // Dream board toolbar
  document.querySelectorAll('[data-note-type]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.target.getAttribute('data-note-type');
      addStickyNote(type);
    });
  });
  
  // Close modals when clicking outside
  elements.dreamBoardModal.addEventListener('click', (e) => {
    if (e.target === elements.dreamBoardModal) closeDreamBoard();
  });
  
  elements.focusModeModal.addEventListener('click', (e) => {
    if (e.target === elements.focusModeModal) closeFocusMode();
  });
}

// Theme management
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-scheme', state.theme);
  document.getElementById('theme-icon').textContent = state.theme === 'light' ? '🌙' : '☀️';
  saveUserPreferences();
}

function cycleFontSize() {
  const sizes = ['small', 'medium', 'large', 'xlarge'];
  const currentIndex = sizes.indexOf(state.fontSize);
  const nextIndex = (currentIndex + 1) % sizes.length;
  state.fontSize = sizes[nextIndex];
  
  // Remove all font size classes
  sizes.forEach(size => document.body.classList.remove(`font-size-${size}`));
  // Add current font size class
  document.body.classList.add(`font-size-${state.fontSize}`);
  saveUserPreferences();
}

function toggleAnimations() {
  state.animationsEnabled = !state.animationsEnabled;
  document.body.classList.toggle('reduced-motion', !state.animationsEnabled);
  document.getElementById('animation-icon').textContent = state.animationsEnabled ? '⚡' : '🐌';
  saveUserPreferences();
}

function toggleDyslexicFont() {
  state.dyslexicFont = !state.dyslexicFont;
  document.body.classList.toggle('dyslexic-font', state.dyslexicFont);
  elements.dyslexiaFontToggle.style.background = state.dyslexicFont ? 'var(--color-primary)' : '';
  elements.dyslexiaFontToggle.style.color = state.dyslexicFont ? 'var(--color-btn-primary-text)' : '';
  saveUserPreferences();
}

function updateAccessibilityIcons() {
  document.getElementById('theme-icon').textContent = state.theme === 'light' ? '🌙' : '☀️';
  document.getElementById('animation-icon').textContent = state.animationsEnabled ? '⚡' : '🐌';
}

// User preferences
function saveUserPreferences() {
  const preferences = {
    theme: state.theme,
    fontSize: state.fontSize,
    animationsEnabled: state.animationsEnabled,
    dyslexicFont: state.dyslexicFont
  };
  // In a real app, this would be saved to a backend
  console.log('Saving preferences:', preferences);
}

function loadUserPreferences() {
  // In a real app, this would load from backend or localStorage
  // For demo purposes, we'll use defaults
  document.documentElement.setAttribute('data-color-scheme', state.theme);
  document.body.classList.add(`font-size-${state.fontSize}`);
}

// Page navigation
function showDashboard() {
  elements.landingPage.classList.add('hidden');
  elements.dashboard.classList.remove('hidden');
  state.currentPage = 'dashboard';
  showSection('feed');
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show selected section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }
  
  // Update navigation
  elements.navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionName) {
      item.classList.add('active');
    }
  });
  
  state.currentSection = sectionName;
}

// Content rendering
function renderInitialContent() {
  renderPosts();
  renderDreams();
  renderCircles();
}

function renderPosts() {
  const postsHTML = appData.posts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <span class="post-avatar">${post.avatar}</span>
        <div>
          <div class="post-author">${post.author}</div>
          <div class="post-time">${post.time}</div>
        </div>
        <div class="post-type-badge post-type-badge--${post.type}">
          ${post.type}
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-actions">
        <div class="post-likes">
          <span>❤️</span>
          <span>${post.likes} likes</span>
        </div>
      </div>
    </div>
  `).join('');
  
  elements.postsContainer.innerHTML = postsHTML;
}

function renderDreams() {
  const dreamsHTML = appData.dreams.map(dream => `
    <div class="dream-card" data-dream-id="${dream.id}">
      <div class="dream-header">
        <div class="dream-title">${dream.title}</div>
        <div class="dream-author">by ${dream.author}</div>
      </div>
      <div class="dream-status status--${dream.status.toLowerCase().replace(' ', '-')}">${dream.status}</div>
      <div class="dream-progress">
        <div class="dream-progress-label">
          <span>Progress</span>
          <span>${dream.progress}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${dream.progress}%; background-color: ${dream.color};"></div>
        </div>
      </div>
    </div>
  `).join('');
  
  elements.dreamsContainer.innerHTML = dreamsHTML;
  
  // Add click listeners to dream cards
  document.querySelectorAll('.dream-card').forEach(card => {
    card.addEventListener('click', () => {
      const dreamId = card.getAttribute('data-dream-id');
      const dream = appData.dreams.find(d => d.id == dreamId);
      openDreamBoard(dream);
    });
  });
}

function renderCircles() {
  const circlesHTML = appData.circles.map(circle => `
    <div class="circle-card">
      <div class="circle-name">${circle.name}</div>
      <div class="circle-topic">${circle.topic}</div>
      <div class="circle-meta">
        <span>${circle.members} members</span>
      </div>
      <div style="color: var(--color-success); font-weight: 500; margin-bottom: 16px;">
        Next session: ${circle.nextSession}
      </div>
      <button class="btn btn--outline btn--sm btn--full-width">Join Session</button>
    </div>
  `).join('');
  
  elements.circlesContainer.innerHTML = circlesHTML;
}

// Interactive features
function createNewPost() {
  const content = prompt('Share your progress or insight:');
  if (content) {
    const newPost = {
      id: appData.posts.length + 1,
      author: state.currentUser.name,
      avatar: state.currentUser.avatar,
      content: content,
      likes: 0,
      time: 'Just now',
      type: 'insight'
    };
    
    appData.posts.unshift(newPost);
    renderPosts();
    
    // Show success message
    setTimeout(() => {
      alert('🎉 Post shared with your neurodivergent community!');
    }, 100);
  }
}

function joinCircle() {
  alert('🤝 Welcome to the Neurodivergent Creators Circle! You\'ll receive notifications about upcoming sessions.');
}

// Dream Board functionality
function openDreamBoard(dream = null) {
  const title = dream ? dream.title : 'New Dream Board';
  elements.dreamBoardTitle.textContent = title;
  elements.dreamBoardCanvas.innerHTML = '';
  
  // Add some sample notes if it's an existing dream
  if (dream) {
    setTimeout(() => {
      addStickyNote('idea', 'Initial concept and research', 50, 50);
      addStickyNote('goal', 'Complete prototype by end of month', 300, 100);
      addStickyNote('progress', `${dream.progress}% complete!`, 150, 200);
    }, 100);
  }
  
  elements.dreamBoardModal.classList.remove('hidden');
}

function closeDreamBoard() {
  elements.dreamBoardModal.classList.add('hidden');
}

function addStickyNote(type, content = '', x = null, y = null) {
  const note = document.createElement('div');
  note.className = `sticky-note sticky-note--${type}`;
  
  // Random position if not specified
  if (x === null) x = Math.random() * (elements.dreamBoardCanvas.offsetWidth - 200);
  if (y === null) y = Math.random() * (elements.dreamBoardCanvas.offsetHeight - 150);
  
  note.style.left = `${x}px`;
  note.style.top = `${y}px`;
  
  const placeholder = {
    'idea': '💡 Enter your idea...',
    'goal': '🎯 Set your goal...',
    'progress': '📈 Track your progress...',
    'complete': '✅ Mark as complete...'
  };
  
  note.innerHTML = `
    <textarea placeholder="${placeholder[type]}">${content}</textarea>
    <button onclick="this.parentElement.remove()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; cursor: pointer;">×</button>
  `;
  
  // Make draggable
  makeDraggable(note);
  
  elements.dreamBoardCanvas.appendChild(note);
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Focus Mode functionality
function startFocusMode() {
  state.focusTimeLeft = 25 * 60; // 25 minutes
  state.focusActive = true;
  elements.focusModeModal.classList.remove('hidden');
  elements.focusTimerDisplay.textContent = formatTime(state.focusTimeLeft);
  elements.focusProgressBar.style.width = '0%';
  
  state.focusTimer = setInterval(() => {
    state.focusTimeLeft--;
    elements.focusTimerDisplay.textContent = formatTime(state.focusTimeLeft);
    
    const progress = ((25 * 60 - state.focusTimeLeft) / (25 * 60)) * 100;
    elements.focusProgressBar.style.width = `${progress}%`;
    
    if (state.focusTimeLeft <= 0) {
      completeFocusSession();
    }
  }, 1000);
}

function startQuickFocus() {
  if (elements.quickFocusBtn.textContent.includes('Start')) {
    state.quickTimeLeft = 25 * 60; // 25 minutes
    elements.quickFocusBtn.textContent = 'Stop';
    elements.quickFocusBtn.classList.remove('btn--secondary');
    elements.quickFocusBtn.classList.add('btn--primary');
    
    state.quickTimer = setInterval(() => {
      state.quickTimeLeft--;
      const timerDisplay = elements.quickTimer.querySelector('.timer-display');
      timerDisplay.textContent = formatTime(state.quickTimeLeft);
      
      if (state.quickTimeLeft <= 0) {
        completeQuickFocus();
      }
    }, 1000);
  } else {
    stopQuickFocus();
  }
}

function pauseFocusTimer() {
  if (state.focusTimer) {
    clearInterval(state.focusTimer);
    state.focusTimer = null;
    elements.pauseTimer.textContent = 'Resume';
  } else {
    state.focusTimer = setInterval(() => {
      state.focusTimeLeft--;
      elements.focusTimerDisplay.textContent = formatTime(state.focusTimeLeft);
      
      const progress = ((25 * 60 - state.focusTimeLeft) / (25 * 60)) * 100;
      elements.focusProgressBar.style.width = `${progress}%`;
      
      if (state.focusTimeLeft <= 0) {
        completeFocusSession();
      }
    }, 1000);
    elements.pauseTimer.textContent = 'Pause';
  }
}

function stopFocusTimer() {
  clearInterval(state.focusTimer);
  state.focusTimer = null;
  state.focusActive = false;
  closeFocusMode();
}

function stopQuickFocus() {
  clearInterval(state.quickTimer);
  state.quickTimer = null;
  elements.quickFocusBtn.textContent = 'Start 25min';
  elements.quickFocusBtn.classList.remove('btn--primary');
  elements.quickFocusBtn.classList.add('btn--secondary');
  const timerDisplay = elements.quickTimer.querySelector('.timer-display');
  timerDisplay.textContent = '25:00';
}

function completeFocusSession() {
  clearInterval(state.focusTimer);
  state.focusTimer = null;
  state.focusActive = false;
  
  // Award coins
  state.currentUser.coins += 10;
  updateUserCoins();
  
  // Show completion message
  alert('🎉 Focus session complete! You earned 10 BROski Coins!');
  closeFocusMode();
}

function completeQuickFocus() {
  stopQuickFocus();
  state.currentUser.coins += 5;
  updateUserCoins();
  alert('🎉 Quick focus complete! You earned 5 BROski Coins!');
}

function closeFocusMode() {
  elements.focusModeModal.classList.add('hidden');
  if (state.focusTimer) {
    clearInterval(state.focusTimer);
    state.focusTimer = null;
  }
  state.focusActive = false;
}

function updateUserCoins() {
  const coinsDisplay = document.querySelector('.user-coins');
  coinsDisplay.textContent = `💰 ${state.currentUser.coins} BROski Coins`;
}

// Utility functions
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
  // Alt + T for theme toggle
  if (e.altKey && e.key === 't') {
    e.preventDefault();
    toggleTheme();
  }
  
  // Alt + F for font size
  if (e.altKey && e.key === 'f') {
    e.preventDefault();
    cycleFontSize();
  }
  
  // Alt + A for animations
  if (e.altKey && e.key === 'a') {
    e.preventDefault();
    toggleAnimations();
  }
  
  // Escape to close modals
  if (e.key === 'Escape') {
    if (!elements.dreamBoardModal.classList.contains('hidden')) {
      closeDreamBoard();
    }
    if (!elements.focusModeModal.classList.contains('hidden')) {
      closeFocusMode();
    }
  }
});

// Voice commands (simplified simulation)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    
    if (command.includes('new post')) {
      createNewPost();
    } else if (command.includes('focus mode')) {
      startFocusMode();
    } else if (command.includes('new dream')) {
      openDreamBoard();
    }
  };
  
  // Add voice activation button (optional feature)
  const voiceBtn = document.createElement('button');
  voiceBtn.textContent = '🎤';
  voiceBtn.className = 'btn btn--sm';
  voiceBtn.style.position = 'fixed';
  voiceBtn.style.bottom = '20px';
  voiceBtn.style.right = '20px';
  voiceBtn.style.borderRadius = '50%';
  voiceBtn.style.width = '50px';
  voiceBtn.style.height = '50px';
  voiceBtn.onclick = () => recognition.start();
  document.body.appendChild(voiceBtn);
}

// Simulate real-time updates (like new posts from other users)
function simulateRealTimeUpdates() {
  const encouragements = [
    "Maya just completed a 30-minute focus session! 🎯",
    "Sam shared a new accessibility tip in ADHD Creators circle! 💡",
    "Alex earned 25 BROski Coins today! Keep it up! 🪙",
    "New member joined Dyslexic Devs circle! Welcome! 👋"
  ];
  
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every 30 seconds
      const message = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      // Create notification
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.position = 'fixed';
      notification.style.top = '100px';
      notification.style.right = '20px';
      notification.style.background = 'var(--color-success)';
      notification.style.color = 'white';
      notification.style.padding = '12px 16px';
      notification.style.borderRadius = '8px';
      notification.style.zIndex = '1001';
      notification.style.maxWidth = '300px';
      notification.style.boxShadow = 'var(--shadow-lg)';
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 4000);
    }
  }, 30000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  setTimeout(simulateRealTimeUpdates, 5000); // Start real-time updates after 5 seconds
});

// Export for potential testing
window.NeuroDreamsApp = {
  state,
  toggleTheme,
  startFocusMode,
  openDreamBoard,
  addStickyNote
};