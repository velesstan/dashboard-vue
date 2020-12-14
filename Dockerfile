FROM node:14.15.1 AS development
WORKDIR /dashboard
COPY package.json /dashboard
RUN npm install
COPY . /dashboard
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=development /dashboard/dist /usr/share/nginx/html
COPY --from=development /dashboard/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]