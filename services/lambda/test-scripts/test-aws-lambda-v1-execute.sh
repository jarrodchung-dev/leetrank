#!/bin/bash

curl -H "Content-Type: application/json" \
  -X POST \
  -d '{"answer":"def sum(x,y):\n    return x+y"}' \
  https://cpeebb9avc.execute-api.us-east-1.amazonaws.com/v1/exec

echo ""

# False
curl -H "Content-Type: application/json" \
  -X POST \
  -d '{"answer":"def sum(x,y):\n    return x+99999999"}' \
  https://cpeebb9avc.execute-api.us-east-1.amazonaws.com/v1/exec

echo ""