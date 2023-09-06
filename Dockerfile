# Stage 1: Build the Node.js application
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN mv .env.sample .env

# Stage 2: Create the production image with a smaller base image
FROM node:20-alpine

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app .

CMD [ "node", "index.js" ]  # Replace "your-script.js" with the actual name of your Node.js script