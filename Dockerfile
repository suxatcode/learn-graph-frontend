FROM node:18.10.0 AS builder
WORKDIR /src
ENV NODE_ENV=production
COPY . package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
ENV NODE_ENV=production
COPY --from=builder /src/build /usr/share/nginx/html
EXPOSE 80
LABEL app="learngraph-frontend"
CMD ["nginx", "-g", "daemon off;"]
