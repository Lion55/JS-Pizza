/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
    
    require('./googleMap');

    var API = require('./API');
    
    //API.getPizzaList(function (err, pizza_list) {
        //if (!err) {
        PizzaCart.initialiseCart();
        PizzaMenu.initialiseMenu();
        //}else{
            //return console.error(err);
        //}
    //});
    
    $("#icon").click(function () {
        window.location.reload();
    });
    
    $(".reset").click(function () {
        PizzaCart.removeAll();
        PizzaCart.updateCart();
    });
    
    $('#all').click(function () {
        PizzaMenu.initialiseMenu();
    });

    $('#meat').click(function () {
        var filter = PizzaMenu.PizzaFilter.Meat;
        PizzaMenu.filterPizza(filter);
    });
    
    $('#pineapple').click(function () {
        var filter = PizzaMenu.PizzaFilter.Pineapple;
        PizzaMenu.filterPizza(filter);
    });
    
    $('#mushrooms').click(function () {
        var filter = PizzaMenu.PizzaFilter.Mushrooms;
        PizzaMenu.filterPizza(filter);
    });
    
    $('#seafood').click(function () {
        var filter = PizzaMenu.PizzaFilter.Seafood;
        PizzaMenu.filterPizza(filter);
    });
    
    $('#vega').click(function () {
        var filter = PizzaMenu.PizzaFilter.Vega;
        PizzaMenu.filterPizza(filter);
    });
        
    $('.order').click(function () {
        window.location = "order.html";
    });
    
    if($(".left-pannel").hasClass("order-html")){
        $('.minus').hide();
        $('.plus').hide();
        $('.remove').hide();
        $('.items').show();
    }
    
    if($(".left-pannel").hasClass("index-html")){
        $('.minus').show();
        $('.plus').show();
        $('.remove').show();
        $('.items').hide();
    }
    
    $('.edit-order').click(function (){
        window.location = "index.html";
    });
    
    var nameForm = $(".name-form");
    var numberForm = $(".number-form");
    var addressForm = $(".address-form");
    
    $("#name").on('input', function (event) {
        if ($("#name").val() == "" || /[0-9]/.test($("#name").val())) {
            nameForm.find(".has-error").attr("class", "status");
            nameForm.find(".has-success").attr("class", "status");
            nameForm.find(".status").attr("class", "has-error");
            nameForm.find(".help-block").css("display", "inline");
        } else {
            nameForm.find(".has-error").attr("class", "status");
            nameForm.find(".has-success").attr("class", "status");
            nameForm.find(".help-block").css("display", "none");
            nameForm.find(".status").attr("class", "has-success");
        }
    });

    $("#number").on('input', function () {
        if ($("#number").val() == "" || !($("#number").val().includes("+380")) || $("#number").val().length != 13) {
            numberForm.find(".has-error").attr("class", "status");
            numberForm.find(".has-success").attr("class", "status");
            numberForm.find(".status").attr("class", "has-error");
            numberForm.find(".help-block").css("display", "inline");
        } else {
            numberForm.find(".has-error").attr("class", "status");
            numberForm.find(".has-success").attr("class", "status");
            numberForm.find(".help-block").css("display", "none");
            numberForm.find(".status").attr("class", "has-success");
        }
    });

    $('.confirm').click(function () {
        var error = false;
        if ($("#name").val() == "" || /[0-9]/.test($("#name").val())) {
            error = true;
        }
        if ($("#number").val() == "" || !($("#number").val().includes("+380")) || $("#number").val().length != 13) {
            error = true;
        }
        if ($('#order-address').text() == "невідома") {
            error = true;
        }
        if (!($("#name").val())) {
            nameForm.find(".has-error").attr("class", "status");
            nameForm.find(".has-success").attr("class", "status");
            nameForm.find(".status").attr("class", "has-error");
            nameForm.find(".help-block").css("display", "inline");
            error = true;
        }
        if (!($("#number").val())) {
            numberForm.find(".has-error").attr("class", "status");
            numberForm.find(".has-success").attr("class", "status");
            numberForm.find(".status").attr("class", "has-error");
            numberForm.find(".help-block").css("display", "inline");
            error = true;
        }
        if(!($("#address").val())){
            addressForm.find(".has-error").attr("class", "status");
            addressForm.find(".has-success").attr("class", "status");
            addressForm.find(".status").attr("class", "has-error");
            addressForm.find(".help-block").css("display", "inline");
            error = true;
        }
        if(!error){
            API.createOrder(
                {
                    name: $("#name").val(),
                    phone: $("#number").val(),
                    address: $("#address").val(),
                    pizza: PizzaCart.getPizzaInCart()
                },
                function (err, result) {
                    if (err) {
                        alert("Can't create order");
                    } else {
                        LiqPayCheckout.init({
                            data: result.data,
                            signature: result.signature,
                            embedTo: "#liqpay",
                            mode: "popup"
                        }).on("liqpay.callback", function (data) {
                            console.log(data.status);
                            console.log(data);
                        }).on("liqpay.ready", function (data) {

                        }).on("liqpay.close", function (data) {
                            window.location = "http://localhost:5050/";
                        });
                    }
                });
        }
    })
});