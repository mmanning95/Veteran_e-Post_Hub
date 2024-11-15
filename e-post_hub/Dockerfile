# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Install necessary packages to set up Selenium environment
RUN apt-get update && apt-get install -y wget unzip curl gnupg

# Install Microsoft Edge browser
RUN wget https://packages.microsoft.com/keys/microsoft.asc -q -O - | apt-key add - && \
    wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list -q -O /etc/apt/sources.list.d/microsoft-edge.list && \
    apt-get update && \
    apt-get install -y microsoft-edge-stable

# Install Microsoft Edge WebDriver
RUN EDGE_VERSION=$(microsoft-edge --version | sed 's/[^0-9.]*//g' | cut -d'.' -f1-3) && \
    wget -q "https://msedgedriver.azureedge.net/$EDGE_VERSION/edgedriver_linux64.zip" -O /tmp/edgedriver.zip && \
    unzip /tmp/edgedriver.zip -d /usr/local/bin/

# Install Python and pip (required for Selenium scripts)
RUN apt-get install -y python3 python3-pip

# Install Selenium and the Edge WebDriver manager
RUN pip3 install selenium webdriver-manager

# Set the command to run tests (replace `test:ci` with the appropriate npm command)
CMD [ "npm", "run", "test:ci" ]
