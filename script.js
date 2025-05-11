
// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const tasksList = document.getElementById('tasksList');
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const pendingTasksElement = document.getElementById('pendingTasks');
const themeToggle = document.getElementById('themeToggle');

// Tasks array to store tasks
let tasks = [];

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
    renderTasks();
    updateStats();
});

// Add task event listener
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Shake the input if empty
        taskInput.classList.add('shake');
        setTimeout(() => {
            taskInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    taskInput.value = '';
    
    // Add bounce animation to the add button
    addTaskBtn.classList.add('bounce');
    setTimeout(() => {
        addTaskBtn.classList.remove('bounce');
    }, 800);
    
    // Save to localStorage and render tasks
    saveTasks();
    renderTask(newTask);
    updateStats();
}

// Render a single task
function renderTask(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    taskItem.classList.add('animate-in');
    
    taskItem.innerHTML = `
        <span class="task-content">${task.text}</span>
        <div class="task-actions">
            <button class="complete-btn" title="Mark as ${task.completed ? 'incomplete' : 'complete'}">
                ${task.completed ? '↩️' : '✓'}
            </button>
            <button class="delete-btn" title="Delete task">🗑️</button>
        </div>
    `;
    
    // Add event listeners for task actions
    const completeBtn = taskItem.querySelector('.complete-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => toggleComplete(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    tasksList.prepend(taskItem);
}

// Render all tasks
function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => renderTask(task));
}

// Toggle task completion
function toggleComplete(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
        taskItem.classList.toggle('completed');
        
        // Update the complete button text
        const completeBtn = taskItem.querySelector('.complete-btn');
        completeBtn.innerHTML = tasks[taskIndex].completed ? '↩️' : '✓';
        completeBtn.title = `Mark as ${tasks[taskIndex].completed ? 'incomplete' : 'complete'}`;
        
        // Add pulse animation
        taskItem.classList.add('pulse');
        setTimeout(() => {
            taskItem.classList.remove('pulse');
        }, 500);
        
        saveTasks();
        updateStats();
    }
}

// Delete a task
function deleteTask(id) {
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    
    // Add animation for removal
    taskItem.classList.add('animate-out');
    
    // Remove the task from DOM after animation completes
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        updateStats();
        taskItem.remove();
    }, 500);
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    pendingTasksElement.textContent = pendingTasks;
    
    // Add animation to the updated stats
    document.querySelectorAll('.stat-value').forEach(stat => {
        stat.classList.add('pulse');
        setTimeout(() => {
            stat.classList.remove('pulse');
        }, 500);
    });
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Update theme in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update the theme toggle button
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Animate the theme toggle
    themeToggle.classList.add('bounce');
    setTimeout(() => {
        themeToggle.classList.remove('bounce');
    }, 800);
}

// Load theme preference from localStorage
function loadTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}
