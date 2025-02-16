FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration to handle environment variables
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the application port
EXPOSE 80

# Run the application
CMD ["nginx", "-g", "daemon off;"]