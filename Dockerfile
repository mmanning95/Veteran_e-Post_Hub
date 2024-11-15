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
RUN apt-get update && apt-get install -y wget unzip curl gnupg lsb-release apt-transport-https python3 python3-pip python3-venv

# Add Microsoft Edge's repository key and add it to sources
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-archive-keyring.gpg
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list

# Install Microsoft Edge browser
RUN apt-get update && apt-get install -y microsoft-edge-stable

# Install Microsoft Edge WebDriver
RUN wget -q "https://msedgedriver.azureedge.net/115.0.1901.203/edgedriver_linux64.zip" -O /tmp/edgedriver.zip && \
    unzip /tmp/edgedriver.zip -d /usr/local/bin/

# Install Python and pip (required for Selenium scripts)
RUN apt-get install -y python3 python3-pip

# Create a virtual environment and install Selenium and Edge WebDriver manager inside it
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install selenium webdriver-manager

# Set the environment variables to use the virtual environment
ENV PATH="/app/venv/bin:$PATH"

# Set the command to run tests (replace `test:ci` with the appropriate npm command)
CMD [ "npm", "run", "test:ci" ]

