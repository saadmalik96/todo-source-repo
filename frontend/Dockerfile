# Build stage
FROM node:14 AS build
WORKDIR /app

# Set build-time environment variable for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Serve static files using a lightweight web server
FROM node:14-alpine
WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built React files from the previous stage
COPY --from=build /app/build /app/build

# Expose the default port for React apps
EXPOSE 80

# Start the frontend app with `serve`
CMD ["serve", "-s", "build", "-l", "80"]
