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
  docker-compose exec scores python manage.py test
  inspect $? scores
  docker-compose exec scores python manage.py test
  inspect $? scores
}

client() {
  docker-compose up -d --build
  docker-compose exec client npm run coverage
  inspect $? client
  docker-compose down
}
