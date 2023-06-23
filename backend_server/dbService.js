const sqlite3 = require("sqlite3").verbose()
let instance = null;

const connection = new sqlite3.Database("/data/data/com.termux/files/home/server/Food_Truck_APP/backend_server/food_truck.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("Connection successful!")
})


const keys_query = "PRAGMA foreign_keys = ON;"

connection.run(keys_query);

const keys_check = "PRAGMA foreign_keys"

connection.all(keys_check, [], (err, rows) => {
    if(err) console.error(err.message);
    console.log(rows);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getMenuItems() {
        try{
            const response = await new Promise((resolve, reject) =>{
                const query = "SELECT * FROM Menu";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getMenuItemInfo(item){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT Item, Description, Price FROM Menu WHERE Item=?;';
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getOrders() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM ordered_by INNER JOIN orders ON ordered_by.order_id = orders.id;";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getOrderInfo(orderid) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT item_name FROM ordered_by WHERE Order_id=?;";
                connection.all(query, [orderid], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async sendOrder(item_list, name, cost) {
        try{
            const response = await new Promise((resolve, reject) => {
                var init_query = "SELECT * FROM orders;"
                connection.all(init_query, (err, rows) => {
                    if (err) return console.error(err.message);
                    var curr_id = 0;
                    if (rows.length != 0){
                        curr_id = rows[rows.length - 1]['id'] + 1
                    }

                    var date = new Date()
                    var hours = parseInt(date.getHours())
                    var minutes = parseInt(date.getMinutes())
                    var seconds = parseInt(date.getSeconds())
                    var start_time = (hours * 3600) + (minutes * 60) + seconds
                    var query = 'INSERT INTO Orders values(?, ?, ?, false, false, ?);';
                    connection.run(query, [name, curr_id, cost, start_time], (err) => {
                        if (err) return console.error(err.message);
                    });

                    //iterate through each item ordered, add it to the list 
                    for (var i = 0; i < item_list.length; i++){
                        query = 'UPDATE menu SET num_ordered = num_ordered+1 WHERE Item=?;';
                        connection.run(query, [item_list[i]], (err) => {
                            if (err) return console.error(err.message);
                        });

                        query = 'INSERT INTO Ordered_by values(?, ?);';
                        connection.all(query, [curr_id, item_list[i]], (err, rows) => {
                            if (err) return console.error(err.message);
                        });
                    }
                


                    var obj = new Object()
                    obj.order_id = curr_id;
                    var jsonString = JSON.stringify(obj);
                    resolve(JSON.parse(jsonString));
                });
            });

            return response;
        } catch (error){
            console.log(error);
        }
    }

    async deleteOrder(order_id){
        try{
            const response = await new Promise((resolve, reject) => {
                var past_orders_init = "SELECT * FROM past_orders;"
                connection.all(past_orders_init, (err, rows) => {
                    if (err) return console.error(err.message);
                    if (rows.length != 0){
                        var id = rows[rows.length - 1]['id'];
                    } else {
                        var id = 0;
                    }
                    var del_order_id = id += 1;
                    var orders_query = "INSERT INTO past_orders SELECT orders.name, ?, orders.cost FROM orders WHERE id=?;"
                    connection.run(orders_query, [del_order_id, order_id], (err, rows) => {
                        if (err) return console.error(err.message);
                    });


                    var past_orders_query = "INSERT INTO past_ordered_by SELECT ?, ordered_by.item_name FROM ordered_by WHERE order_id=?"
                    connection.run(past_orders_query, [del_order_id, order_id], (err, rows) => {
                        if (err) return console.error(err.message);
                    });
                    var query = "DELETE FROM Orders WHERE Id=?;";
                    connection.run(query, [order_id], (err, rows) => {
                        if (err) return console.error(err.message);
                        resolve(rows);
                    });
                });
            });

            return response;

        } catch (error){
            console.log(error);
        }
    }

    async addItemToOrder(order_id, item_name){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO ordered_by VALUES(?, ?);";
                connection.run(query, [order_id, item_name], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })
            return response;

        } catch (error){
            console.log(error);
        }

    }

    async deleteItemFromOrder(order_id, item_name){
        try{
            const response = await new Promise((resolve, reject) => {
        
                var query = "SELECT * FROM ordered_by WHERE order_id=?;"
                connection.all(query, [order_id], (err, rows) => {
                    if (err) return console.error(err.message);
                    var curr_index = 0;
                    var new_item_list = [];
                    for (var i = 0; i < rows.length; i++){
                        curr_index++;
                        if (rows[i]['item_name'] == item_name){
                            break;
                        } else {
                            new_item_list.push(rows[i]['item_name'])
                        }
                    }

                    for (var i = curr_index; i < rows.length; i++){
                        new_item_list.push(rows[i]['item_name'])
                    }

                    query = "DELETE FROM ordered_by WHERE order_id=?;"
                    connection.run(query, [order_id], (err, rows) => {
                        if (err) return console.error(err.message);
                    })

                    for (var i = 0; i < new_item_list.length; i++){
                        query = "INSERT INTO ordered_by VALUES(?, ?);"
                        connection.run(query, [order_id, new_item_list[i]], (err, rows) => {
                            if (err) return console.error(err.message);
                        })
                    }
                    resolve(rows);
                });
            })
            return response;

        } catch (error){
            console.log(error);
        }
    }

    async addMenuItem(name, description, price){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO menu values(?, ?, ?, 0);";
                connection.run(query, [name, description, price], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
                
            })

            return response;
        } catch (error){
            console.log(error)
        }
    }

    async deleteMenuItem(name){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM menu WHERE item=?;";
                connection.run(query, [name], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
                
            })

            return response;
        
        } catch(error) {
            console.log(error)
        }
    }

    async getNumOrdered(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT item, num_ordered FROM menu ORDER BY num_ordered DESC;'
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;

        } catch(error){
            console.log(error)
        }
    }

    async getTotRevenue(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT price, num_ordered FROM menu;'
                var total = 0;
                connection.all(query, (err, rows) => {
                    if (err) return console.error(err.message);
                    if(rows == undefined){
                        total = 0;
                    } else {
                        for(var i = 0; i< rows.length; i++){
                            total += (rows[i].price * rows[i].num_ordered);
                        }
                    }
                    var obj = new Object()
                    obj.total = total;
                    var jsonString = JSON.stringify(obj);
                    resolve(JSON.parse(jsonString));
                    
                })
            })

            return response;
        } catch(error){
            console.log(error);
        }
    }

    async flagOrder(id) {
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE orders SET flagged=true WHERE id=?;'
                connection.run(query, [id], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                })
            })

            return response;
        } catch(error){
            console.log(error);
        }
    }

    async removeFlag(id) {
        try{
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE orders SET flagged=false WHERE id=?;'
                connection.run(query, [id], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                })
            })

            return response;
        } catch(error){
            console.log(error);
        }
    }
    

    async finishOrder(id) {
        try{
            const response = await new Promise((resolve, reject) => {
                var query = 'UPDATE orders SET finished=true WHERE id=?;'
                connection.run(query, [id], (err, rows) => {
                    if (err) return console.error(err.message);
                })

                query = "UPDATE order_time SET num_orders = num_orders+1"
                connection.run(query, [], (err) => {
                    if (err) return console.error(err.message);
                })

                var start_time;
                
                query = "SELECT start_time FROM orders WHERE id=?;"
                connection.all(query, [id], (err, rows) => {
                    if (err) return console.error(err.message);
                    start_time = rows[0]["start_time"]
                    var date = new Date()
                    var hours = parseInt(date.getHours())
                    var minutes = parseInt(date.getMinutes())
                    var seconds = parseInt(date.getSeconds())
                    var end_time = (hours * 3600) + (minutes * 60) + seconds
                    if ((start_time > 3599) && (end_time <= 3599)){
                        end_time += (13 * 3600)
                    }
    
                    var this_diff = end_time - start_time
                    query = "SELECT * FROM order_time;"
                    connection.all(query, [], (err, rows) => {
                        if (err) return console.error(err.message);
    
                        var curr_num = rows[0]["num_orders"];
                        var curr_average = rows[0]["avg_time"];
                        var new_average = ((curr_average * (curr_num - 1)) + this_diff) / curr_num

                        query = "UPDATE order_time SET avg_time=?"
                        connection.all(query, [new_average], (err, rows) => {
                            if (err) return console.error(err.message);
                            resolve(rows)
                        })
    
                    })

                })
            })

            return response;
        } catch(error){
            console.log(error);
        }
    }

    async getAvgOrderTime() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM order_time;";
                connection.all(query, (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async checkOrderStatus(orderid) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT flagged, finished FROM orders Where id=?";
                connection.all(query, [orderid], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getPastOrders() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM past_ordered_by INNER JOIN past_orders ON past_ordered_by.order_id = past_orders.id;";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async flushPastOrders() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM past_orders;";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async flushAvgOrderTime() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE order_time SET num_orders = 0, avg_time = 0;";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }

    }

    async flushNumberOrdered() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE menu SET num_ordered = 0;";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    resolve(rows);
                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async checkPassword(password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM password";
                connection.all(query, [], (err, rows) => {
                    if (err) return console.error(err.message);
                    var accept = false;
                    if (rows[0]["pass"] == password){
                        accept = true;
                    }

                    var obj = new Object()
                    obj.accept = accept;
                    var jsonString = JSON.stringify(obj);
                    resolve(JSON.parse(jsonString));

                });
            })

            return response;
        } catch (error) {
            console.log(error);
        }

    }

}

module.exports = DbService;
