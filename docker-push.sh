#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

    if [[ "$TRAVIS_BRANCH" == "staging" ]]; then
        export DOCKER_ENV=stage
        export REACT_APP_USERS_SERVICE_URL="http://flaskreactrank-staging-alb-1674337658.us-east-1.elb.amazonaws.com"
        export REACT_APP_EXERCISES_SERVICE_URL="http://flaskreactrank-staging-alb-1674337658.us-east-1.elb.amazonaws.com"
    elif [[ "$TRAVIS_BRANCH" == "production" ]]; then
        export DOCKER_ENV=prod
        export REACT_APP_USERS_SERVICE_URL="http://flaskreactrank-production-alb-792792090.us-east-1.elb.amazonaws.com"
        export REACT_APP_EXERCISES_SERVICE_URL="http://flaskreactrank-production-alb-792792090.us-east-1.elb.amazonaws.com"
    fi
    
    if [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "production" ]
    then
        curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
        unzip awscli-bundle.zip
        ./awscli-bundle/install -b ~/bin/aws
        export PATH=~/bin:$PATH
        export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID
        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
        eval $(aws ecr get-login --region us-east-1 --no-include-email)
        export TAG=$TRAVIS_BRANCH
        export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
    fi

    if [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "production" ]
    then
        # USERS
        docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
        docker push $REPO/$USERS:$TAG
        # USERS DB
        docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT -f Dockerfile
        docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
        docker push $REPO/$USERS_DB:$TAG
        # CLIENT
        docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV \
        --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL \
        --build-arg REACT_APP_EXERCISES_SERVICE_URL=$REACT_APP_EXERCISES_SERVICE_URL \
        --build-arg REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL
        docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
        docker push $REPO/$CLIENT:$TAG
        # SWAGGER
        docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
        docker push $REPO/$SWAGGER:$TAG
        # EXERCISES
        docker build $EXERCISES_REPO -t $EXERCISES:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $EXERCISES:$COMMIT $REPO/$EXERCISES:$TAG
        docker push $REPO/$EXERCISES:$TAG
        # EXERCISES DB
        docker build $EXERCISES_DB_REPO -t $EXERCISES_DB:$COMMIT -f Dockerfile
        docker tag $EXERCISES_DB:$COMMIT $REPO/$EXERCISES_DB:$TAG
        docker push $REPO/$EXERCISES_DB:$TAG
        # # SCORES
        # docker build $SCORES_REPO -t $SCORES:$COMMIT -f Dockerfile-$DOCKER_ENV
        # docker tag $SCORES:$COMMIT $REPO/$SCORES:$TAG
        # docker push $REPO/$SCORES:$TAG
        # # SCORES DB
        # docker build $SCORES_DB_REPO -t $SCORES_DB:$COMMIT -f Dockerfile
        # docker tag $SCORES_DB:$COMMIT $REPO/$SCORES_DB:$TAG
        # docker push $REPO/$SCORES_DB:$TAG
    fi
    
fi
