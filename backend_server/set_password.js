const sqlite3 = require('sqlite3').verbose()
const readline = require("readline");
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = new sqlite3.Database("./food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    //console.log("Connection successful!")
})


var query = "SELECT * FROM password"

r1.question("Enter Current Password: ", function(old_pass){
    db.all(query, [], (err, rows) => {
        if (err) return console.error(err.message);
        if (rows[0]["pass"] == old_pass){
            r1.question("Enter New Password: ", function(new_pass){
                var query2 = "UPDATE password SET pass=?;"
                db.run(query2, [new_pass], (err, rows) => {
                    if (err) return console.log(err.message);
                    console.log(`Password successfully set to ${new_pass}`);
                })
                db.close((err) => {
                    if (err) return console.error(err.message);
                    r1.close();
                });
            })
        } else {
            console.log("Incorrect password, please try again!")
            db.close((err) => {
                if (err) return console.error(err.message);
                r1.close();
            });
        }

       

    
    })
})

r1.on("close", function() {
    process.exit(0);
});