# Pizza Paradise Restaurant Website

A full-stack restaurant website with online ordering system and admin panel for order management.

## Project Organization

This project is organized into three main directories:

1. **`/customer`** - Contains the consumer-facing website for ordering food
2. **`/admin`** - Contains the admin interface for managing orders
3. **`/shared`** - Contains shared backend files and database

## Directories and Their Purpose

### Customer Directory
The customer directory contains all files necessary for the customer-facing website where users can:
- Browse the restaurant menu
- Place orders online
- Input delivery information
- Contact the restaurant

See the [Customer README](./customer/README.md) for more details.

### Admin Directory
The admin directory contains the restaurant's internal admin interface where staff can:
- View incoming orders
- Update order status
- Check order history
- Manage order fulfillment

See the [Admin README](./admin/README.md) for more details.

### Shared Directory
The shared directory contains backend components used by both applications:
- Express server
- API endpoints
- Database file
- Node.js dependencies

See the [Shared README](./shared/README.md) for more details.

## Getting Started

1. Install dependencies:
```
cd shared
npm install
```

2. Start the server:
```
npm start
```

3. Access the websites:
   - Customer site: http://localhost:3000/
   - Admin panel: http://localhost:3000/admin.html

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: JSON file (orders_db.json)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome
- **Fonts**: Google Fonts

## Features

### Customer Website
- Responsive design for all devices
- Interactive menu with categorized items
- Cart management with real-time updates
- Checkout process with delivery information
- Order confirmation and tracking

### Admin Dashboard
- Real-time order notifications
- Order management (view, update status)
- Order statistics and analytics
- Filter orders by status

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- NPM (v6 or higher)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd restaurant-website
```

2. Install dependencies:
```
npm install
```

3. Configure email notifications:
   - Open `server.js`
   - Update the email configuration in the nodemailer section with your SMTP details:
   ```javascript
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'your-email@gmail.com',    // Replace with your email
       pass: 'your-email-password'      // Replace with your password or app password
     }
   });
   ```
   - Update the recipient email in the `/api/place-order` route:
   ```javascript
   to: 'restaurant-owner@example.com',  // Replace with restaurant owner's email
   ```

4. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

5. Access the website and admin panel:
   - Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin.html

## How to Use the System

### For Customers
1. Browse the menu and select items
2. Customize items (size, etc.) if applicable
3. Add items to cart
4. Review cart and proceed to checkout
5. Fill in delivery details and submit order
6. Receive order confirmation with order ID

### For Restaurant Owners/Admins
1. Access the admin dashboard at `/admin.html`
2. View incoming orders in real-time
3. Track orders by status (pending, processing, completed, canceled)
4. Update order status as needed
5. View customer information and order details

## Database Information

The system uses a simple JSON file-based database stored in `orders_db.json`. This file is automatically created when the server starts for the first time.

For production use, you may want to replace this with a more robust database solution like MongoDB, MySQL, or PostgreSQL.

## Notifications

The system is set up to notify restaurant owners of new orders via:

1. Email notifications (needs configuration)
2. Real-time updates on the admin dashboard
3. SMS notifications (placeholder for integration)

## Extending the System

### Adding Payment Processing
The system is ready to integrate with payment gateways. Look for the payment method selection in the checkout process to add your preferred payment gateway.

### Custom Notifications
You can extend the notification system by:
- Uncommenting and configuring the email notification block in `server.js`
- Adding SMS notifications using services like Twilio
- Implementing push notifications for mobile apps

## License

This project is licensed under the MIT License - see the LICENSE file for details. 