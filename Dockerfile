# base from official Node (Alpine LTS) image
FROM node:lts-alpine 

# update npm
RUN npm install -g npm

# install typescript compiler
RUN npm install -g typescript

# install ts-node (to run/debug .ts files without manual transpiling)
RUN npm install -g ts-node

LABEL org.opencontainers.image.description='An initial development image based on the official \
    Node.js (on Alpine LTS) image, and further configured with TypeScript compiler and ts-node. \
    This is merely to provide an execution sandbox (for bind mounting source files) and \ 
    does not contain source files.'

WORKDIR /app

CMD [ "sh" ]
