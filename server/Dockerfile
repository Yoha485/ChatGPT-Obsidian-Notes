FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5050

ENV FLASK_APP=app.py
  
CMD ["python", "app.py"]
