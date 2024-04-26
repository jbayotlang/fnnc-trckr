# Builder image
FROM node:18.17-alpine as builder

LABEL org.opencontainers.image.authors="Jhudiel Bayotlang <sbayotlang@gmail.com>"

# install yung nestjs/cli globally
RUN npm i -g nestjs

# Create app directory
WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN set -xe \
    && yarn install --prefer-offline --frozen-lockfile \
    && yarn build \
    && yarn install --production --prefer-offline --frozen-lockfile


# Runtime image
FROM node:18.17-alpine

LABEL org.opencontainers.image.authors="Jhudiel Bayotlang <sbayotlang@gmail.com>"

# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
EXPOSE 3000 3001