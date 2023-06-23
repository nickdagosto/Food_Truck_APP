var order_items = []
var shoppingCart = (function() {
    
    cart = [];
    
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    
    var obj = {};
    
    // add to cart
    obj.addToCart = function(name, price, count) {
      for(var item in cart) {
        if(cart[item].name == name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
    }
    // item count
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name == name) {
          cart[i].count = count;
          break;
        }
      }
    };
    // remove item
    obj.removeFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name == name) {
            cart[item].count--;
            if(cart[item].count == 0) {
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
  
    // Removes all of one item from cart
    obj.removeAllFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name == name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Clear cart
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
    // Count cart 
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
    // Total cart
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // List cart
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
    
    return obj;
  })();
  
  
  // Add item
  $('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addToCart(name, price, 1);
    displayCart();
  });
  
  // Clear items
  $('.clear-cart').click(function(event) {
    var button = $(this)
    if (button.text() == "Clear Cart" && cart.length > 0) {
      button.text("Confirm?");
      event.preventDefault();
    } else {
      // This code will execute on the second button click
    shoppingCart.clearCart();
    order_items = [];
    button.text("Clear Cart");
    displayCart();
    }
    
  });
  
  
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
      output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>" 
        + "<td style='white-space: nowrap;'>(" + cartArray[i].price.toFixed(2) + " ea.)</td>"
        + "<td style= 'white-space: nowrap;'> Qty: " + cartArray[i].count
        + "<td>$" + cartArray[i].total + "</td>" 
        +  "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }
  
  displayCart();


document.addEventListener('DOMContentLoaded', function (){
    fetch('http://192.168.43.1:5000/readMenu')
    .then(response => response.json())
    .then(data => loadMenuItems(data['data']));
});


function loadMenuItems(data){
  for(let i = 0; i < data.length; i++){
    var item_div = document.createElement("div");
     var tag = document.createElement("p");
     tag.style.display = 'inline-block';
     tag.style.verticalAlign = "center";
     if (data[i]["description"] != null){
          var text = document.createTextNode(data[i]["Item"] + ": " + data[i]["description"]);
      } else {
         var text = document.createTextNode(data[i]["Item"]);
     }
      tag.appendChild(text);
      item_div.appendChild(tag);
     var btn = document.createElement("button");
     btn.innerHTML = "Add to Order: $" + data[i]["price"].toFixed(2);
      btn.classList.add("addButton");
      btn.classList.add("add-to-cart");
       btn.setAttribute("data-name", data[i]["Item"]);
      btn.setAttribute("data-price", data[i]["price"]);
       btn.onclick = function () {
          addToOrder(data[i])
          event.preventDefault();
           var name = $(this).data('name');
           var price = Number($(this).data('price'));
           shoppingCart.addToCart(name, price, 1);
        displayCart();
      }
   
   item_div.appendChild(btn);
       item_div.classList.add("box");
       var div = document.getElementById("menu_items");
       div.appendChild(item_div);
   
   }
 
}

function addToOrder(json){
    var ordered_div = document.createElement("div");
    var div = document.getElementById("order");
    var tag = document.createElement("p");
    tag.classList.add("item_ordered");
    tag.innerHTML = json["Item"]+ "    ";
    ordered_div.appendChild(tag);
    var btn = document.createElement("button");
    btn.innerHTML = "Remove";
    btn.classList.add("removeButton");
    btn.onclick = function () {
        removeFromOrder(json["Item"]);
        div.removeChild(ordered_div);
    }
    ordered_div.appendChild(btn);
    div.appendChild(ordered_div);
    order_items.push(json["Item"]);
}

const orderBtn = document.getElementById("order-btn");
orderBtn.onclick = function () {
    var sum = 0;
    for(let i = 0; i < cart.length; i++){
       sum += cart[i].price * cart[i].count;
    }
    sum *= 1.0635
    const nameInput = document.getElementById("name-input");
    console.log(order_items);
    const name = nameInput.value;
    if(order_items.length == 0 && cart.length == 0){
      window.name = '';
      alert('Your cart is empty.');
      return;
    }
    if (name == ""){
      window.name = '';
      alert('Please enter your name!');
      return;
    }

    nameInput.value = "";
    
    fetch('http://192.168.43.1:5000/sendOrder', {
        headers: {
            'Content-type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({itemlist: order_items, name : name, cost : sum})
    })
    .then(response => response.json())
    .then(data => saveOrderId(data['data']));

    var order_div = document.getElementById("order")
    while (order_div.firstChild){
        order_div.removeChild(order_div.firstChild);
    }
    order_items = [];
    
}

function removeFromOrder(item_name){
    var new_order = [];
    var index = 0;
    for (let i = 0; i < order_items.length; i++){
        if(order_items[i] == item_name){
            index =i+1;
            break;
        } else {
            new_order.push(order_items[i])
        }
    }

    for(let i = index; i < order_items.length; i++){
        new_order.push(order_items[i])
    }

    order_items = new_order;
}

function removeAllFromOrder(item_name){ // (of one item)
  var new_order = [];
  var index = 0;
  for (let i = 0; i < order_items.length; i++){
      if(order_items[i] == item_name){
          index = i+1;
          break;
      } else {
          new_order.push(order_items[i])
      }
  }

  for(let i = index; i < order_items.length; i++){
      if (order_items[i] == item_name){
          break;
      } else {
          new_order.push(order_items[i]);
      }
  }

  order_items = new_order;
}


function saveOrderId(json){
  var id = json['order_id'];
  sessionStorage.setItem('orderId', id)
  location.href = "./summary.html"

}

function getOrderId(){
  return sessionStorage.getItem('orderId');
}

