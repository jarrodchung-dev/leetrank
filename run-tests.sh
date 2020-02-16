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
    docker-compose exec users python manage.py test
    inspect $? users
    docker-compose exec exercises python manage.py test
    inspect $? exercises
    docker-compose down
    
}

client() {
    docker-compose up -d --build
    docker-compose exec client npm test -- --coverage
    inspect $? client
    docker-compose down
}

both() {
    docker-compose up -d --build
    docker-compose exec users python manage.py recreate-db
    docker-compose exec users python manage.py test
    inspect $? users
    docker-compose exec client npm test -- --coverage
    inspect $? client
    docker-compose down
}

e2e() {
    docker-compose -f docker-compose-stage.yml up -d --build
    docker-compose -f docker-compose-stage.yml exec users python manage.py recreate-db
    docker-compose -f docker-compose-stage.yml exec exercises python manage.py recreate-db
    docker-compose -f docker-compose-stage.yml exec users python manage.py seed-db
    docker-compose -f docker-compose-stage.uml exec exercises python manage.py seed-db
    ./node_modules/.bin/cypress run \
        --config baseUrl=http://localhost \
        --env REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL,LOAD_BALANCER_DNS_NAME=http://localhost
    inspect $? e2e
    docker-compose -f docker-compose-stage.yml down
}

all() {
    docker-compose up -d --build
    docker-compose exec users python manage.py recreate-db
    docker-compose exec users python manage.py test
    docker-compose exec exercises python manage.py recreate-db
    docker-compose exec exercises python manage.py test
    docker-compose exec client npm test -- --coverage
    inspect $? client
    docker-compose down
    e2e
}

if [[ "${type}" == "server" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running server-side tests."
    echo --------------------------------------------------------------------------------
    server
elif [[ "${type}" == "client" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running client-side tests."
    echo --------------------------------------------------------------------------------
    client
elif [[ "${type}" == "both" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running client and server-side tests."
    echo --------------------------------------------------------------------------------
    both
elif [[ "${type}" == "e2e" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running e2e tests."
    echo --------------------------------------------------------------------------------
    e2e
else
    echo --------------------------------------------------------------------------------
    echo "Running all tests."
    echo --------------------------------------------------------------------------------
    all
fi
    


if [ -n "${fails}" ]; then
    echo --------------------------------------------------------------------------------
    echo "Failed tests: ${fails}"
    echo --------------------------------------------------------------------------------
    exit 1
else
    echo --------------------------------------------------------------------------------
    echo "All tests passed."
    echo --------------------------------------------------------------------------------
    exit 0
fi
