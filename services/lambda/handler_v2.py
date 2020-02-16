import sys

from io import StringIO


def lambda_handler(event, context):
    code = event["answer"]
    test = event["test"]
    solution = event["solution"]
    test_code = code + "\nprint(" + test + ")"
    buffer = StringIO()
    sys.stdout = buffer
    try:
        exec(test_code)
    except Exception:
        return False
    sys.stdout = sys.stdout
    if buffer.getvalue()[:-1] == solution:
        return True
    return False