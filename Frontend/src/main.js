/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    
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
});