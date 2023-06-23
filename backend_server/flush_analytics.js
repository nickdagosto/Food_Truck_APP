const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    //console.log("Connection successful!")
})

const keys_query = "PRAGMA foreign_keys = ON;"

connection.run(keys_query);

var past_query = "DELETE FROM past_orders;"
var time_query = "UPDATE order_time SET num_orders = 0, avg_time = 0;"
var pop_query = "UPDATE menu SET num_ordered = 0;"

db.run(past_query);
db.run(time_query);
db.run(pop_query);

db.close((err) => {
    if (err) return console.error(err.message);
});