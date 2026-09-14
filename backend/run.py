import os
import sys

# Adiciona o diretório backend ao sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Servidor Flask 'Recomenda Conteúdo' iniciando na porta {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
