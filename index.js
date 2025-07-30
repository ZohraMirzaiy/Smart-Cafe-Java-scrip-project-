// Global variables
let currentUser = null;
let selectedCoffees = []; // Changed to array for multiple selections
let orderData = null;

// Menu prices
const coffeePrices = {
    'espresso': 2.50,
    'latte': 3.50,
    'cappuccino': 4.00,
    'coffee-cake': 5.50,
    'croissant': 3.00,
    'cookie': 2.00
};

// Modal functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Reset to login section
    showSection('loginSection');
    // Focus on username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show specific section in modal
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('#loginModal > .modal-content > div').forEach(section => {
        section.classList.add('hidden');
    });
    // Show the specified section
    document.getElementById(sectionId).classList.remove('hidden');
}

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate credentials
    if ((username === 'admin' || username === 'user') && password === '1234') {
        currentUser = {
            username: username,
            role: username,
            securityLevel: username === 'admin' ? 'high' : 'low'
        };

        // Update UI
        document.getElementById('userName').textContent = username;
        document.getElementById('userRole').textContent = username;
        document.getElementById('securityLevel').textContent = currentUser.securityLevel;

        // Show user info section
        showSection('userInfoSection');
        
        // Show success message
        showAlert(`Welcome ${username}! You have successfully logged into Zohra's Smart Coffee.`);
        
        // After 2 seconds, show order section
        setTimeout(() => {
            showSection('orderSection');
        }, 2000);
    } else {
        showAlert('Invalid credentials! Please try again with admin/user and password 1234.');
    }
}

// Select coffee from menu
function selectCoffeeFromMenu(type) {
    selectedCoffees = [type]; // Initialize with single selection
    openLoginModal();
    // Show order section directly
    setTimeout(() => {
        showSection('orderSection');
        // Pre-select the coffee type
        document.querySelectorAll('.coffee-option').forEach(option => {
            option.classList.remove('selected', 'multiple-selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        updateSelectedItems();
    }, 500);
}

// Toggle coffee selection (multiple selection)
function toggleCoffee(type) {
    const index = selectedCoffees.indexOf(type);
    
    if (index > -1) {
        // Remove from selection
        selectedCoffees.splice(index, 1);
        document.querySelector(`[data-type="${type}"]`).classList.remove('selected', 'multiple-selected');
    } else {
        // Add to selection
        selectedCoffees.push(type);
        document.querySelector(`[data-type="${type}"]`).classList.add('multiple-selected');
    }
    
    updateSelectedItems();
}

// Update selected items display
function updateSelectedItems() {
    const selectedItemsDiv = document.getElementById('selectedItems');
    const selectedItemsList = document.getElementById('selectedItemsList');
    
    if (selectedCoffees.length > 0) {
        selectedItemsDiv.classList.remove('hidden');
        selectedItemsList.innerHTML = '';
        
        selectedCoffees.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'selected-item';
            
            // Get display name for each item
            const displayNames = {
                'espresso': 'Espresso',
                'latte': 'Latte',
                'cappuccino': 'Cappuccino',
                'coffee-cake': 'Coffee Cake',
                'croissant': 'Croissant',
                'cookie': 'Cookie'
            };
            
            itemDiv.innerHTML = `
                <span>${displayNames[item]} - $${coffeePrices[item].toFixed(2)}</span>
                <button class="remove-item" onclick="removeCoffee('${item}')">×</button>
            `;
            selectedItemsList.appendChild(itemDiv);
        });
    } else {
        selectedItemsDiv.classList.add('hidden');
    }
}

// Remove coffee from selection
function removeCoffee(type) {
    const index = selectedCoffees.indexOf(type);
    if (index > -1) {
        selectedCoffees.splice(index, 1);
        document.querySelector(`[data-type="${type}"]`).classList.remove('selected', 'multiple-selected');
        updateSelectedItems();
    }
}

// Calculate order
function calculateOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerAge = parseInt(document.getElementById('customerAge').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // Validate inputs
    if (!customerName) {
        showAlert('Please enter your name.');
        return;
    }
    if (!customerAge || customerAge < 1 || customerAge > 120) {
        showAlert('Please enter a valid age (1-120).');
        return;
    }
    if (selectedCoffees.length === 0) {
        showAlert('Please select at least one coffee type.');
        return;
    }
    if (!quantity || quantity < 1 || quantity > 10) {
        showAlert('Please enter a valid quantity (1-10).');
        return;
    }

    // Calculate prices for multiple items
    let originalTotal = 0;
    const coffeeDetails = [];
    
    selectedCoffees.forEach(item => {
        const pricePerItem = coffeePrices[item];
        const itemTotal = pricePerItem * quantity;
        originalTotal += itemTotal;
        coffeeDetails.push({
            type: item,
            price: pricePerItem,
            quantity: quantity,
            total: itemTotal
        });
    });
    
    // Apply discount for age < 18 or > 60
    const discount = (customerAge < 18 || customerAge > 60) ? originalTotal * 0.10 : 0;
    const finalTotal = originalTotal - discount;

    // Store order data
    orderData = {
        customerName: customerName,
        customerAge: customerAge,
        coffeeDetails: coffeeDetails,
        selectedCoffees: selectedCoffees,
        quantity: quantity,
        originalTotal: originalTotal,
        discount: discount,
        finalTotal: finalTotal
    };

    // Show results
    showOrderResults();
    
    // Show bill splitter section
    showSection('billSplitterSection');
}

// Show order results
function showOrderResults() {
    const resultsDiv = document.getElementById('orderResults');
    
    // Create item details HTML
    let itemDetailsHTML = '';
    
    // Display names for each item
    const displayNames = {
        'espresso': 'Espresso',
        'latte': 'Latte',
        'cappuccino': 'Cappuccino',
        'coffee-cake': 'Coffee Cake',
        'croissant': 'Croissant',
        'cookie': 'Cookie'
    };
    
    orderData.coffeeDetails.forEach(detail => {
        itemDetailsHTML += `<p>• ${detail.quantity}x ${displayNames[detail.type]} - $${detail.total.toFixed(2)}</p>`;
    });
    
    resultsDiv.innerHTML = `
        <div class="result">
            <h3>Hello ${orderData.customerName}!</h3>
            <p>You ordered:</p>
            ${itemDetailsHTML}
            <p><strong>Original total: $${orderData.originalTotal.toFixed(2)}</strong></p>
            <p>Discount: $${orderData.discount.toFixed(2)}</p>
            <p><strong>Final total: $${orderData.finalTotal.toFixed(2)}</strong></p>
        </div>
    `;
    showSection('resultsSection');
}

// Split bill
function splitBill() {
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const tipPercentage = parseInt(document.getElementById('tipPercentage').value);

    // Calculate tip and total
    const tipAmount = orderData.finalTotal * (tipPercentage / 100);
    const totalWithTip = orderData.finalTotal + tipAmount;
    const amountPerPerson = totalWithTip / peopleCount;

    // Create item details for final message
    let itemDetails = '';
    
    // Display names for each item
    const displayNames = {
        'espresso': 'Espresso',
        'latte': 'Latte',
        'cappuccino': 'Cappuccino',
        'coffee-cake': 'Coffee Cake',
        'croissant': 'Croissant',
        'cookie': 'Cookie'
    };
    
    orderData.coffeeDetails.forEach(detail => {
        itemDetails += `${detail.quantity}x ${displayNames[detail.type]}\n`;
    });

    // Show final results
    const finalMessage = `
Hello ${orderData.customerName}!
You ordered:
${itemDetails}
Original total: $${orderData.originalTotal.toFixed(2)}
Discount: $${orderData.discount.toFixed(2)}
Tip: $${tipAmount.toFixed(2)}
Total with Tip: $${totalWithTip.toFixed(2)}
Split between ${peopleCount} people: $${amountPerPerson.toFixed(2)} each
    `;

    showAlert(finalMessage);
}

// Show alert function
function showAlert(message) {
    alert(message);
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add enter key support for login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('loginSection').classList.contains('hidden')) {
            // If not on login page, do nothing
            return;
        }
        login();
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('loginModal');
    if (e.target === modal) {
        closeLoginModal();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                smoothScroll(target);
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });

    // Add animation on scroll for menu items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items and feature cards
    document.querySelectorAll('.menu-item, .feature-card, .gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
});

// Gallery and Feature Info Functions
function showGalleryInfo(type) {
    const galleryInfo = {
        'espresso-art': 'Our expert baristas create stunning latte art designs. From simple hearts to complex patterns, every cup is a masterpiece at Zohra\'s Smart Coffee!',
        'atmosphere': 'Relax in our cozy, warm atmosphere with comfortable seating, soft lighting, and the perfect ambiance for coffee lovers at Zohra\'s Smart Coffee.',
        'baristas': 'Our passionate baristas are trained in the art of coffee making. They bring years of experience and creativity to every cup at Zohra\'s Smart Coffee.',
        'beans': 'We source the finest coffee beans from around the world, ensuring premium quality and exceptional taste in every brew at Zohra\'s Smart Coffee.'
    };
    
    const message = galleryInfo[type] || 'Discover more about our coffee experience at Zohra\'s Smart Coffee!';
    showAlert(`☕ ${message}`);
}

function showFeatureInfo(type) {
    const featureInfo = {
        'smart-ordering': 'Our AI-powered system learns your preferences and suggests perfect coffee combinations based on your taste profile at Zohra\'s Smart Coffee!',
        'discounts': 'Students and seniors automatically get 10% off! No coupons needed - our system recognizes your eligibility instantly at Zohra\'s Smart Coffee.',
        'bill-splitting': 'Split bills with friends easily! Choose from 1-3 people and add tips automatically. No more math headaches at Zohra\'s Smart Coffee!',
        'fast-service': 'Get your order in seconds! Our streamlined process ensures quick service without compromising on quality at Zohra\'s Smart Coffee.'
    };
    
    const message = featureInfo[type] || 'Explore our amazing features at Zohra\'s Smart Coffee!';
    showAlert(`🚀 ${message}`);
} 