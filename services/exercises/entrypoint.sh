#!/bin/bash

echo "Waiting for PostgreSQL..."

while ! nc -z exercises-db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

python manage.py recreate-db
python manage.py seed-db
python manage.py run -h 0.0.0.0
