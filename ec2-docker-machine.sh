#!/bin/bash

docker-machine create \
    --driver amazonec2 \
    --amazonec2-access-key $AWS_ACCESS_KEY_ID \
    --amazonec2-region $AWS_DEFAULT_REGION \
    --amazonec2-ssh-keypath ~/.ssh \
    --amazonec2-secret-key $AWS_SECRET_ACCESS_KEY \
    leetrank-stage
