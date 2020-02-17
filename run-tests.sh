#!/bin/bash

fails=""

inspect() {
    if [ $1 -ne 0 ]; then
        fails="${fails} $2"
    fi
}

docker-compose up -d --build
docker-compose exec users python manage.py recreate-db
docker-compose exec users python manage.py seed-db
docker-compose exec users python manage.py test
inspect $? users

docker-compose exec client npm run coverage
inspect $? client

docker-compose down

if [ -n "${fails}" ]; then 
    echo "Failed tests: ${fails}"
    exit 1
else
    echo "All tests passed"
    exit 0
fi
