# Hosting Pizza Paradise Website

This guide explains how to host the Pizza Paradise website on GitHub Pages and Render.com for free.

## Overview

The Pizza Paradise website consists of two main components:
1. **Customer Website** - The frontend for customers to browse menu and place orders
2. **Admin Panel** - The backend interface for restaurant staff to manage orders
3. **Backend API** - The server that processes orders and manages the database

We'll use the following free services:
- **GitHub Pages** - For hosting the static frontend (customer website)
- **Render.com** - For hosting the backend API and database

## Step 1: Host Frontend on GitHub Pages

1. Create a GitHub account if you don't have one (https://github.com/signup)
2. Create a new repository (e.g., `pizza-paradise`)
3. Push the `customer` folder content to the repository:

```bash
# Navigate to the customer folder
cd customer

# Initialize git and create first commit
git init
git add .
git commit -m "Initial customer website"

# Link to your GitHub repository (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/pizza-paradise.git
git branch -M main
git push -u origin main
```

4. Go to your repository settings on GitHub website
5. Navigate to "Pages" from the left sidebar
6. In the "Source" section, select "main" branch
7. Click "Save"
8. Your site will be published at `https://yourusername.github.io/pizza-paradise/`

## Step 2: Host Backend on Render.com

1. Create a Render.com account (https://render.com/signup)
2. From your dashboard, click "New Web Service"
3. Connect your GitHub account and select the same repository
4. Configure your service:
   - Name: `pizza-paradise-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Select the "Free" plan
5. Under "Advanced" settings, add environment variable:
   - KEY: `NODE_ENV` 
   - VALUE: `production`
6. Click "Create Web Service"
7. Render will deploy your API which will be available at: `https://pizza-paradise-api.onrender.com`

## Step 3: Connect Frontend to Backend

1. Open your customer folder and update the API_URL in main.js:
```javascript
const API_URL = 'https://pizza-paradise-api.onrender.com';
```

2. Push the changes:
```bash
git add .
git commit -m "Update API endpoint"
git push origin main
```

3. Open your admin.html file and update the API URL there too:
```javascript
const API_URL = 'https://pizza-paradise-api.onrender.com';
```

## Step 4: Accessing Your Website

- **Customer Website**: `https://yourusername.github.io/pizza-paradise/`
- **Admin Panel**: `https://yourusername.github.io/pizza-paradise/admin.html`
- **API Endpoint**: `https://pizza-paradise-api.onrender.com/api/orders`

## Important Notes

1. **Free Tier Limitations**:
   - Render free tier services will "sleep" after 15 minutes of inactivity
   - The first request after inactivity may take 30-60 seconds to respond
   - Maximum of 750 hours of service per month

2. **Custom Domain**:
   - If you have a custom domain, you can configure it in GitHub Pages settings
   - Render also allows custom domains on their free plan

3. **CORS Configuration**:
   - The server.js file is already configured to accept requests from GitHub Pages
   - If you change domain names, update the CORS configuration 