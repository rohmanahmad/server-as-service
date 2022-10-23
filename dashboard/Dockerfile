FROM --platform=linux/amd64 nginx:1.23.0

WORKDIR /usr/share/nginx/html

USER root

COPY ./nginx/webdefault.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/ssl /etc/nginx/conf.d/ssl
COPY ./public .

# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
RUN chmod -R 777 /var/cache/nginx /usr/share/nginx/html

RUN chmod -R 777 /etc/nginx/conf.d/ssl

# String replacetor
COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# users are not allowed to listen on priviliged ports
# RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080 443

# comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]