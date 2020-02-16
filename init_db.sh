#!/bin/bash

# Create Databases
docker-compose exec exercises python manage.py recreate-db
docker-compose exec users python manage.py recreate-db

# Seed Databases
docker-compose exec exercises python manage.py seed-db
docker-compose exec users python manage.py seed-db

# docker-compose exec scores python manage.py recreate-db
# docker-compose exec scores python manage.py seed-dbs