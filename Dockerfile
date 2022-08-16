# Use an official Node runtime as a parent image
FROM node:16
ENV NODE_VERSION 16.16.0

# Set the working directory to /app
WORKDIR '/app'

# Copy package.json to the working directory
COPY package.json /app

# Install any needed packages specified in package.json
RUN npm install --legacy-peer-deps

# Copying the rest of the code to the working directory
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run index.js when the container launches
CMD ["npm", "start"]

