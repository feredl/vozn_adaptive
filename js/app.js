import { loadPoemsData } from './data.js';
import { filterPoems, getEmptyResult, getDefaultFilters } from './filters.js';
import {
  renderPoem,
  updateCountInfo,
  populateTopics,
  updateActiveButtons
} from './renderer.js';

// ---------- СОСТОЯНИЕ ----------
const state = {
  poems: [],
  topics: [],
  filters: getDefaultFilters(),
  filteredPoems: [],
  currentIndex: 0
};

// ---------- DOM-ССЫЛКИ ----------
const elements = {
  poemTitle: document.getElementById('poemTitle'),
  poemBody: document.getElementById('poemBody'),
  metaVerse: document.getElementById('metaVerse'),
  metaComplexity: document.getElementById('metaComplexity'),
  metaTopic: document.getElementById('metaTopic'),
  poemCountInfo: document.getElementById('poemCountInfo'),
  topicSelect: document.getElementById('topicSelect')
};

// ---------- ОСНОВНАЯ ЛОГИКА ----------
function applyFilters() {
  let result = filterPoems(state.poems, state.filters);
  if (result.length === 0) {
    result = getEmptyResult(state.filters);
  }
  state.filteredPoems = result;
  state.currentIndex = 0;
  render();
}

function render() {
  if (state.filteredPoems.length === 0) return;
  renderPoem(state.filteredPoems[state.currentIndex], elements);
  updateCountInfo(elements.poemCountInfo, state.filteredPoems, state.currentIndex);
}

function nextPoem() {
  if (state.filteredPoems.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.filteredPoems.length;
  render();
}

function prevPoem() {
  if (state.filteredPoems.length === 0) return;
  state.currentIndex = (state.currentIndex - 1 + state.filteredPoems.length) % state.filteredPoems.length;
  render();
}

function randomPoem() {
  if (state.filteredPoems.length === 0) applyFilters();
  if (state.filteredPoems.length > 0) {
    state.currentIndex = Math.floor(Math.random() * state.filteredPoems.length);
    render();
  }
}

function resetFilters() {
  state.filters = getDefaultFilters();
  updateActiveButtons(state.filters.verse, state.filters.complexity);
  elements.topicSelect.value = state.filters.topic;
  applyFilters();
}

/**
 * Универсальный обработчик клика по кнопке фильтра.
 * Повторный клик по активной кнопке снимает выбор.
 */
function handleFilterClick(type, clickedValue) {
  const current = state.filters[type];
  if (current === clickedValue) {
    state.filters[type] = 'all';
  } else {
    state.filters[type] = clickedValue;
  }
  updateActiveButtons(state.filters.verse, state.filters.complexity);
  applyFilters();
}

function showProjectDescription(e) {
  e.preventDefault();
  alert(
    'Описание проекта: Адаптивное электронное издание поэзии Андрея Вознесенского.\n\n' +
    'Критерии: стих (классический/неклассический), сложность (простой/сложный), тематика.\n' +
    'Любой параметр можно сбросить повторным нажатием на активную кнопку или кнопкой «сброс».'
  );
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
async function init() {
  try {
    const data = await loadPoemsData();
    state.poems = data.poems;
    state.topics = data.topics;

    populateTopics(state.topics, elements.topicSelect);
    applyFilters();
  } catch (error) {
    console.error(error);
    elements.poemTitle.textContent = 'Ошибка';
    elements.poemBody.innerHTML = '<p>Не удалось загрузить данные. Проверьте наличие файла data/poems.json.</p>';
  }

  // Обработчики фильтров
  document.querySelectorAll('#verseFilter .btn').forEach(btn => {
    btn.addEventListener('click', () => handleFilterClick('verse', btn.dataset.value));
  });

  document.querySelectorAll('#complexityFilter .btn').forEach(btn => {
    btn.addEventListener('click', () => handleFilterClick('complexity', btn.dataset.value));
  });

  elements.topicSelect.addEventListener('change', (e) => {
    state.filters.topic = e.target.value;
    applyFilters();
  });

  // Кнопки действий
  document.getElementById('resetBtn').addEventListener('click', resetFilters);
  document.getElementById('nextBtn').addEventListener('click', nextPoem);
  document.getElementById('prevBtn').addEventListener('click', prevPoem);
  document.getElementById('randomBtn').addEventListener('click', randomPoem);

  // Ссылки
  document.getElementById('randomLink').addEventListener('click', (e) => {
    e.preventDefault();
    randomPoem();
  });
  document.getElementById('projectLink').addEventListener('click', showProjectDescription);
  document.getElementById('footerProjectLink').addEventListener('click', showProjectDescription);
}

init();