FROM python:3.11-slim

# Evita criação de arquivos .pyc e garante envio direto dos logs stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências do sistema e do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

EXPOSE 5000

# Executa o servidor Flask
CMD ["python", "run.py"]
