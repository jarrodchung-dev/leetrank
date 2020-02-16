# Base Image
FROM python:3.7.4-slim

# Installs netcat
RUN apt-get update && \
    apt-get -y install netcat && \
    apt-get clean

# Sets the working directory
WORKDIR /usr/src/app

# Adds and installs Python dependencies
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# Adds entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Adds the application
COPY . /usr/src/app

# Runs the server
CMD ["/usr/src/app/entrypoint.sh"]