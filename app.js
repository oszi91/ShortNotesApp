const form = document.querySelector('.form');
const formTextInput = document.querySelector('.form__input');
const todoList = document.querySelector('.todo-list');
const selectToDo = document.querySelector('.form__select-input');

const dropdownList = document.querySelector('.form__dropdown-list');
const dropdownMainOption = document.querySelector(
	'.form__dropdown-main-option'
);
const dropdownContainer = document.querySelector('.form__dropdown-container');

const error = document.querySelector('.form__error');
const allTasksText = document.querySelector('.header__all-tasks > span');
const completedTasksText = document.querySelector(
	'.header__completed-tasks > span'
);
const uncompletedTasksText = document.querySelector(
	'.header__uncompleted-tasks > span'
);

const progressPercent = document.querySelector(
	'.header__progress-bar--percent'
);
const completedTasks = document.getElementsByClassName(
	'todo-list__item-name--done'
);

let tasks = [];

getTasksFromLSCheck();
localStorage.setItem('tasks', JSON.stringify(tasks));

const updateBarAndTasks = () => {
	completedTasksText.textContent = completedTasks.length;
	uncompletedTasksText.textContent =
		tasks.length - Number(completedTasks.length);

	let progress = `${Math.floor((completedTasks.length / tasks.length) * 100)}%`;
	progressPercent.style.width = progress;
	progressPercent.textContent = progress;

	if (completedTasks.length === 0) {
		progressPercent.style.width = '10%';
		progressPercent.textContent = '0%';
	}
};

const addTask = task => {
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-list__item-container');
	todoItem.innerHTML = ` 
    <li class="todo-list__item-name">${task}</li>
    <button class="todo-list__item-complete"><i class="fas fa-check"></i></button>
    <button class="todo-list__item-delete"><i class="fas fa-times"></i></button>
    <div class="todo-list__pin">
    <i class="fas fa-map-pin"></i>
    </div>
    `;
	todoList.appendChild(todoItem);
	tasks.push({
		task: task,
		done: false,
	});
	allTasksText.textContent = tasks.length;
};

const addTaskToList = e => {
	e.preventDefault();
	const task = formTextInput.value;

	if (task.length > 55) {
		error.textContent = `Note can't be longer than 55 signs`;
	} else if (!task) {
		error.textContent = `This field can't be empty`;
	} else {
		error.textContent = '';

		addTask(task);
		saveTaskToLocalStorage(task, false);

		formTextInput.value = '';

		updateBarAndTasks();
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}
};

const deleteOrCompleteTask = e => {
	const task = e.target;

	if (task.classList.contains('todo-list__item-complete')) {
		const taskContainer = task.parentElement;
		const completeTask = taskContainer.children[0];
		const taskName = completeTask.textContent;
		const getIndexOfCompleteTask = tasks.findIndex(t => t.task === taskName);

		completeTask.classList.toggle('todo-list__item-name--done');
		taskContainer.classList.toggle('todo-list__item-container--opacity');

		let isDone;
		if (tasks) {
			if (completeTask.classList.contains('todo-list__item-name--done')) {
				isDone = tasks[getIndexOfCompleteTask].done = true;
			} else {
				isDone = tasks[getIndexOfCompleteTask].done = false;
			}
		}

		saveIsDoneToLS(taskName, isDone);
		updateBarAndTasks();
	}

	if (task.classList.contains('todo-list__item-delete')) {
		const taskToDelete = task.parentElement;
		const taskName = taskToDelete.textContent;
		const getIndexOfTaskToDelete = tasks.findIndex(t => t.task === taskName);
		tasks.splice(getIndexOfTaskToDelete, 1);

		taskToDelete.remove();
		deleteTaskFromLocalStorage(taskToDelete);

		updateBarAndTasks();
	}
};

const dropdownIsOpen = () => {
	const dropdownBtn = document.querySelector('.form__dropdown-btn');
	dropdownList.classList.toggle('form__dropdown-btn--is-open');
	dropdownBtn.classList.toggle('form__dropdown-btn--rotate-arrow');
};

const selectTypeOfTasks = e => {
	const selectTasks = [...todoList.children];
	const typeOfTasks = e.target.dataset.value;

	selectTasks.forEach(task => {
		const taskComplete = task.children[0];

		switch (typeOfTasks) {
			case 'all':
				dropdownMainOption.textContent = 'All';
				task.style.display = 'flex';
				break;
			case 'completed':
				dropdownMainOption.textContent = 'Completed';
				if (taskComplete.classList.contains('todo-list__item-name--done')) {
					task.style.display = 'flex';
				} else {
					task.style.display = 'none';
				}
				break;
			case 'uncompleted':
				dropdownMainOption.textContent = 'Uncompleted';
				if (!taskComplete.classList.contains('todo-list__item-name--done')) {
					task.style.display = 'flex';
				} else {
					task.style.display = 'none';
				}
				break;
		}
	});
};

dropdownList.addEventListener('click', selectTypeOfTasks);

// Local Storage

function getTasksFromLSCheck() {
	const getTasks = localStorage.getItem('tasks');

	if (!getTasks) {
		tasks = [];
	} else {
		tasks = JSON.parse(getTasks);
	}
}

const loadTaskList = () => {
	tasks.forEach(allTasks => {
		const todoItem = document.createElement('div');

		if (allTasks.done === false) {
			todoItem.classList.add('todo-list__item-container');
			todoItem.innerHTML = ` 
                <li class="todo-list__item-name">${allTasks.task}</li>
                <button class="todo-list__item-complete"><i class="fas fa-check"></i></button>
                <button class="todo-list__item-delete"><i class="fas fa-times"></i></button>
                <div class="todo-list__pin">
                <i class="fas fa-map-pin"></i>
                </div>
                `;
		} else {
			todoItem.classList.add(
				'todo-list__item-container',
				'todo-list__item-container--opacity'
			);
			todoItem.innerHTML = ` 
                <li class="todo-list__item-name todo-list__item-name--done">${allTasks.task}</li>
                <button class="todo-list__item-complete"><i class="fas fa-check"></i></button>
                <button class="todo-list__item-delete"><i class="fas fa-times"></i></button>
                <div class="todo-list__pin">
                <i class="fas fa-map-pin"></i>
                </div>
                `;
		}

		todoList.appendChild(todoItem);
	});
};

const getTasksFromLocalStorage = () => {
	// Test tasks for a new visitors
	if (localStorage.getItem('tasks') === '[]') {
		localStorage.setItem(
			'tasks',
			JSON.stringify([
				{ task: 'Test Task Done', done: true },
				{ task: 'Test Task', done: false },
			])
		);
		tasks.push(
			{ task: 'Test Task Done', done: true },
			{ task: 'Test Task', done: false }
		);
		loadTaskList();
	} else {
		loadTaskList();
	}

	allTasksText.textContent = tasks.length;
	updateBarAndTasks();
};

const saveTaskToLocalStorage = (taskName, isDone) => {
	getTasksFromLSCheck();

	tasks.push({
		task: taskName,
		done: isDone,
	});

	let getIndexOfCompleteTask = tasks.findIndex(t => t.task === taskName);
	tasks[getIndexOfCompleteTask].done = isDone;

	localStorage.setItem('tasks', JSON.stringify(tasks));
};

const saveIsDoneToLS = (taskName, isDone) => {
	getTasksFromLSCheck();

	let getIndexOfCompleteTask = tasks.findIndex(t => t.task === taskName);
	tasks[getIndexOfCompleteTask].done = isDone;

	localStorage.setItem('tasks', JSON.stringify(tasks));
};

const deleteTaskFromLocalStorage = taskName => {
	getTasksFromLSCheck();

	const taskToDelete = taskName.children[0].textContent;
	const getIndexOfTaskToDelete = tasks.findIndex(t => t.task === taskToDelete);

	tasks.splice(getIndexOfTaskToDelete, 1);
	allTasksText.textContent = tasks.length;

	localStorage.setItem('tasks', JSON.stringify(tasks));
};

document.addEventListener('DOMContentLoaded', getTasksFromLocalStorage);
form.addEventListener('submit', addTaskToList);
todoList.addEventListener('click', deleteOrCompleteTask);
dropdownContainer.addEventListener('click', dropdownIsOpen);
