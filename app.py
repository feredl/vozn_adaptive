from flask import Flask, jsonify, send_from_directory
import pandas as pd
import os

app = Flask(__name__, static_folder='.', static_url_path='')

def load_and_process_data():
    df = pd.read_csv('poem_adaptive.csv')
    
    poems = []
    themes_set = set()
    
    for index, row in df.iterrows():
        text = str(row['text']).strip()
        if text in ['nan', 'None', '']:
            text = 'Текст стихотворения не сохранился или отсутствует в базе.'
        
        title = str(row['title']).strip()
        if title in ['nan', 'None', '...', '']:
            title = 'Без названия'
            
        # ИЗМЕНЕНИЕ: приводим тему к нижнему регистру
        theme = str(row['theme']).strip().lower()
        if theme in ['nan', 'none', '']:
            theme = 'другое'
        themes_set.add(theme)
        
        metre = str(row['metre_simple']).strip().lower()
        verse = 'classic' if 'классический' in metre else 'nonclassic'
        
        comp = str(row['complexity_word']).strip().lower()
        complexity = 'simple' if 'простой' in comp else 'complex'
        
        poems.append({
            'id': index + 1,
            'title': title,
            'verse': verse,
            'complexity': complexity,
            'topic': theme,  # теперь тема в нижнем регистре
            'text': text
        })
        
    topics = sorted(list(themes_set))
    return poems, topics

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
    app.run(debug=True)