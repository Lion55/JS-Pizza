/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");


var itemsNum = 0;
var title = "Усі піци";

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
    $('.badge-left').text(itemsNum);
    $('.title-left-text').text(title);
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        
        if (pizza.type == filter || pizza.content.hasOwnProperty(filter)) {
            itemsNum += 1;
            pizza_shown.push(pizza);
        }
    });
    //Показати відфільтровані піци
    if(filter == "pineapple"){
        title = "Піца з ананасами";
    }else if(filter  == "mushroom"){
        title = "Піца з грибами";
    }else{
        title = filter;
    }
    showPizzaList(pizza_shown);
    itemsNum =0;
}

function initialiseMenu() {
    //Показуємо усі піци
    itemsNum = 8;
    showPizzaList(Pizza_List);
    itemsNum = 0;
}

var PizzaFilter = {
    Meat: "М’ясна піца",
    Pineapple: "pineapple",
    Mushrooms: "mushroom",
    Seafood: "Піца з морепродуктами",
    Vega: "Вега піца"
};


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
exports.PizzaFilter = PizzaFilter;