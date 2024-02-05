FROM node:18.12.1-alpine as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install
COPY . .

FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build /app /usr/share/nginx/html/app