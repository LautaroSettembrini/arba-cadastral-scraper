# Use official Node.js LTS version
FROM node:18-slim

# Install dependencies required for Puppeteer
RUN apt-get update \
  && apt-get install -y wget --no-install-recommends \
  && apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
     libatk1.0-0 libcups2 libdbus-1-3 libnss3 libxcomposite1 libxrandr2 xdg-utils lsb-release libgbm-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["npm", "start"]