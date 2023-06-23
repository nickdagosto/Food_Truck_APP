const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    //console.log("Connection successful!")
})


query = 'SELECT * FROM order_time;'

db.all(query, (err, rows) => { 
    if (err) return console.error(err.message);
    console.log("Number of orders: " + rows[0]['num_orders'])
    console.log("Average order time: " + rows[0]['avg_time'] + " seconds")
});


db.close((err) => {
    if (err) return console.error(err.message);
});