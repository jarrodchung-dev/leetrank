#!/bin/bash

env=$1
fails=""

inspect() {
    if [ $1 -ne 0 ]; then
        fails="${fails} $2"
    fi
}

development() {
    docker-compose up -d --build
    docker-compose exec users python manage.py test
    inspect $? users
    docker-compose exec users python manage.py recreate-db
    docker-compose exec client npm test -- --coverage
    inspect $? client
    docker-compose down
}

staging() {
    docker-compose -f docker-compose-stage.yml up -d --build
    docker-compose -f docker-compose-stage.yml exec users python manage.py test
    inspect $? users
    docker-compose -f docker-compose-stage.yml up -d --build
    docker-compose -f docker-compose-stage.yml exec exercises python manage.py test
    inspect $? exercises
    docker-compose -f docker-compose-stage.yml exec users python manage.py recreate-db
    docker-compose -f docker-compose-stage.yml exec client npm test -- --coverage
    inspect $? client
    docker-compose -f docker-compose-stage.yml exec users python manage.py recreate-db
    docker-compose -f docker-compose-stage.yml exec exercises python manage.py recreate-db
    ./node_modules/.bin/cypress run \
        --config baseUrl=http://$LOAD_BALANCER_STAGE_DNS_NAME \
        --env REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL,LOAD_BALANCER_DNS_NAME=$LOAD_BALANCER_STAGE_DNS_NAME
    inspect $? e2e
    docker-compose -f docker-compose-stage.yml down
}

production() {
    docker-compose -f docker-compose-prod.yml up -d --build
    docker-compose -f docker-compose-prod.yml exec users python manage.py test
    inspect $? users
    docker-compose -f docker-compose-prod.yml exec exercises python manage.py test
    inspect $? exercises
    docker-compose -f docker-compose-prod.yml exec users python manage.py recreate-db
    docker-compose -f docker-compose-prod.yml exec exercises python manage.py seed-db
    docker-compose -f docker-compose-prod.yml exec client npm test -- --coverage
    inspect $? client
    ./node_modules/.bin/cypress run \
        --config baseUrl=http://localhost \
        --env REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL,LOAD_BALANCER_DNS_NAME=$LOAD_BALANCER_PROD_DNS_NAME
    inspect $? e2e
    docker-compose -f docker-compose-prod.yml down
}

if [[ "${env}" == "development" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running client and server-side tests (${env})."
    echo --------------------------------------------------------------------------------
    development
elif [[ "${env}" == "staging" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running e2e tests (${env})."
    echo --------------------------------------------------------------------------------
    staging
elif [[ "${env}" == "production" ]]; then
    echo --------------------------------------------------------------------------------
    echo "Running e2e tests (${env})."
    echo --------------------------------------------------------------------------------
    production
fi

if [ -n "${fails}" ]; then
    echo --------------------------------------------------------------------------------
    echo "Failed tests: ${fails}"
    echo --------------------------------------------------------------------------------
    exit 1
else
    echo "All tests passed."
    exit 0
fi
