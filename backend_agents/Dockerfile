# Custom Langflow Dockerfile
FROM langflowai/langflow:1.4.2

# Install system dependencies for playwright
USER root
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
      libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements file first (for better Docker layer caching)
COPY requirements.txt /app/requirements.txt

# Install custom Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Install playwright browsers (run as root initially)
RUN playwright install chromium --with-deps

# Switch back to langflow user
USER langflow

# Create custom components directory
RUN mkdir -p /app/custom_components

# Copy custom components
COPY app/custom_components/ /app/custom_components/

# Set permissions
#RUN chmod -R 755 /app/custom_components

# Set environment variable for custom components path
ENV LANGFLOW_COMPONENTS_PATH=/app/custom_components

# Expose Langflow port
EXPOSE 7860

# Default command - no custom entrypoint needed
CMD ["langflow", "run", "--host", "0.0.0.0", "--port", "7860"]