const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Database file path
const DB_FILE = path.join(__dirname, 'orders_db.json');

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [] }));
}

// Load database
function loadDatabase() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Save to database
function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate unique order ID
function generateOrderId() {
  return 'ORD-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password'    // Replace with your email password or app password
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to place order
app.post('/api/place-order', (req, res) => {
  try {
    console.log('Received order request:', req.body);
    const { customerInfo, cartItems, totalAmount } = req.body;
    
    if (!customerInfo || !cartItems || cartItems.length === 0) {
      console.log('Invalid order data:', { customerInfo, cartItems, totalAmount });
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }
    
    // Load database or create if it doesn't exist
    let db;
    if (!fs.existsSync(DB_FILE)) {
      db = { orders: [] };
    } else {
      db = loadDatabase();
    }
    
    // Create new order
    const newOrder = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        paymentMethod: customerInfo.paymentMethod
      },
      items: cartItems,
      totalAmount,
      status: 'pending'
    };
    
    console.log('Saving new order:', newOrder);
    
    // Add to database
    db.orders.push(newOrder);
    saveDatabase(db);
    console.log('Order saved successfully');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order placed successfully', 
      orderId: newOrder.orderId
    });
    
  } catch (error) {
    console.error('Order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to get all orders
app.get('/api/orders', (req, res) => {
  try {
    console.log('Request received for all orders');
    // For now, let's handle the case where we might not have the database file yet
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [] }));
    }
    
    const db = loadDatabase();
    console.log(`Returning ${db.orders.length} orders`);
    return res.status(200).json(db.orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to update order status
app.put('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating order ${orderId} status to ${status}`);
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    const db = loadDatabase();
    const orderIndex = db.orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex === -1) {
      console.log(`Order ${orderId} not found`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    db.orders[orderIndex].status = status;
    saveDatabase(db);
    console.log(`Order ${orderId} status updated successfully`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order status updated',
      order: db.orders[orderIndex]
    });
    
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 