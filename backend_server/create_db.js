const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("Connection successful!")
})

var menu_query = "CREATE TABLE Menu(Item varchar(255) PRIMARY KEY, description varchar(500), price float(3,2), num_ordered int)"
var orders_query = "CREATE TABLE orders(Name varchar(25), id int PRIMARY KEY, cost float(4, 2), flagged BOOLEAN, finished BOOLEAN, start_time varchar(8))"
var ordered_by_query = "CREATE TABLE ordered_by(order_id int, item_name varchar(255), FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY(item_name) REFERENCES Menu(Item) ON DELETE CASCADE ON UPDATE CASCADE)"
var order_time_query = "CREATE TABLE order_time(num_orders int, avg_time int)"
var past_order_query = "CREATE TABLE past_orders(Name varchar(25), id int PRIMARY KEY, cost float(4, 2))"
var past_ordered_by_query = "CREATE TABLE past_ordered_by(order_id int, item_name varchar(255), FOREIGN KEY(order_id) REFERENCES past_orders(id) ON DELETE CASCADE ON UPDATE CASCADE)"
var password_query = "CREATE TABLE password(pass varchar(100))"


db.run(menu_query)
db.run(orders_query)
db.run(ordered_by_query)
db.run(order_time_query)
db.run(past_order_query)
db.run(past_ordered_by_query)
db.run(password_query);

db.close((err) => {
    if (err) return console.error(err.message);
});