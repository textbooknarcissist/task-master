/**
 * TaskMaster - Core Application Logic (v3)
 * Redesigned with Left-Aligned Header and Circular Productivity Tracker.
 */

// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

/**
 * Save current tasks to LocalStorage
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// --- DOM Elements ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDesc = document.getElementById('todo-desc');
const todoDate = document.getElementById('todo-date');
const todoList = document.getElementById('todo-list');

// Productivity Ring Elements
const productivityPercent = document.getElementById('productivity-percent');
const productivityRing = document.getElementById('productivity-ring');

const radius = 25;
const circumference = 2 * Math.PI * radius;

if (productivityRing) {
    productivityRing.style.strokeDasharray = `${circumference} ${circumference}`;
}

// Counter Elements
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const countOverdue = document.getElementById('count-overdue');

const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');

// --- Theme Logic ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Initialize theme on load
initTheme();

// --- CRUD Operations ---

function addTask(title, desc, dueDate) {
    const newTask = {
        id: Date.now().toString(),
        text: title,
        description: desc,
        dueDate: dueDate || null,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

function updateTaskText(id, newText) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
    );
    saveTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
}

// --- Helpers ---

function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const diff = (date - today) / (1000 * 60 * 60 * 24);

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// --- UI Rendering ---

function renderTasks() {
    updateMetrics();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'overdue') return isTaskOverdue(task);
        return true;
    });

    todoList.innerHTML = '';

    filteredTasks.forEach(task => {
        const overdue = isTaskOverdue(task);
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`;
        li.draggable = true;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="checkbox" tabindex="0" role="checkbox" aria-checked="${task.completed}" aria-label="Toggle task">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="task-content">
                <div class="task-header-row">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <span class="status-badge">${task.completed ? 'Completed' : (overdue ? 'Overdue' : '')}</span>
                </div>
                ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
                ${task.dueDate ? `
                    <div class="task-meta ${overdue ? 'is-overdue' : ''}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>${formatDisplayDate(task.dueDate)}</span>
                    </div>
                ` : ''}
            </div>
            <div class="actions">
                <button class="action-btn edit-btn" aria-label="Edit task">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete-btn" aria-label="Delete task">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        addListItemListeners(li, task);
        todoList.appendChild(li);
    });
}

function updateMetrics() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => isTaskOverdue(t)).length;

    countAll.textContent = total;
    countActive.textContent = active;
    countCompleted.textContent = completed;
    countOverdue.textContent = overdue;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    productivityPercent.textContent = `${percent}%`;

    if (productivityRing) {
        const offset = circumference - (percent / 100) * circumference;
        productivityRing.style.strokeDashoffset = offset;
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Item Listeners ---

function addListItemListeners(li, task) {
    const checkbox = li.querySelector('.checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    const editBtn = li.querySelector('.edit-btn');
    const textSpan = li.querySelector('.task-text');

    checkbox.addEventListener('click', () => toggleTask(task.id));
    checkbox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTask(task.id);
        }
    });

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enterEditMode(li, task, textSpan);
    });

    li.addEventListener('dragstart', (e) => {
        li.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
    });
}

function enterEditMode(li, task, textSpan) {
    const headerRow = textSpan.parentElement;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;

    headerRow.innerHTML = '';
    headerRow.appendChild(input);
    input.focus();

    const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== task.text) {
            updateTaskText(task.id, newText);
        } else {
            renderTasks();
        }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') renderTasks();
    });

    input.addEventListener('blur', finishEdit);
}

// --- Global Listeners ---

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    const desc = todoDesc.value.trim();
    const date = todoDate.value;

    if (title) {
        addTask(title, desc, date);
        todoInput.value = '';
        todoDesc.value = '';
        todoDate.value = '';
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    if (!draggingItem) return;

    const siblings = [...todoList.querySelectorAll('.task-item:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        return offset < 0;
    });

    todoList.insertBefore(draggingItem, nextSibling);
});

todoList.addEventListener('drop', (e) => {
    e.preventDefault();
    const newOrderIds = [...todoList.querySelectorAll('.task-item')].map(li => li.dataset.id);
    const newTasks = newOrderIds.map(id => tasks.find(t => t.id === id)).filter(t => t);
    tasks = newTasks;
    saveTasks();
});

// Initial render
renderTasks();
