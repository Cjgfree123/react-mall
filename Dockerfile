FROM nginx:stable-alpine

# Build on the local computer; the server only needs the static files.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/

RUN nginx -t
EXPOSE 80
