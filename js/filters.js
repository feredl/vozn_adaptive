/**
 * Фильтрует массив стихотворений по заданным критериям.
 * Значение 'all' для verse/complexity и 'все' для topic означает «не фильтровать».
 */
export function filterPoems(poems, filters) {
  return poems.filter(p => {
    if (filters.verse !== 'all' && p.verse !== filters.verse) return false;
    if (filters.complexity !== 'all' && p.complexity !== filters.complexity) return false;
    if (filters.topic !== 'все' && p.topic !== filters.topic) return false;
    return true;
  });
}

/**
 * Возвращает «пустой» результат, если ничего не найдено.
 */
export function getEmptyResult(filters) {
  return [{
    id: 0,
    title: '—',
    verse: 'all',
    complexity: 'all',
    topic: filters.topic,
    text: 'Нет стихотворений, соответствующих выбранным критериям.\nИзмените настройки фильтра.'
  }];
}

/**
 * Начальное состояние фильтров (ничего не выбрано).
 */
export function getDefaultFilters() {
  return { verse: 'all', complexity: 'all', topic: 'все' };
}