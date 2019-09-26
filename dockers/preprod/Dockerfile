FROM node:8.12.0-alpine
ARG APP_DOMAIN=app.localhost
ARG GIT_TAG=release
ARG GIT_BRANCH=master
ARG GIT_URL=https://github.com/n8tz/www.mamasound.fr

RUN apk --no-cache update \
        && apk add --no-cache \
        python \
        python-dev \
        make \
        g++ \
        automake \
        autoconf \
        zlib-dev \
        libffi-dev \
        openssl-dev \
        mongodb-tools \
        bash \
        mongodb-tools \
        rsync \
        py-pip \
        git \
        certbot \
        nano \
        htop


ENV PATH=node_modules/.bin:$PATH
ENV APP_DOMAIN=${APP_DOMAIN}

RUN git clone $GIT_URL /home/app
WORKDIR /home/app
RUN git fetch --all --tags --prune
RUN git checkout -b $GIT_BRANCH || sleep 0
RUN git checkout tags/$GIT_TAG

RUN npm i
RUN npm run build

CMD node ./dist/api/App.server.js -p 80