const AWS = require("aws-sdk");

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY_ID = process.env.AWS_SECRET_KEY_ID;
const AWS_USERNAME = process.env.AWS_USERNAME;
const AWS_CONFIG_REGION = "us-east-1";

const clusterName = "leetrank-staging-cluster";

AWS.config = new AWS.Config();
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = AWS_SECRET_ACCESS;
