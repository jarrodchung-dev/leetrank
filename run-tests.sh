#!/bin/bash

fails=""

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

server() {
  docker-compose up -d --build
  docker-compose exec users python manage.py recreate-db
  docker-compose exec users python manage.py test
  inspect $? users
  docker-compose down
}

client() {
  docker-compose up -d -build
  docker-compose exec client run coverage
  inspect $? client
  docker-compose down
}

e2e() {
  docker-compose -f docker-compose-stage.yml up -d --build
  docker-compose -f docker-compose-stage.yml exec users python manage.py recreate-db
  ./node-modules/.bin/cypress run --config baseUrl=http://localhost
  inpsect $? e2e
  docker-compose -f docker-compose-stage.yml down
}

all() {
  docker-compose up -d --build
  docker-compose  exec users python manage.py recreate-db
  docker-compose  exec users python manage.py test
  inspect $? users
  docker-compose exec client npm run coverage
  inpsect $? client
  docker-compose down
  e2e
}

if [[ "${type}" == "server" ]]; then 
  echo ""
  echo "Running server-side tests"
  server
elif [[ "${type}" == "client" ]]; then
  echo ""
  echo "Running client-side tests"
  client
elif [[ "${type}" == "e2e" ]]; then
  echo ""
  echo "Running all tests"
  all
fi

if [ -n "${fails}" ]; then
  echo ""
  echo "Test failed: ${fails}"
  exit 1
else
  echo ""
  echo "All tests pass"
  exit 0
fi
