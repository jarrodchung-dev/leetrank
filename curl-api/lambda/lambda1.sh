#!/bin/bash

curl -X POST \
-H "Content-Type: application/json" \
"https://ujydmnmcxc.execute-api.us-east-1.amazonaws.com/v1" \
-d @- << EOF
{
  "answer": "def sum(x, y):\n\treturn x + y"
}
EOF
