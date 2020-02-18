# LeetRank

## Development Workflow

1. Create new feature branch from the master branch and make arbitrary change.
2. Commit and push to GitHub to trigger client and server-side test on TravisCI.
3. After build passes, open a PR against the development branch to trigger a new build.
4. After build passes, merge the PR and have the client and server-side tests run again.

## Staging Workflow

1. Open a PR from the development branch against the staging branch to trigger a new build.
2. Merge the PR after the build passes to trigger a new build which will run the e2e tests.
3. After the build passes, docker images are created, tagged `staging` and pushed to ECR
4. 

## Production Workflow

1. Open a PR from the `staging` branch against the `production` branch to trigger a new build
2. Merge the PR after the build passes to trigger a new build which will run the e2e tests
3. After the build passes, images are created, tagged `production` and pushed to ECR
4. Merge the changes into the master branch

# Elastic Load Balancer

The Elastic Load Balancer distributes incoming application traffic and scales resources as needed to meet traffic needs.

A load balancer is one of (if not) the most important parts of your application since it needs to always be up, routing traffic to healthy services and ready to scale at any moment.

Further, a load balancer:

1. Improves throughput, which can help decrease latency
2. Prevents the overloading of a single service
3. Provides a framework for updating services on the fly
4. Improves tolerance for back-end failures

`Application Load Balancer` provides support for path-based routing and dynamic port-mapping and enables zero-downtime deployments and support for A/B testing. The Application Load Balancer is an AWS servicee that makes ECS so powerful. In fact, before it's release, ECS was not a viable container orchestration solution.

# Task Definitions

Task Definitions define which containers make up the overall application and how much resources are allocated to each container. You can think of then as blueprints, similar to the Docker Compose file.

Navigate to the Amazon ECS click "Task Definitions" and dthen click the button "Create New Task Definition". Then select EC2 in the "Select Launch Type Compatibility" screen.

## Task Definition 1: `client`

Update the Task Definition Name to `leetrank-client-stage-td` then add a new container

1. container name: `client`
2. image: `017905389336.dkr.ecr.us-east-1.amazonaws.com/leetrank-client:staging`
3. memory limits (mb): `300` soft limit
4. port mappings: `0` host, `80` container

# Clusters 

Clusters are where the actual containers run. 
They are just groups of EC2 instances that run Docker containers managed by ECS. To create a cluster, click "Clusters" on the ECS Console sidebar, and then click the "Create Cluster" button. Select "EC2" Linux + Networking.

To create a new EC2 Key Pair, so we can SSH into the EC2 instances managed by ECS, navigate to Amazon EC2, click "Key Pairs" on the sidebar and then click the "Create Key Pair" button.

# Services 

Services instantiate the containers from the Task Definitions and run them on EC2 boxes within the ECS Cluster. Such instances are called Tasks. To define a Service, on the "Services" tab within the newly created cluster, click "Create"

Click the following Services

Client:
- Configure service:
  + launch type: EC2
  + task definition: 
    * family: leetrank-client-stage-td
    * revision: LATEST_REVISION_NUMBER
  + service name: leetrank-client-stage-service
  + number of tasks: 1

Users:
- Configure Service
  + launch type: EC2
  + Task Definition: 
    * family: leetrank-users-stage-td
    * revision: LATEST_REVISION_NUMBER
  + service name: leetrank-users-stage-service
  + number of tasks: 1

Swagger
- Configure Service
  + launch type: EC2
  + task definition: 
    * family: leetrank-swagger-stage-td
    * LATEST_REVISION_NUMBER
  + service name: leetrank-swagger-stage-service
  + number of tasks: 1

# Sanity Check

Navigate to the EC2 Dashboard and click "Target Groups"

Make sure the leetrank-client-stage-tg, leetrank-users-stage-tg, and leetrank-swagger-stage-tg have single registered instances each. Each of the instances should be unhealthy because they failed their respective health checks.

To get them to pass the health checks, we need to add another inbound rule to the Security Group associated with the containers (which we defined when configuring the Cluster), allowing traffic from the Load Balancer to reach containers.

## Inbound Rules

From the EC2 Dashboard, click "Security Groups" and select the security group associated with the Load Balancer. Click the "Inbound" tab and then click "Edit"

Once added, the next time a container is added to each of the Target Groups, the instance should be healthy.

Essentially, when the service was spun up, ECS automatically discovered and associated the new Cluster instances with the Application Load Balancer.

Next navigate back to the Load Balancer and grab the DNS Name from the Description tab and navigate to `http://LOAD_BALANCER_STAGE_DNS_NAME/users/ping` in your browser.

If all went well, you should see:

```json
{
  "message": "Great success!",
  "status": "success"
}
```

Try the `/users` endpoint at `http://LOAD_BALANCER_STAGE_DNS_NAME/users`. You should see a 500 error since the migrations have not been ran.

You should be able to see this in the logs as well.

# Migrations

