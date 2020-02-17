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


