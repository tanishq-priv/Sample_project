# 1. Use an official lightweight Python runtime image as the base image.
# python:3.11-slim reduces container size while supplying Python dependencies.
FROM python:3.11-slim

# 2. Set environment variables to optimize Python execution inside Docker:
# PYTHONDONTWRITEBYTECODE prevents Python from writing .pyc files to disk.
# PYTHONUNBUFFERED ensures stdout and stderr output are sent directly to terminal/logs without buffering.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory inside the container. All subsequent commands execute from here.
WORKDIR /app

# 4. Install system-level build tools required for compiling Python packages (like psycopg2 if needed).
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy requirements first to leverage Docker layer caching.
# Dependencies will only re-install when requirements.txt changes.
COPY requirements.txt /app/

# 6. Upgrade pip and install Python dependencies without saving cache.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 7. Copy the rest of the Django project application source code into the container.
COPY . /app/

# 8. Collect static files into STATIC_ROOT using Whitenoise for efficient production serving.
RUN python manage.py collectstatic --noinput || true

# 9. Expose default fallback port (Render automatically binds to $PORT dynamically).
EXPOSE 8000

# 10. Start the Django application using Gunicorn as the production WSGI HTTP Server.
# We bind dynamically to ${PORT:-8000} so Render or Docker containers can pass custom port env vars.
CMD gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}
