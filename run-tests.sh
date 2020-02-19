#!/bin/bash

type=$1
fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

server() {
  docker-compose up -d --build
  docker-compose exec users python manage.py recreate-db
  docker-compose exec users python manage.py seed-db
  docker-compose exec users python manage.py test
  inspect $? users
  docker-compose exec exercises python manage.py recreate-db
  docker-compose exec exercises python manage.py seed-db
  docker-compose exec exercises python manage.py test
  inspect $? exercises
  docker-compose down
}

client() {
  docker-compose up -d --build
  docker-compose exec client npm run coverage
  inspect $? client
  docker-compose down
}

all() {
  docker-compose up -d --build
  docker-compose exec users python manage.py recreate-db
  docker-compose exec users python manage.py seed-db
  docker-compose exec users python manage.py test
  inspect $? users
  docker-compose exec exercises python manage.py recreate-db
  docker-compose exec exercises python manage.py seed-db
  docker-compose exec exercises python manage.py test
  inspect $? exercises
  docker-compose exec client npm run coverage
}

if [[ "${type}" == "server" ]]; then
  echo "Running server-side tests..."
  server
elif [[ "${type}" == "client" ]]; then
  echo "Running client-side tests..."
  client
elif [[ "${type}" == "both" ]]; then 
  echo "Running client and server-side tests..."
  client
  server
else
  echo "Running all tests..."
  all
fi

if [ -n "${fails}" ]; then
  echo "Failed tests: ${fails}"
  exit 1
else
  "All tests passed!"
  exit 0
fi
