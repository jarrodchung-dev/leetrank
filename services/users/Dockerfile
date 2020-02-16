FROM python:3.8.0-alpine

RUN apk update && \
    apk add --virtual build-deps && \
    apk add --no-cache python3-dev openssl-dev libffi-dev gcc musl-dev && \
    pip3 install --upgrade pip && \
    apk add postgresql-dev && \
    apk add netcat-openbsd

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

COPY . /usr/src/app

CMD ["/usr/src/app/entrypoint.sh"]
