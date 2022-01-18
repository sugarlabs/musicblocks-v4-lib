FROM alpine:latest 

RUN apk update \
    && apk add curl gnupg \
    && apk add nodejs npm

RUN npm install -g typescript

RUN npm install -g ts-node

LABEL org.opencontainers.image.description='An initial development image based on the official \
    Node.js (on Alpine LTS) image, and further configured with a HTTP server, TypeScript compiler, \
    and ts-node. This is merely to provide an execution sandbox and does not contain source files.'

WORKDIR /app

EXPOSE 5000 9000
