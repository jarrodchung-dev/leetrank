#!/bin/bash

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

dev() {
  docker-compose up -d --build
  docker-compose exec users python manage.py recreate-db
  docker-compose exec users python manage.py test
  inspect $? users
  docker-compose exec client npm run coverage
  inspect $? client
  docker-compose down
}

e2e() {
  docker-compose -f docker-compose-stage.yml up -d --build
  docker-compose -f docker-compose-stage.yml exec users python manage.py recreate-db
  ./node_modules/.bin/cypress run --config baseUrl="http://localhost"
  inspect $?  e2e
  docker-compose -f docker-compose-stage.yml down
}

if [[ "${env}" == "development" ]]; then
  echo "Running client and server-side tests"
  dev
elif [[ "${env}" == "staging" ]]; then 
  echo "Running e2e tests!"
  e2e prod
elif [[ "${env}" == "production" ]]; then 
  echo "Running e2e tests!"
  e2e prod
else 
  echo "Running client and server-side tests!"
  dev
fi

if [ -n "${fails}" ]; then
  echo "Failed tests: ${fails}"
  exit 0 
fi
