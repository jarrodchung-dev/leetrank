#!/bin/bash


if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

  if [ "$TRAVIS_BRANCH" == "production" ]
  then

    JQ="jq --raw-output --exit-status"

    configure_aws_cli() {
        aws --version
        aws configure set default.region us-west-1
        aws configure set default.output json
        echo "AWS Configured!"
    }

    register_task_definition() {
      if revision=$(aws ecs register-task-definition --cli-input-json "$task_def" | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
      else
        echo "Failed to register task definition"
        return 1
      fi
    }

   update_service() {
    if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then
      echo "Error updating service."
        return 1
      fi
    }

    deploy_ecs_cluster() {
      cluster="leetrank-production-cluster"

      service="leetrank-users-prod-service"
      template="ecs-users-prod-taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID $AWS_RDS_URI $PRODUCTION_SECRET_KEY)
      echo "$task_def"
      register_task_definition

      service="leetrank-client-prod-service"
      template="ecs-client-prod_taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"
      register_task_definition

      service="leetrank-swagger-prod-service"
      template="ecs-swagger-prod-taskdefinition.json"
      task_template=$(cat "ecs/$template")
      task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
      echo "$task_def"
      register_task_definition
    }

    configure_aws_cli
    deploy_ecs_cluster

  fi

fi