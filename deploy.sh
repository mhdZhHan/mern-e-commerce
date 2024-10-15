#!/bin/bash

#=================================================================================
# Function Definitions
#=================================================================================

# Function to prompt for environment variables
prompt_env_vars() {
    local env_file=".env"
    local default_vars=("MONGODB_URL" "JWT_SECRET" "NODE_ENV" "PORT")
    
    if [ -f "$env_file" ]; then
        echo "Existing .env file found. Updating values..."
        source "$env_file"
    else
        echo "Creating new .env file..."
    fi

    for var in "${default_vars[@]}"; do
        read -p "Enter $var (current: ${!var}): " new_value
        if [ ! -z "$new_value" ]; then
            eval "$var='$new_value'"
        fi
    done

    # Prompt for additional variables
    while true; do
        read -p "Add another environment variable? (y/n): " add_more
        if [[ $add_more != "y" ]]; then
            break
        fi
        read -p "Enter variable name: " var_name
        read -p "Enter variable value: " var_value
        eval "$var_name='$var_value'"
    done

    # Write to .env file
    > "$env_file"
    for var in $(compgen -v); do
        if [[ ! "$var" =~ ^(BASH|HOSTNAME|HOME|PWD|SHELL|USER|_).*$ ]]; then
            echo "$var=\"${!var}\"" >> "$env_file"
        fi
    done

    echo ".env file updated successfully."
}

# Function to set up Nginx
setup_nginx() {
    local domain=$1
    local port=$2
    local config_path="/etc/nginx/sites-available/$domain"

    if [ -f "$config_path" ]; then
        echo "Nginx configuration for $domain already exists. Updating..."
        sudo rm "$config_path"
    fi

    sudo tee "$config_path" > /dev/null <<EOF
server {
    listen 80;
    server_name $domain;

    location / {
        proxy_pass http://127.0.0.1:$port;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    sudo ln -sf "$config_path" "/etc/nginx/sites-enabled/"
    sudo nginx -t && sudo systemctl reload nginx
}

#=================================================================================
# Main Script
#=================================================================================

echo "Enter the domain name (e.g., demo.mohammedsh.xyz):"
read DOMAIN_NAME

# Update and install dependencies
echo "Updating system and installing dependencies..."
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx curl software-properties-common

# Install Node.js and PM2
echo "Installing Node.js and PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install pm2 -g

# Set up environment variables
prompt_env_vars

# Install dependencies and build the app
echo "Installing dependencies and building the app..."
npm run build

# Start the app with PM2
REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)")
pm2 start npm --name "$REPO_NAME" -- run start

# Set up Nginx
setup_nginx "$DOMAIN_NAME" "$PORT"

# Set up SSL
echo "Setting up SSL with Certbot..."
sudo certbot --nginx -d "$DOMAIN_NAME"

# Configure firewall
echo "Configuring firewall..."
sudo apt install ufw -y
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "Deployment completed successfully for domain: https://$DOMAIN_NAME"
