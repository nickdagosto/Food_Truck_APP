const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    //console.log("Connection successful!")
})

query = 'SELECT * FROM past_ordered_by INNER JOIN past_orders ON past_ordered_by.order_id = past_orders.id;'

db.all(query, (err, rows) => { 
    if (err) return console.error(err.message);
    var curr_id = -1
    var curr_name = ""
    for (var i = 0; i < rows.length; i++){
        if ((curr_id == -1) || ((curr_id != rows[i]['id']) || (curr_name != rows[i]["Name"]))) {
            if (curr_id != -1){
                console.log('\n')
            }
            curr_id = rows[i]["id"]
            curr_name = rows[i]["Name"]
            console.log("Name: " + curr_name + " | Id: " + curr_id.toString())
            console.log("\t" + rows[i]["item_name"])
        } else {
            console.log("\t" + rows[i]["item_name"])
        }
    }
});

db.close((err) => {
    if (err) return console.error(err.message);
});