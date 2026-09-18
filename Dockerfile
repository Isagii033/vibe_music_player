# Use the official Nginx image as the base
FROM nginx:alpine

# Copy the web app files into the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Nginx starts automatically via the base image's CMD
