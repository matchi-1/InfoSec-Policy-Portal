FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000 \
    && npm ci --no-audit --no-fund

COPY . .

ARG VITE_BACKEND_API_BASE=http://localhost:8000
ARG VITE_ALLOW_EMAIL_DEV_BYPASS=false

ENV VITE_BACKEND_API_BASE=$VITE_BACKEND_API_BASE \
    VITE_ALLOW_EMAIL_DEV_BYPASS=$VITE_ALLOW_EMAIL_DEV_BYPASS

RUN npm run build


FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
