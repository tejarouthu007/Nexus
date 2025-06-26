FROM openresty/openresty:alpine

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

EXPOSE 9000

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
