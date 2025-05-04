// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Menu Categories
    const menuCategories = document.querySelectorAll('.menu-category');
    const categoryItems = document.querySelectorAll('.category-items');

    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Update UI to show which category is active
            menuCategories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            // Populate/display the menu items for this category
            populateMenuItems(targetCategory);
            
            // Scroll to menu section if not already visible
            const menuSection = document.querySelector('#menu');
            const menuRect = menuSection.getBoundingClientRect();
            if (menuRect.top < 0 || menuRect.bottom > window.innerHeight) {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Testimonial Slider
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    if (prevBtn && nextBtn) {
        // Add more testimonials
        addTestimonials();

        // Initialize slider
        showSlide(currentSlide);

        // Next button
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        });

        // Previous button
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            showSlide(currentSlide);
        });
    }

    // Order Form
    const orderForm = document.getElementById('order-form');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-modal');

    // API URL - Change this to your Render.com URL when deployed
    const API_URL = 'https://pizza-paradise-api.onrender.com';
    // For local development, uncomment the line below:
    // const API_URL = 'http://localhost:3000';

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if cart is empty
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items to your cart before placing an order.');
                return;
            }
            
            // Get user input for area and address
            const area = document.getElementById('area').value;
            const address = document.getElementById('address').value;
            
            if (!area.trim()) {
                showNotification('Address Error', 'Please enter your area or locality', 'error');
                document.getElementById('area').focus();
                return;
            }
            
            if (!address.trim()) {
                showNotification('Address Error', 'Please enter your complete address details', 'error');
                document.getElementById('address').focus();
                return;
            }
            
            // Get form data and build full address
            const city = document.getElementById('city').value || 'Bilaspur';
            const state = document.getElementById('state').value || 'Rampur';
            const fullAddress = `${address}, ${area}, ${city}, ${state}, India`;
            document.getElementById('full-address').value = fullAddress;
            
            const customerInfo = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: fullAddress,
                paymentMethod: document.getElementById('payment').value
            };
            
            // Calculate total
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            const tax = subtotal * 0.05;
            const delivery = 20;
            const total = subtotal + tax + delivery;
            
            // Create loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.classList.add('loading-overlay');
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Processing your order...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
            
            console.log('Sending order to server:', {
                customerInfo,
                cartItems: cart,
                totalAmount: total.toFixed(0)
            });
            
            // Send order to server
            fetch(`${API_URL}/api/place-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerInfo,
                    cartItems: cart,
                    totalAmount: total.toFixed(0)
                })
            })
            .then(response => {
                console.log('Server response status:', response.status);
                return response.json();
            })
            .then(data => {
                // Remove loading overlay
                document.body.removeChild(loadingOverlay);
                console.log('Server response data:', data);
                
                if (data.success) {
                    // Update order ID in modal
                    document.getElementById('order-id').textContent = data.orderId;
                    
                    // Show order confirmation modal
                    orderModal.classList.add('active');
                    
                    // Clear cart and form
                    clearCart();
                    orderForm.reset();
                } else {
                    // Show error message
                    showNotification('Order Failed', data.message || 'Unable to place your order. Please try again.', 'error');
                }
            })
            .catch(error => {
                // Remove loading overlay
                if (document.body.contains(loadingOverlay)) {
                    document.body.removeChild(loadingOverlay);
                }
                
                console.error('Order error:', error);
                showNotification('Connection Error', 'Unable to connect to our servers. Please try again later.', 'error');
            });
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            orderModal.classList.remove('active');
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Initialize menu items
    populateMenuItems('pizza');
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const menuItem = e.target.closest('.menu-item');
            const name = menuItem.querySelector('h4').textContent;
            const image = menuItem.querySelector('img').src;
            
            // Check if it's a pizza or burger item with sizes
            const sizeInput = menuItem.querySelector('input[type="radio"]:checked');
            
            if (sizeInput) {
                // For items with sizes (pizza, burgers)
                const size = sizeInput.value;
                const price = parseInt(sizeInput.nextElementSibling.textContent.replace(/[^0-9]/g, ''));
                
                if (!size) {
                    alert('Please select a size');
                    return;
                }
                
                addToCart(name, price, size, image);
            } else {
                // For items with fixed price
                const priceElement = menuItem.querySelector('.item-price');
                if (priceElement) {
                    const price = parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));
                    addToCart(name, price, 'regular', image);
                } else {
                    const price = parseInt(e.target.dataset.price);
                    addToCart(name, price, 'regular', image);
                }
            }
        }
    });
    
    // Add notification stylesheet
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transition: bottom 0.3s ease;
        }
        
        .notification.show {
            bottom: 20px;
        }
        
        .notification i {
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);

    // Ensure menu category highlight stays when navigating
    const orderNowLinks = document.querySelectorAll('a[href="#order"]');
    
    // Keep menu category active after page load or navigation
    if (menuCategories && menuCategories.length > 0) {
        // Check if any category is active, if not, activate the first one (pizza)
        const activeCategory = document.querySelector('.menu-category.active');
        if (!activeCategory && menuCategories[0]) {
            menuCategories[0].classList.add('active');
            const targetCategory = menuCategories[0].getAttribute('data-category');
            populateMenuItems(targetCategory);
        }
    }
    
    // Add event listener to all "Order Now" links to navigate to the menu section if cart is empty
    if (orderNowLinks) {
        orderNowLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if cart is empty
                if (cart.length === 0) {
                    e.preventDefault();
                    
                    // Go to menu section
                    const menuSection = document.querySelector('#menu');
                    if (menuSection) {
                        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // Highlight the menu section
                        menuSection.classList.add('highlight');
                        setTimeout(() => {
                            menuSection.classList.remove('highlight');
                        }, 1500);
                        
                        // Auto-select pizza category
                        const pizzaCategory = document.querySelector('[data-category="pizza"]');
                        if (pizzaCategory) {
                            pizzaCategory.click();
                        }
                    }
                }
            });
        });
    }
});

// Cart Functionality
let cart = [];

// Add item to cart
function addToCart(name, price, size, image) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        cart[existingItemIndex].quantity++;
    } else {
        // Add new item to cart
        cart.push({
            name,
            price,
            size,
            image,
            quantity: 1
        });
    }
    
    // Update cart UI
    updateCart();
    
    // Show notification
    showNotification(`${name} (${size}) added to cart`);
}

// Update cart UI
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const checkoutForm = document.getElementById('order-form');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!cartItems) return;
    
    // Clear cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        // Replace empty cart message with Order Now section
        cartItems.innerHTML = `
            <div class="empty-cart-container">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p>Add delicious items from our menu to start your order</p>
                <button id="explore-menu-btn" class="cart-menu-btn">Explore Menu</button>
            </div>
        `;
        subtotalEl.textContent = '₹0';
        taxEl.textContent = '₹0';
        totalEl.textContent = '₹0';
        
        // Disable checkout form and button
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        }
        
        // Add event listener to explore menu button
        const exploreMenuBtn = document.getElementById('explore-menu-btn');
        if (exploreMenuBtn) {
            exploreMenuBtn.addEventListener('click', function(e) {
                // Go to menu section
                const menuSection = document.querySelector('#menu');
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Highlight the menu section for a moment
                menuSection.classList.add('highlight');
                setTimeout(() => {
                    menuSection.classList.remove('highlight');
                }, 1500);

                // Auto-select pizza category if none is active
                const activeCategory = document.querySelector('.menu-category.active');
                if (!activeCategory) {
                    const pizzaCategory = document.querySelector('[data-category="pizza"]');
                    if (pizzaCategory) {
                        pizzaCategory.click();
                    }
                }
            });
        }
        
        return;
    }
    
    // Enable checkout button if there are items in the cart
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
    }
    
    // Add cart items
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">${getSizeText(item.size)}</div>
            </div>
            <div class="cart-item-price">₹${item.price}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Calculate totals
    const tax = subtotal * 0.05;
    const delivery = 20;
    const total = subtotal + tax + delivery;
    
    // Update totals
    subtotalEl.textContent = '₹' + subtotal.toFixed(0);
    taxEl.textContent = '₹' + tax.toFixed(0);
    totalEl.textContent = '₹' + total.toFixed(0);
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity < 1) {
        removeFromCart(index);
        return;
    }
    
    updateCart();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Get size text
function getSizeText(size) {
    switch(size) {
        case 'small':
            return 'Small';
        case 'medium':
            return 'Medium';
        case 'large':
            return 'Large';
        case 'xlarge':
            return 'X-Large';
        default:
            return size;
    }
}

// Show notification
function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add active class after a small delay to trigger animation
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Show slide
function showSlide(n) {
    const slides = document.querySelectorAll('.testimonial-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
}

// Add testimonials
function addTestimonials() {
    const slider = document.querySelector('.testimonial-slider');
    
    if (!slider) return;
    
    const testimonials = [
        {
            name: 'Amit Patel',
            image: 'client.png',
            text: '"The Double Cheese Pizza is simply amazing! Perfectly cheesy and the crust is just right."',
            rating: 5
        },
        {
            name: 'Priya Singh',
            image: 'client.png',
            text: '"Fast delivery and the pizza was still hot. Farm Fresh is my favorite!"',
            rating: 4
        },
        {
            name: 'Rajesh Kumar',
            image: 'client.png',
            text: '"Best pizza in town, hands down! The Italian Treat with its fresh tomatoes is phenomenal."',
            rating: 5
        }
    ];
    
    testimonials.forEach(testimonial => {
        const slide = document.createElement('div');
        slide.classList.add('testimonial-slide');
        
        let stars = '';
        for (let i = 0; i < testimonial.rating; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        slide.innerHTML = `
            <div class="testimonial-content">
                <img src="${testimonial.image}" alt="Customer" class="customer-img">
                <p>${testimonial.text}</p>
                <h4>${testimonial.name}</h4>
                <div class="stars">
                    ${stars}
                </div>
            </div>
        `;
        
        slider.appendChild(slide);
    });
}

// Menu data
const menuData = {
    pizza: {
        'Veg Treat': [
            {
                name: 'Double Cheese Pizza',
                description: 'Loaded with extra cheese for ultimate cheese lovers',
                image: 'pizza-1.jpg',
                prices: { small: 129, medium: 252, large: 338, xlarge: 510 }
            },
            {
                name: 'Cheese & Corn',
                description: 'Classic combination of cheese and sweet corn',
                image: 'pizza-2.jpg',
                prices: { small: 129, medium: 252, large: 338, xlarge: 510 }
            }
        ],
        'Veg 1': [
            {
                name: 'Farm Fresh',
                description: 'Onion, Capsicum, Corn',
                image: 'pizza-3.jpg',
                prices: { small: 148, medium: 300, large: 453, xlarge: 677 }
            },
            {
                name: 'Italian Treat',
                description: 'Capsicum, Onion, Tomato',
                image: 'pizza-4.jpg',
                prices: { small: 148, medium: 300, large: 453, xlarge: 677 }
            },
            {
                name: 'Manhattan Pizza',
                description: 'With delicious Tandoori Sauce',
                image: 'pizza-5.jpg',
                prices: { small: 148, medium: 300, large: 453, xlarge: 677 }
            }
        ],
        'Veg 2': [
            {
                name: 'Classic Pizza',
                description: 'Onion, Corn, Mushroom',
                image: 'pizza-6.jpg',
                prices: { small: 191, medium: 358, large: 490, xlarge: 734 }
            },
            {
                name: 'Exotica Pizza',
                description: 'Onion, Jalapeno, Corn, Cheese',
                image: 'pizza-7.jpg',
                prices: { small: 191, medium: 358, large: 490, xlarge: 734 }
            },
            {
                name: 'Garden Treat',
                description: 'Capsicum, Red Pepper, Corn, Spicy Sauce',
                image: 'pizza-8.jpg',
                prices: { small: 191, medium: 358, large: 490, xlarge: 734 }
            }
        ],
        'Veg 3': [
            {
                name: 'Mexican Treat',
                description: 'Onion, Red Pepper, Corn, Black Olives',
                image: 'pizza-9.jpg',
                prices: { small: 220, medium: 448, large: 562, xlarge: 838 }
            },
            {
                name: 'Lazeez Pizza',
                description: 'Tikka Cubes, Onion, Mushroom, Capsicum, Jalapeno, Tandoori Sauce',
                image: 'pizza-10.jpg',
                prices: { small: 220, medium: 448, large: 562, xlarge: 838 }
            }
        ]
    },
    sides: [
        {
            name: 'Regular French Fries',
            description: 'Crispy golden French fries with our special seasoning',
            image: 'menu-1.jpg',
            price: 91
        },
        {
            name: 'Peri Peri Fries',
            description: 'French fries tossed in spicy peri peri seasoning',
            image: 'menu-3.jpg',
            price: 110
        },
        {
            name: 'Cheese Fries',
            description: 'Fries topped with melted cheese and herbs',
            image: 'menu-4.jpg',
            price: 120
        },
        {
            name: 'Tandoori Fries',
            description: 'Fries with our special tandoori masala',
            image: 'menu-5.jpg',
            price: 110
        },
        {
            name: 'Smileys',
            description: '5 pieces of smile-shaped potato snacks',
            image: 'menu-6.jpg',
            price: 91
        },
        {
            name: 'Nuggets',
            description: '5 pieces of crispy vegetable nuggets',
            image: 'menu-1.jpg',
            price: 91
        }
    ],
    wraps: [
        {
            name: 'Veg Wrap',
            description: 'Fresh vegetables wrapped in a soft tortilla',
            image: 'menu-3.jpg',
            price: 100
        },
        {
            name: 'Cheese Wrap',
            description: 'Vegetables and cheese wrapped in a soft tortilla',
            image: 'menu-4.jpg',
            price: 120
        },
        {
            name: 'Paneer Wrap',
            description: 'Spicy paneer with vegetables in a soft tortilla',
            image: 'menu-5.jpg',
            price: 120
        }
    ],
    pastas: [
        {
            name: 'White Sauce Pasta',
            description: 'Creamy pasta with herbs and vegetables',
            image: 'menu-1.jpg',
            price: 110
        },
        {
            name: 'Red Sauce Pasta',
            description: 'Tangy tomato pasta with herbs and vegetables',
            image: 'menu-4.jpg',
            price: 110
        },
        {
            name: 'Mix Sauce Pasta',
            description: 'Best of both worlds: white and red sauce combined',
            image: 'menu-5.jpg',
            price: 120
        }
    ],
    sandwiches: [
        {
            name: 'Veg Cheese Sandwich',
            description: '2 pieces of sandwich with fresh vegetables and cheese',
            image: 'menu-3.jpg',
            price: 100
        },
        {
            name: 'Grill Veg Cheese Sandwich',
            description: '2 pieces of grilled sandwich with vegetables and cheese',
            image: 'menu-4.jpg',
            price: 120
        },
        {
            name: 'Paneer Sandwich',
            description: '2 pieces of sandwich with spicy paneer filling',
            image: 'menu-5.jpg',
            price: 120
        }
    ],
    burgers: [
        {
            name: 'Single Veg Burger',
            description: 'Fresh vegetables in a soft bun',
            image: 'menu-1.jpg',
            sizes: { small: 30, medium: 60, large: 80 }
        },
        {
            name: 'Double Veg Burger',
            description: 'Double the veggies and flavors',
            image: 'menu-3.jpg',
            sizes: { small: 40, medium: 70, large: 90 }
        },
        {
            name: 'Cheese Burger',
            description: 'Veggies with melted cheese in a soft bun',
            image: 'menu-4.jpg',
            sizes: { small: 50, medium: 80, large: 100 }
        },
        {
            name: 'Paneer Burger',
            description: 'Spicy paneer patty with fresh vegetables',
            image: 'menu-5.jpg',
            sizes: { small: 60, medium: 90, large: 120 }
        }
    ],
    desserts: [
        {
            name: 'Vanilla Softie',
            description: 'Creamy vanilla soft serve ice cream',
            image: 'menu-1.jpg',
            price: 30
        },
        {
            name: 'Strawberry Softie',
            description: 'Creamy strawberry soft serve ice cream',
            image: 'menu-3.jpg',
            price: 30
        },
        {
            name: 'Choco Softie',
            description: 'Rich chocolate soft serve ice cream',
            image: 'menu-4.jpg',
            price: 30
        },
        {
            name: 'Mix Softie',
            description: 'Vanilla and chocolate twisted together',
            image: 'menu-5.jpg',
            price: 30
        },
        {
            name: 'Strawberry Shake',
            description: 'Creamy strawberry milkshake',
            image: 'menu-3.jpg',
            price: 91
        },
        {
            name: 'Chocolate Shake',
            description: 'Rich chocolate milkshake',
            image: 'menu-4.jpg',
            price: 91
        }
    ],
    drinks: [
        {
            name: 'Soft Drinks (Cold)',
            description: 'Refreshing cold beverages',
            image: 'menu-1.jpg',
            price: 32
        },
        {
            name: 'Cold Coffee',
            description: 'Refreshing cold coffee with ice cream',
            image: 'menu-3.jpg',
            price: 91
        },
        {
            name: 'Hot Coffee',
            description: 'Freshly brewed hot coffee',
            image: 'menu-4.jpg',
            price: 52
        },
        {
            name: 'Chocolate Shake',
            description: 'Rich chocolate milkshake',
            image: 'menu-5.jpg',
            price: 91
        },
        {
            name: 'Coke/Fanta/Sprite/Dew (Can)',
            description: 'Chilled soft drink in a can',
            image: 'menu-1.jpg',
            price: 60
        }
    ],
    special: [
        {
            name: 'Winter Special Pizza',
            description: 'Garmi Hat Ja Bhai - Our special winter pizza',
            image: 'pizza-11.jpg',
            price: 500
        }
    ]
};

// Populate menu items
function populateMenuItems(category) {
    const menuItems = document.querySelector('.menu-items');
    
    if (!menuItems || !menuData[category]) return;
    
    // Clear all category items first
    document.querySelectorAll('.category-items').forEach(item => {
        item.classList.remove('active');
    });
    
    // Create category items div if it doesn't exist
    let categoryItems = document.getElementById(`${category}-items`);
    
    if (!categoryItems) {
        categoryItems = document.createElement('div');
        categoryItems.classList.add('category-items');
        categoryItems.id = `${category}-items`;
        menuItems.appendChild(categoryItems);
    }
    
    // Clear the contents of the category
    categoryItems.innerHTML = '';
    // Add active class to make it visible
    categoryItems.classList.add('active');
    
    // If pizza, handle subcategories
    if (category === 'pizza') {
        // Get all subcategories
        const subcategories = Object.keys(menuData.pizza);
        
        // Create navigation controls for pizza subcategories
        const subcategoryNav = document.createElement('div');
        subcategoryNav.classList.add('subcategory-nav');
        subcategoryNav.innerHTML = `
            <div class="section-header">
                <h3>Pizza Types</h3>
                <p>Use the arrows to browse different pizza types</p>
            </div>
        `;
        categoryItems.appendChild(subcategoryNav);
        
        // Show the first subcategory initially
        let currentSubcategory = 0;
        
        // Function to display a specific subcategory
        function showSubcategory(index) {
            // Remove any existing subcategory content
            const existingSubcategory = categoryItems.querySelector('.subcategory');
            if (existingSubcategory) {
                existingSubcategory.remove();
            }
            
            // Create new subcategory
            const subcategoryName = subcategories[index];
            const subcategoryDiv = document.createElement('div');
            subcategoryDiv.classList.add('subcategory');
            subcategoryDiv.innerHTML = `
                <h3>${subcategoryName}</h3>
                <div class="subcategory-navigation">
                    <button class="prev-subcategory"><i class="fas fa-chevron-left"></i></button>
                    <button class="next-subcategory"><i class="fas fa-chevron-right"></i></button>
                </div>
            `;
            
            const menuGrid = document.createElement('div');
            menuGrid.classList.add('menu-grid');
            
            menuData.pizza[subcategoryName].forEach(item => {
                const menuItem = createPizzaItem(item);
                menuGrid.appendChild(menuItem);
            });
            
            subcategoryDiv.appendChild(menuGrid);
            categoryItems.appendChild(subcategoryDiv);
            
            // Add event listeners for navigation buttons
            const prevBtn = subcategoryDiv.querySelector('.prev-subcategory');
            const nextBtn = subcategoryDiv.querySelector('.next-subcategory');
            
            prevBtn.addEventListener('click', function() {
                currentSubcategory = (currentSubcategory - 1 + subcategories.length) % subcategories.length;
                showSubcategory(currentSubcategory);
            });
            
            nextBtn.addEventListener('click', function() {
                currentSubcategory = (currentSubcategory + 1) % subcategories.length;
                showSubcategory(currentSubcategory);
            });
        }
        
        // Show the initial subcategory
        showSubcategory(currentSubcategory);
        
    } else if (category === 'burgers') {
        // Handle burgers with sizes
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('section-header');
        categoryHeader.innerHTML = `<h3>Burgers</h3>`;
        categoryItems.appendChild(categoryHeader);
        
        const menuGrid = document.createElement('div');
        menuGrid.classList.add('menu-grid');
        
        menuData[category].forEach(item => {
            const menuItem = createBurgerItem(item);
            menuGrid.appendChild(menuItem);
        });
        
        categoryItems.appendChild(menuGrid);
    } else {
        // Handle other categories
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('section-header');
        categoryHeader.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
        categoryItems.appendChild(categoryHeader);
        
        const menuGrid = document.createElement('div');
        menuGrid.classList.add('menu-grid');
        
        menuData[category].forEach(item => {
            const menuItem = createMenuItem(item);
            menuGrid.appendChild(menuItem);
        });
        
        categoryItems.appendChild(menuGrid);
    }
}

// Create pizza menu item
function createPizzaItem(item) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    
    const sizesHtml = Object.entries(item.prices).map(([size, price]) => `
        <label>
            <input type="radio" name="size-${item.name.toLowerCase().replace(/\s+/g, '-')}" value="${size}">
            <span>${size.charAt(0).toUpperCase()}${size.slice(1, 2)} ₹${price}</span>
        </label>
    `).join('');
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="item-sizes">
                ${sizesHtml}
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;
    
    return menuItem;
}

// Create burger menu item
function createBurgerItem(item) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    
    const sizesHtml = Object.entries(item.sizes).map(([size, price]) => `
        <label>
            <input type="radio" name="size-${item.name.toLowerCase().replace(/\s+/g, '-')}" value="${size}">
            <span>${size.charAt(0).toUpperCase()}${size.slice(1, 2)} ₹${price}</span>
        </label>
    `).join('');
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="item-sizes">
                ${sizesHtml}
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;
    
    return menuItem;
}

// Create menu item for other categories
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="item-price">₹${item.price}</div>
            <button class="add-to-cart" data-price="${item.price}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener for non-pizza/burger items
    const addToCartBtn = menuItem.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        const name = item.name;
        const price = item.price;
        const image = item.image;
        
        addToCart(name, price, 'regular', image);
    });
    
    return menuItem;
}

// Reset location selectors after successful order
function resetLocationSelectors() {
    // Reset area input
    const areaInput = document.getElementById('area');
    if (areaInput) areaInput.value = '';
    
    // Reset address input
    const addressInput = document.getElementById('address');
    if (addressInput) addressInput.value = '';
    
    // Reset full address hidden field
    const fullAddressInput = document.getElementById('full-address');
    if (fullAddressInput) fullAddressInput.value = '';
}
