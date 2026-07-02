from flask import Flask, jsonify, send_from_directory
import pandas as pd
import os

app = Flask(__name__, static_folder='.', static_url_path='')

def load_and_process_data():
    # Читаем CSV. Pandas отлично справляется с многострочными текстами в кавычках
    df = pd.read_csv('poem_adaptive.csv')
    
    poems = []
    themes_set = set()
    
    for index, row in df.iterrows():
        # 1. Обработка текста
        text = str(row['text']).strip()
        if text in ['nan', 'None', '']:
            text = 'Текст стихотворения не сохранился или отсутствует в базе.'
        
        # 2. Обработка названия
        title = str(row['title']).strip()
        if title in ['nan', 'None', '...', '']:
            title = 'Без названия'
            
        # 3. Обработка темы
        theme = str(row['theme']).strip()
        if theme in ['nan', 'None', '']:
            theme = 'Другое'
        themes_set.add(theme)
        
        # 4. Маппинг стиха (классический / неклассический)
        metre = str(row['metre_simple']).strip().lower()
        verse = 'classic' if 'классический' in metre else 'nonclassic'
        
        # 5. Маппинг сложности (простой / сложный)
        comp = str(row['complexity_word']).strip().lower()
        complexity = 'simple' if 'простой' in comp else 'complex'
        
        poems.append({
            'id': index + 1,
            'title': title,
            'verse': verse,
            'complexity': complexity,
            'topic': theme,
            'text': text
        })
        
    # Сортируем темы по алфавиту для красивого выпадающего списка
    topics = sorted(list(themes_set))
    return poems, topics

# Загружаем данные в память при старте сервера
poems_data, topics_data = load_and_process_data()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/poems')
def get_poems():
    return jsonify(poems_data)

@app.route('/api/topics')
def get_topics():
    return jsonify(topics_data)

if __name__ == '__main__':
    print(f"Загружено стихотворений: {len(poems_data)}")
    print(f"Уникальных тем: {len(topics_data)}")
    print("Сервер запущен на http://127.0.0.1:5000")
    app.run(debug=True)