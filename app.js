/**
 * TaskMaster - Core Application Logic
 * 
 * This file handles:
 * - State management with LocalStorage
 * - DOM manipulation and event delegation
 * - CRUD operations for tasks
 * - Filtering and Drag & Drop
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
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// --- CRUD Operations ---

/**
 * Add a new task
 */
function addTask(text) {
    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
}

/**
 * Toggle task completion status
 */
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
}

/**
 * Delete a task
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

/**
 * Edit task text
 */
function updateTaskText(id, newText) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
    );
    saveTasks();
}

/**
 * Clear all completed tasks
 */
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
}

// --- UI Rendering ---

/**
 * Render tasks based on current filter
 */
function renderTasks() {
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    todoList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.draggable = true;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="checkbox" tabindex="0" role="checkbox" aria-checked="${task.completed}" aria-label="Toggle task">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span class="task-text">${escapeHTML(task.text)}</span>
            <div class="actions">
                <button class="action-btn edit-btn" aria-label="Edit task ${escapeHTML(task.text)}">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete-btn" aria-label="Delete task">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        // Add event listeners for this item
        addListItemListeners(li, task);
        todoList.appendChild(li);
    });

    updateCount();
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Update the "items left" counter
 */
function updateCount() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}

// --- Event Handlers ---

/**
 * Set up listeners for individual list items (Drag & Drop, Toggle, Delete, Edit)
 */
function addListItemListeners(li, task) {
    const checkbox = li.querySelector('.checkbox');
    const deleteBtn = li.querySelector('.delete-btn');
    const editBtn = li.querySelector('.edit-btn');
    const textSpan = li.querySelector('.task-text');

    // Toggle
    checkbox.addEventListener('click', () => toggleTask(task.id));
    checkbox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTask(task.id);
        }
    });

    // Delete
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    // Edit in-place
    editBtn.addEventListener('click', () => enterEditMode(li, task, textSpan));
    textSpan.addEventListener('dblclick', () => enterEditMode(li, task, textSpan));

    // Drag events
    li.addEventListener('dragstart', (e) => {
        li.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
    });
}

/**
 * Handle in-place editing
 */
function enterEditMode(li, task, textSpan) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;

    // Replace text span with input
    li.replaceChild(input, textSpan);
    input.focus();

    const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== task.text) {
            updateTaskText(task.id, newText);
        } else {
            renderTasks(); // Revert if empty or unchanged
        }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') renderTasks();
    });

    input.addEventListener('blur', finishEdit);
}

// --- Global Event Listeners ---

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTask(text);
        todoInput.value = '';
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

// --- Drag and Drop Reordering ---

todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
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
    // After drop, update the original tasks array based on the DOM order
    const newOrderIds = [...todoList.querySelectorAll('.task-item')].map(li => li.dataset.id);
    const newTasks = newOrderIds.map(id => tasks.find(t => t.id === id));
    tasks = newTasks;
    saveTasks();
});

// Initial render
renderTasks();
