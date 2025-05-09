const $ = (id) => document.getElementById(id);

// Elements
const nameForm = $('name-form');
const nameInput = $('name-input');
const userDisplay = $('user-display');
const userNameDisplay = $('user-name-display');
const editNameBtn = $('edit-name-btn');
const taskForm = $('task-form');
const taskInput = $('task-input');
const taskList = $('task-list');
const emptyState = $('empty-state');
const taskStats = $('task-stats');
const totalTasksEl = $('total-tasks');
const completedTasksEl = $('completed-tasks');
const completionPercentageEl = $('completion-percentage');
const contactForm = $('contact-form');
const contactSuccess = $('contact-success');

let tasks = [];
let userName = '';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  setupEventListeners();
  renderUI();
});

function loadUserData() {
  userName = localStorage.getItem('userName') || '';
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach(task => task.createdAt = new Date(task.createdAt));
}

function saveData() {
  localStorage.setItem('userName', userName);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function setupEventListeners() {
  nameForm.onsubmit = (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
      userName = name;
      saveData();
      renderUI();
    }
  };

  editNameBtn.onclick = () => {
    nameInput.value = userName;
    nameForm.classList.remove('hidden');
    userDisplay.classList.add('hidden');
    nameInput.focus();
  };

  taskForm.onsubmit = (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      addTask(text);
      taskInput.value = '';
    }
  };

  contactForm.onsubmit = (e) => {
    e.preventDefault();
    const name = $('contact-name').value.trim();
    const email = $('contact-email').value.trim();
    const message = $('contact-message').value.trim();
    if (name && email && message) {
      console.log('Contact form:', { name, email, message });
      contactForm.reset();
      contactForm.classList.add('hidden');
      contactSuccess.classList.remove('hidden');
      showToast('Message Sent', 'Thank you for your message!');
      setTimeout(() => {
        contactForm.classList.remove('hidden');
        contactSuccess.classList.add('hidden');
      }, 5000);
    }
  };
}

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, completed: false, createdAt: new Date() });
  saveData();
  renderUI();
  showToast('Task Added', 'Your new task has been added.');
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveData();
  renderUI();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveData();
  renderUI();
  showToast('Task Deleted', 'Your task has been removed.');
}

function renderUI() {
  // User UI
  userNameDisplay.textContent = userName;
  nameForm.classList.toggle('hidden', !!userName);
  userDisplay.classList.toggle('hidden', !userName);

  // Task list
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    taskStats.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    taskStats.classList.remove('hidden');
    tasks.forEach(({ id, text, completed, createdAt }) => {
      const taskEl = document.createElement('div');
      taskEl.className = `task-item ${completed ? 'completed' : ''}`;
      taskEl.innerHTML = `
        <div class="task-content">
          <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
          <div class="task-text-container">
            <span class="task-text">${text}</span>
            <span class="task-date">${formatDate(createdAt)}</span>
          </div>
        </div>
        <button class="task-delete">🗑</button>
      `;
      taskEl.querySelector('.task-checkbox').onclick = () => toggleTask(id);
      taskEl.querySelector('.task-delete').onclick = () => deleteTask(id);
      taskList.appendChild(taskEl);
    });
  }

  // Stats
  const completed = tasks.filter(t => t.completed).length;
  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = completed;
  completionPercentageEl.textContent = tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : '0%';
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <strong>${title}</strong><br>${message}
    <button class="toast-close">×</button>
  `;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '20px', right: '20px',
    background: type === 'error' ? '#fee2e2' : '#ecfdf5',
    color: type === 'error' ? '#b91c1c' : '#065f46',
    borderLeft: `4px solid ${type === 'error' ? '#b91c1c' : '#10b981'}`,
    padding: '10px 16px', borderRadius: '5px', zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  });
  toast.querySelector('.toast-close').onclick = () => toast.remove();
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
