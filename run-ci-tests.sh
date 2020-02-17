#!/bin/bash

env=$1

inspect() {
    if [ $1 -ne 0 ]; then
        fails="${fails} $2"
    fi
}

dev() {
    docker-compose up -d --build
    docker-compose exec users python manage.py recreate-db
    docker-compose exec users python manage.py seed-db
    docker-compose exec users python manage.py test
    inspect $? users
    docker-compose exec client npm run coverage
    inspect $? client
    docker-compose down
}

e2e() {
    docker-compose -f docker-compose-$1.yml up -d --build
    docker-compose -f docker-compose-$1.yml exec users python manage.py recreate-db
    docker-compose -f docker-compose-$1.yml exec users python manage.py seed-db
    ./node_modules/.bin/cypress run --config baseUrl=http://localhost
    inspect $? e2e
    docker-compose -f docker-compose-$1.yml down
}

if [[ "${env}" == "development" ]]; then
    echo "Running client and server-side tests..."
    dev
elif [[ "${env}" == "staging" ]]; then
    echo "Running e2e tests..."
    e2e stage
elif [[ "${env}" == "production" ]]; then 
    echo "Running e2e tests..."
    e2e prod
else
    echo "Running client and server-side tests..."
    dev
fi

if [ -n "${fails}" ]; then
    echo "Failed tests: ${fails}"
    exit 1
else
    echo "All tests passed"
    exit 0
fi
