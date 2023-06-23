const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    //console.log("Connection successful!")
})


query = 'SELECT item, num_ordered FROM menu ORDER BY num_ordered DESC;'

db.all(query, (err, rows) => { 
    console.log("Item Name: Number Ordered")
    if (err) return console.error(err.message);
    for (var i = 0; i < rows.length; i++){
        var string = rows[i]["Item"] + ": " + rows[i]['num_ordered']
        console.log(string)
    }
});


db.close((err) => {
    if (err) return console.error(err.message);
});