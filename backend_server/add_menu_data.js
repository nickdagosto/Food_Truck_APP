const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("Connection successful!")
})


query = "INSERT INTO Menu values(?, ?, ?, 0)"
var order_time_init = "INSERT INTO order_time values(0, 0)"
var password_init = "INSERT INTO password values('foodtruck')"

db.run(query, ["Hamburger", "Bun, Lettuce, Tomato, Meat", 3.99])
db.run(query, ["Pizza", "Cheese, Sauce, Bread", 3.50])
db.run(query, ["French Fries", null, 2.99])
db.run(order_time_init)
db.run(password_init)


db.close((err) => {
    if (err) return console.error(err.message);
});