#!/bin/bash

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ] 
then
  if [ "$TRAVIS_BRANCH" == "staging" ] 
  then

    JQ="jq --raw-output --exit-status" 

    configure_aws_cli() {
      aws --version
      aws configure set default.region us-east-1
      aws configure set default.output json
      echo "Successfully configured AWS CLI!"
    }

    register_task_definition() {
      if revision=$(aws ecs register-task-definition \
        --family "$family" \
        --cli-input json "$task_definition" | $JQ '.taskDefinition.taskDefinitionArn');
      then 
        echo "Revision: $revision"
      else
        echo "Failed to register task definition"
        return 1
      fi
    }

    update_service() {
      if [[ $(aws ecs update-service --cluster $cluster \
        --service $service --task-definition) != $revision ]];
      then
        echo "Error updating the ECS service"
        return 1
      fi
    }

    deploy_ecs_cluster() {
      cluster="leetrank-staging-cluster"

      service="leetrank-users-stage-service"
      family="leetrank-users-stage-td"
      template="ecs-users-stage-taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_definition=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "New Task Definition: $task_definition"
      register_task_definition
      update_service

      service="leetrank-client-stage-service"
      family="leetrank-client-stage-td"
      template="ecs-client-stage-taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_definition=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "New Task Definition: $task_definition"
      register_task_definition
      update_service

      service="leetrank-swagger-stage-service"
      family="leetrank-swagger-stage-td"
      template="ecs-swagger-stage-taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_definition=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "New Task Definition: $task_definition"
      register_task_definition
      update_service
    }

    configure_aws_cli
    deploy_ecs_cluster

  fi
fi
