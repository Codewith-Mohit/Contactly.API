# Stage 1: build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production=false
RUN npm install
# Copy the application source and build it
COPY . .
RUN npm run build -- --configuration production

# remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Stage 2: serve with nginx
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist/contactly.web/browser/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
