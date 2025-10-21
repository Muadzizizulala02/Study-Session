# Stage 1: Use an official Node.js runtime as a parent image.
# 'alpine' is a very small, secure version of Linux.
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json first.
# This leverages Docker's layer caching. If these files don't change,
# Docker won't re-run 'npm install' on subsequent builds, making them much faster.
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code into the container at /app
COPY . .

# Make port 5001 available to the outside world
EXPOSE 5001

# Define the command to run your app
CMD [ "npm", "start" ]