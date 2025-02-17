FROM node:22-alpine3.20 AS builder

WORKDIR /app

COPY public public
COPY src src
COPY ["*.json", "*.html", "*.ts", "*.cjs", "./"]

RUN npm ci
RUN npm run build

# --- --- --- --- --- --- #

FROM nginx:alpine3.20

ARG htmldir=/usr/share/nginx/html

COPY dockerfiles/nginx.conf /etc/nginx/nginx.conf
COPY dockerfiles/default.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx \
  ${htmldir} \
  /etc/nginx \
  /var/cache/nginx \
  /var/log/nginx

WORKDIR ${htmldir}

USER nginx

COPY --chown=nginx:nginx --from=builder /app/dist ./

EXPOSE 8080
