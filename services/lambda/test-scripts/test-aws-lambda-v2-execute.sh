#!/bin/bash

echo "test v1 (true)"
curl -H "Content-Type: application/json" \
-X POST \
-d '{"answer":"def sum(x,y):\n    return x+y"}' \
$API_GATEWAY_URL/v1/exec
echo ""

echo "test v2: sum (true)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def sum(x,y):\n    return x+y",
    "test": "sum(20,30)",
    "solution": "50"
}
EOF
echo ""

echo "test v2: sum (false)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def sum(x,y):\n    return x+y",
    "test": "sum(20,30)",
    "solution": "incorrect"
}
EOF
echo ""

echo "test v2: diff (true)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def diff(x,y):\n    return x-y",
    "test": "diff(80, 20)",
    "solution": "60"
}
EOF
echo ""

echo "test v2: diff (false)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def diff(x,y):\n    return x-y",
    "test": "diff(80,20)",
    "solution": "incorrect"
}
EOF
echo ""

echo "test v2: sumlist (true)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def sumlist(x,y):\n    return x-y",
    "test": "sumlist([10, 11, 12, 13, 14, 15, 16])",
    "solution": "91"
}
EOF
echo ""

echo "test v2: sumlist (false)"
curl -H "Content-Type: application/json" -X POST \
$API_GATEWAY_URL/v2/exec \
-d @- << EOF
{
    "answer": "def sumlist(x,y):\n    return x-y",
    "test": "sumlist([10, 11, 12, 13, 14, 15, 16])",
    "solution": "incorrect"
}
EOF
echo ""