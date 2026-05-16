FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# copy minimal project files first for better caching
COPY pyproject.toml .
COPY setup.cfg .

# copy application code
COPY doaperto ./doaperto
COPY doacoes ./doacoes
COPY manage.py ./

RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential && \
    python -m pip install --upgrade pip && \
    pip install --no-cache-dir . && \
    apt-get remove -y gcc build-essential && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
