/**
 * Загружает poems.json и возвращает { poems, topics }
 */
export async function loadPoemsData() {
  const response = await fetch('data/poems.json');
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }
  return await response.json();
}