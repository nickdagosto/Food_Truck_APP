const checkButton = document.getElementById("check-status-btn");

document.addEventListener('DOMContentLoaded', function() {
    var sum = 0;
    for(let i = 0; i < cart.length; i++){
        sum += cart[i].price * cart[i].count;
    }
    sum *= 1.0635 // CT sales tax
    console.log(sum);
    console.log(cart)
    let data = cart;
    let items = document.getElementById("ordered");
    var text = document.createTextNode('list item content');;
    document.getElementById("output").innerHTML = "<hr>Your Total:  <strong>$" + sum.toFixed(2) + "</strong>";
    data.forEach(item => {
        let li = document.createElement("h5");
        li.innerText = item.count + " " + item.name + " $" + item.price;
        li.classList.add('Items')
        items.appendChild(li);
})
  });

checkButton.onclick = function () {
  var curr_order_id = getOrderId();
  console.log(curr_order_id)
  if (curr_order_id != -1){
    fetch('http://192.168.43.1:5000/checkOrderStatus', {
        headers: {
            'Content-type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({orderid : curr_order_id})
    })
    .then(response => response.json())
    .then(data => displayWarning(data["data"]));
  }
}

function getOrderId(){
    var item = sessionStorage.getItem('orderId');
    return item;
}

function displayWarning(json){
    console.log(json)
    if (json[0]['finished'] == 0){
        alert("Your order is not complete yet.");
    }
    if (json[0]['flagged'] == 1){
        var alert_div = document.getElementById("alert-div");
        if (document.querySelector("#alert-div p") == null){
            var tag = document.createElement("p");
            tag.setAttribute("id", "alert_text");
            var text = document.createTextNode("Your order was flagged! Please speak to an employee at the truck.");
            tag.appendChild(text);
            alert_div.appendChild(tag);
            alert("Your order was flagged! Please speak to an employee at the truck.")
        }
    } else if (json[0]['flagged'] == 0){
        var alert_div = document.getElementById("alert-div");
        if (document.querySelector("#alert-div p") != null){
            var tag = document.getElementById("alert_text");
            tag.remove();
        }
    }
    if (json[0]['finished'] == 1) {
        var fin_div = document.getElementById("finished-div");
        if (document.querySelector("#finished-div p") == null){
            var tag = document.createElement("p");
            tag.setAttribute("id", "fin_text")
            var text = document.createTextNode("Your order is ready for pickup!");
            tag.appendChild(text);
            fin_div.appendChild(tag);
        }
        alert("Your order is ready for pickup!")
    }
}