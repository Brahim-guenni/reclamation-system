FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy built Angular app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/reclamation-frontend /usr/share/nginx/html-tmp
RUN if [ -d "/usr/share/nginx/html-tmp/browser" ]; then \
      cp -r /usr/share/nginx/html-tmp/browser/. /usr/share/nginx/html/; \
    else \
      cp -r /usr/share/nginx/html-tmp/. /usr/share/nginx/html/; \
    fi && rm -rf /usr/share/nginx/html-tmp

# Copy nginx template (uses envsubst to inject BACKEND_SERVICE_NAME)
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
# nginx docker image automatically runs envsubst on *.template files
