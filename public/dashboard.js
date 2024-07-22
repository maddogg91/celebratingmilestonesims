document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const blocks = document.querySelectorAll('.block');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const body = document.body;

    // Inventory tracking
    let inventory = {
        beer: {
            "Craft IPA": 100,
            "Pilsner": 150,
            "Stout": 80,
            "Wheat Beer": 90
        },
        wine: {
            "Cabernet Sauvignon": { bottles: 20, glasses: 100 },
            "Chardonnay": { bottles: 15, glasses: 75 },
            "Pinot Noir": { bottles: 18, glasses: 90 },
            "Sauvignon Blanc": { bottles: 22, glasses: 110 }
        },
        spirits: {
            "Vodka": { bottles: 10, shots: 170 },
            "Gin": { bottles: 8, shots: 136 },
            "Rum": { bottles: 12, shots: 204 },
            "Tequila": { bottles: 15, shots: 255 },
            "Whiskey": { bottles: 20, shots: 340 }
        }
    };

    const GLASSES_PER_WINE_BOTTLE = 5;
    const SHOTS_PER_LIQUOR_BOTTLE = 17;

    // Drinks menu
    const drinks = {
        signature: [
            "Something Old", "Something New", "Something Borrowed", "Golden Hour",
            "Newlywed", "The Honeymoon", "Something Blue", "Twisted Lemonade",
            "Berrylicious Breeze", "Coconut Dream", "Tropical Sunset", "Spiced Apple Fizz",
            "Lavender Bliss", "Ginger Zest Spritz", "Cucumber Cooler", "Peach Perfect",
            "Rosemary Refresher", "Basil Berry Smash", "Elderflower Elegance", "Mint Condition"
        ],
        beer: Object.keys(inventory.beer),
        wine: Object.keys(inventory.wine),
        spirits: Object.keys(inventory.spirits)
    };

    const barPackages = {
        basics: ["signature", "beer", "wine"],
        bravo: ["signature", "beer", "wine", "spirits"],
        bigtime: ["signature", "beer", "wine", "spirits"]
    };

    let currentOrder = [];
    let currentPackage = 'basics';
    let taxableAmount = 0;
    let transactions = [];
    let isCashBar = false;

    // Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const blockId = item.getAttribute('data-block');
            blocks.forEach(block => {
                block.classList.remove('active');
                if (block.id === `${blockId}-block`) {
                    block.classList.add('active');
                }
            });
            updateContentForBlock(blockId);
        });
    });

    // Theme toggle
    toggleThemeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        toggleThemeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        updateChartsTheme();
    });

    function updateContentForBlock(blockId) {
        switch (blockId) {
            case 'overview':
                updateOverviewCharts();
                break;
            case 'inventory':
                updateInventoryDisplay();
                updateInventoryCharts();
                break;
            case 'pos':
                initializePOS();
                break;
            case 'events':
                initializeEventCalendar();
                break;
            case 'revenue':
                updateRevenueCharts();
                updateTransactionsList();
                break;
            // Add cases for other blocks as needed
        }
    }

    // Chart color palette
    const colors = ['#00ffaa', '#00ffff', '#ff00ff', '#ffff00', '#ff00aa'];

    function updateOverviewCharts() {
        // Implement overview charts here
    }

    function updateInventoryCharts() {
        updateEventInventoryChart();
        updateOverallInventoryChart();
        updatePredictiveAnalyticsChart();
    }

    function updateEventInventoryChart() {
        // Implement event inventory chart
    }

    function updateOverallInventoryChart() {
        // Implement overall inventory chart
    }

    function updatePredictiveAnalyticsChart() {
        // Implement predictive analytics chart
    }

    function updateRevenueCharts() {
        updateSalesForecastChart();
        updateBenchmarkingChart();
    }

    function updateSalesForecastChart() {
        // Implement sales forecast chart
    }

    function updateBenchmarkingChart() {
        // Implement benchmarking chart
    }

    function initializePOS() {
        createDrinkMenu(currentPackage);
        document.getElementById('completeOrder').addEventListener('click', completeOrder);
        document.getElementById('cancelOrder').addEventListener('click', cancelOrder);
        document.getElementById('enableCashBar').addEventListener('click', enableCashBar);
    }

    function createDrinkMenu(package) {
        currentPackage = package;
        const drinkMenus = document.querySelector('.drink-list');
        drinkMenus.innerHTML = '';

        barPackages[package].forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('drink-category');
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryDiv.appendChild(categoryTitle);

            drinks[category].forEach(drink => {
                const button = document.createElement('button');
                button.classList.add('drink-button');
                button.textContent = drink;
                button.addEventListener('click', () => addToOrder(drink, category));
                categoryDiv.appendChild(button);
            });

            drinkMenus.appendChild(categoryDiv);
        });

        if (barPackages[package].includes('spirits')) {
            const shotButtons = createShotButtons();
            drinkMenus.appendChild(shotButtons);
        }
    }

    function createShotButtons() {
        const shotButtons = document.createElement('div');
        shotButtons.classList.add('shot-buttons');
        
        const shots = ['Single', 'Double', 'Triple', 'Neat'];
        shots.forEach(shot => {
            const button = document.createElement('button');
            button.classList.add('shot-button');
            button.textContent = shot;
            button.addEventListener('click', () => selectShot(shot));
            shotButtons.appendChild(button);
        });

        return shotButtons;
    }

    let selectedShot = null;

    function selectShot(shot) {
        selectedShot = shot;
        document.querySelectorAll('.shot-button').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === shot);
        });
    }

    function addToOrder(drink, category) {
        if (category === 'spirits' && !selectedShot) {
            alert('Please select a shot size for the spirit.');
            return;
        }

        let orderItem = { name: drink, category: category };

        if (category === 'spirits') {
            orderItem.shot = selectedShot;
            selectedShot = null;
            document.querySelectorAll('.shot-button').forEach(btn => btn.classList.remove('active'));
        }

        const existingItemIndex = currentOrder.findIndex(item => 
            item.name === orderItem.name && 
            item.category === orderItem.category && 
            (category !== 'spirits' || item.shot === orderItem.shot)
        );

        if (existingItemIndex !== -1) {
            currentOrder[existingItemIndex].quantity = (currentOrder[existingItemIndex].quantity || 1) + 1;
        } else {
            orderItem.quantity = 1;
            if (isCashBar) {
                orderItem.price = getDrinkPrice(orderItem);
            }
            currentOrder.push(orderItem);
        }

        updateOrderDisplay();
        updateInventory(orderItem);
        updateTaxableAmount(orderItem);
    }

    function getDrinkPrice(item) {
        // These prices are placeholders. Adjust based on your actual pricing.
        switch(item.category) {
            case 'beer':
                return 6;
            case 'wine':
                return 8;
            case 'spirits':
                if (item.shot === 'Single') return 10;
                if (item.shot === 'Double') return 12;
                if (item.shot === 'Triple') return 14;
                return 10;
            default:
                return 12; // Default price for other categories
        }
    }

    function updateOrderDisplay() {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '';
        let total = 0;

        currentOrder.forEach((item, index) => {
            const li = document.createElement('li');
            let itemText = `${item.quantity}X ${item.name}`;
            if (item.category === 'spirits') {
                itemText += ` (${item.shot})`;
            }
            if (isCashBar) {
                const itemTotal = item.price * item.quantity;
                itemText += ` - $${itemTotal.toFixed(2)}`;
                total += itemTotal;
            }
            li.textContent = itemText;
            li.addEventListener('click', () => removeOrderItem(index));
            orderList.appendChild(li);
        });

        if (isCashBar) {
            document.getElementById('orderTotal').textContent = total.toFixed(2);
        }
    }

    function removeOrderItem(index) {
        if (confirm('Are you sure you want to remove this item from the order?')) {
            const orderItem = currentOrder[index];
            orderItem.quantity--;
            if (orderItem.quantity === 0) {
                currentOrder.splice(index, 1);
            }
            updateOrderDisplay();
            updateTaxableAmount();
        }
    }

    function updateInventory(orderItem) {
        switch(orderItem.category) {
            case 'beer':
                inventory.beer[orderItem.name] -= orderItem.quantity;
                break;
            case 'wine':
                inventory.wine[orderItem.name].glasses -= orderItem.quantity;
                if (inventory.wine[orderItem.name].glasses % GLASSES_PER_WINE_BOTTLE === 0) {
                    inventory.wine[orderItem.name].bottles -= Math.floor(orderItem.quantity / GLASSES_PER_WINE_BOTTLE);
                }
                break;
            case 'spirits':
                let shotCount = orderItem.shot === 'Single' ? 1 : orderItem.shot === 'Double' ? 2 : orderItem.shot === 'Triple' ? 3 : 1;
                inventory.spirits[orderItem.name].shots -= shotCount * orderItem.quantity;
                if (inventory.spirits[orderItem.name].shots % SHOTS_PER_LIQUOR_BOTTLE === 0) {
                    inventory.spirits[orderItem.name].bottles -= Math.floor((shotCount * orderItem.quantity) / SHOTS_PER_LIQUOR_BOTTLE);
                }
                break;
        }
        updateInventoryDisplay();
    }

    function updateTaxableAmount(orderItem) {
        if (orderItem) {
            if (orderItem.category === 'spirits' || orderItem.category === 'wine') {
                // Assuming a flat rate per drink for simplicity
                taxableAmount += 0.50 * orderItem.quantity; // $0.50 per drink
            }
        } else {
            // Recalculate total taxable amount
            taxableAmount = currentOrder.reduce((total, item) => {
                if (item.category === 'spirits' || item.category === 'wine') {
                    return total + 0.50 * item.quantity;
                }
                return total;
            }, 0);
        }
    }

    function enableCashBar() {
        isCashBar = true;
        currentOrder.forEach(item => {
            item.price = getDrinkPrice(item);
        });
        updateOrderDisplay();
        alert('Cash bar enabled. Prices are now displayed.');
    }

    function completeOrder() {
        if (currentOrder.length === 0) {
            alert('No items in the order!');
            return;
        }

        const orderSummary = currentOrder.map(item => 
            `${item.quantity}X ${item.name}${item.category === 'spirits' ? ` (${item.shot})` : ''}`
        ).join(', ');

        const total = isCashBar ? 
            currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 
            0;

        const confirmMessage = `Order completed! Items: ${orderSummary}. ${isCashBar ? `Total: $${total.toFixed(2)}` : ''}`;

        if (confirm(confirmMessage)) {
            const transaction = {
                date: new Date().toLocaleDateString(),
                items: currentOrder.map(item => ({
                    name: item.name, 
                    price: item.price || 0, 
                    quantity: item.quantity
                })),
                total: total
            };
            transactions.push(transaction);
            currentOrder = [];
            updateOrderDisplay();
            updateTransactionsList();
            isCashBar = false;
        }
    }

    function cancelOrder() {
        if (confirm('Are you sure you want to cancel the order?')) {
            currentOrder = [];
            updateOrderDisplay();
            isCashBar = false;
        }
    }

    function updateTransactionsList() {
        const transactionsList = document.getElementById('recentTransactions');
        
        let listHTML = '';
        transactions.slice(-5).forEach(transaction => {
            listHTML += `
                <div class="transaction">
                    <div class="transaction-date">${transaction.date}</div>
                    <div class="transaction-items">
                        ${transaction.items.map(item => `
                            <div class="transaction-item">
                                <span class="item-name">${item.name} (x${item.quantity})</span>
                                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="transaction-total">Total: $${transaction.total.toFixed(2)}</div>
                </div>
            `;
        });
        
        transactionsList.innerHTML = listHTML;
    }

    function initializeEventCalendar() {
        const calendarEl = document.getElementById('eventCalendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [], // You can load events from your backend here
            editable: true,
            selectable: true,
            select: function(info) {
                // Handle date selection for creating new events
                console.log('Date selected:', info.startStr);
            },
            eventClick: function(info) {
                // Handle event click
                console.log('Event clicked:', info.event.title);
            }
        });
        calendar.render();

        // Event creation form handling
        const createEventForm = document.getElementById('createEventForm');
        createEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('eventTitle').value;
            const start = document.getElementById('eventStart').value;
            const end = document.getElementById('eventEnd').value;
            const barPackage = document.getElementById('eventPackage').value;

            // Add event to calendar
            calendar.addEvent({
                title: title,
                start: start,
                end: end,
                extendedProps: {
                    package: barPackage
                }
            });

            // Clear form
            createEventForm.reset();
        });
    }

    // Initialize the application
    function initializeApp() {
        updateOverviewCharts();
        initializePOS();
        initializeEventCalendar();
        updateInventoryDisplay();
        updateTransactionsList();

        // Make sure charts are responsive
        window.addEventListener('resize', () => {
            // Redraw charts here
        });
    }

    // Call the initialization function
    initializeApp();
});