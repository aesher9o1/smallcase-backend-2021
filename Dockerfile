FROM node:14-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./

RUN apk add \
        build-base \
        libtool \
        autoconf \
        automake \
        python  && npm install

COPY . .

RUN npm run build

#Stage 2
FROM node:14-alpine

#Setting NODE_ENV to production so that app starts with production optimizations
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json ./

RUN apk add \
        build-base \
        libtool \
        autoconf \
        automake \
        python && npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
