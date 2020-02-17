import json
import os
import sys

def update_swagger_url(url):
    path_to_file = os.path.abspath("services/swagger/swagger.json")
    with open(path_to_file, "r") as file:
        data = json.load(file)
    data["servers"][0]["url"] = url
    with open(path_to_file, "w") as file:
        json.dump(data, file)
    return True
    
if __name__ == "__main__":
    try:
        update_swagger_url(sys.argv[1])
    except IndexError:
        print("Please provide a URL.")
        print("USAGE: python update_spec.py URL")
        sys.exit()
