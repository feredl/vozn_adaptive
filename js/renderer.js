const VERSE_MAP = {
  classic: 'классический',
  nonclassic: 'неклассический',
  unspecified: 'не указан',
  all: 'любой'
};

const COMPLEXITY_MAP = {
  simple: 'простой',
  complex: 'сложный',
  all: 'любая'
};

/**
 * Превращает текст стихотворения в HTML (абзацы через пустые строки, <br> внутри).
 */
function textToHtml(text) {
  const lines = text.split('\n');
  let html = '';
  let para = '';
  for (const line of lines) {
    if (line.trim() === '') {
      if (para) {
        html += `<p>${para}</p>`;
        para = '';
      }
    } else {
      para += (para ? '<br>' : '') + line;
    }
  }
  if (para) html += `<p>${para}</p>`;
  return html || '<p> </p>';
}

/**
 * Рендерит карточку стихотворения.
 */
export function renderPoem(poem, elements) {
  const { title, body, metaVerse, metaComplexity, metaTopic } = elements;

  title.textContent = poem.title;
  body.innerHTML = textToHtml(poem.text);

  metaVerse.textContent = VERSE_MAP[poem.verse] || poem.verse;
  metaComplexity.textContent = COMPLEXITY_MAP[poem.complexity] || poem.complexity;
  metaTopic.textContent = poem.topic === 'все' ? 'все темы' : poem.topic;
}

/**
 * Обновляет счётчик «показано: N (K из N)».
 */
export function updateCountInfo(countInfo, filteredPoems, currentIndex) {
  const total = filteredPoems.length;
  const idx = currentIndex + 1;
  countInfo.textContent = `показано: ${total}  (${idx} из ${total})`;
}

/**
 * Заполняет <select> тематиками из массива topics.
 */
export function populateTopics(topics, selectElement) {
  selectElement.innerHTML = '<option value="все">все темы</option>';
  for (const topic of topics) {
    const opt = document.createElement('option');
    opt.value = topic;
    opt.textContent = topic;
    selectElement.appendChild(opt);
  }
}

/**
 * Обновляет класс .active у кнопок фильтров стиха и сложности.
 */
export function updateActiveButtons(verse, complexity) {
  document.querySelectorAll('#verseFilter .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === verse);
  });
  document.querySelectorAll('#complexityFilter .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === complexity);
  });
}