const express = require('express');
const app = express();
const cors = require('cors');

const dbService = require('./dbService.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//Read menu
app.get('/readMenu', (request, response) => {
    const db = dbService.getDbServiceInstance();
    
    const result = db.getMenuItems();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));

})

//Read menu item info
app.post('/readItemInfo', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { item } = request.body;

    const result = db.getMenuItemInfo(item);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//Read Orders
app.get('/readOrders', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getOrders();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//Read Menu Items from order
app.post('/readOrderInfo', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;

    const result = db.getOrderInfo(orderid);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//Send order
app.post('/sendOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { itemlist } = request.body;
    const { name } = request.body;
    const { cost } = request.body;

    const result = db.sendOrder(itemlist, name, cost);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))

})

//Delete order
app.post('/deleteOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;

    const result = db.deleteOrder(orderid);

    result
    .then(data => response.json({ success : true}))
    .catch(err => console.log(err))
})

//add individual item to specific order
app.post('/addItemToOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;
    const { item } = request.body;

    const result = db.addItemToOrder(orderid, item);

    result
    .then(data => response.json({ success : true}))
    .catch(err => console.log(err))

})

//delete individual item from specific order
app.post('/deleteItemFromOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;
    const { item } = request.body;

    const result = db.deleteItemFromOrder(orderid, item);

    result
    .then(data => response.json({ success : true}))
    .catch(err => console.log(err))
})

//Add to menu
app.post('/addMenuItem', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { item } = request.body;
    const { description } = request.body;
    const { price } = request.body;

    const result = db.addMenuItem(item, description, price);

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err))
})

//delete item from menu
app.post('/deleteMenuItem', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { item } = request.body;

    const result = db.deleteMenuItem(item);

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err))
})

//get number of items ordered for each item on the menu (ordered from most to least)
app.get('/getNumberOrdered', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getNumOrdered();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})

//get total revenue (based on number of items ordered)
app.get('/getTotalRevenue', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getTotRevenue();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))

})

//flag an order
app.post('/flagOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;

    const result = db.flagOrder(orderid);

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err))

})

//remove flag from an order
app.post('/removeFlag', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;

    const result = db.removeFlag(orderid);

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err))
})

//finish an order
app.post('/finishOrder', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body

    const result = db.finishOrder(orderid);

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err))
})

//get average time it takes for each order to be finished
app.get('/getAvgOrderTime', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAvgOrderTime();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})

//check if an order is flagged or finished 
app.post('/checkOrderStatus', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const { orderid } = request.body;

    const result = db.checkOrderStatus(orderid);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})

//get all past (deleted) orders
app.get('/getPastOrders', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getPastOrders();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//delete all stored past (deleted) orders
app.get('/flushPastOrders', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.flushPastOrders();

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err));
})

//flush average time metrics, reset to 0
app.get('/flushAvgTime', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.flushAvgOrderTime();

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err));
})

//flush number ordered metrics, reset all to 0
app.get('/flushNumberOrdered', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.flushNumberOrdered();

    result
    .then(data => response.json({success : true}))
    .catch(err => console.log(err));

})

app.post('/checkPassword', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const { password } = request.body;
    const result = db.checkPassword(password);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(5000, () => console.log('app is running'));