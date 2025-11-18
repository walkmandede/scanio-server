# Node js run time as a parent image 
FROM node:24.5.0

# Set directory
WORKDIR /app

# Copy required config files to the container
COPY package*.json .

# Install dependencies
RUN npm install

# Copy application codes to the container
COPY . .

# Expose the port to run the app
EXPOSE 5003

# Define the command to run the app
CMD [ "node", "./src/app.js" ]