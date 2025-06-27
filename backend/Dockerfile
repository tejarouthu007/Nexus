# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code (e.g., index.js, .env, etc.)
COPY . .

# Expose the port your app uses (change if needed)
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
