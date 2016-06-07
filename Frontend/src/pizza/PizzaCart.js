/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../Storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var itemsNum = 0;
var totalPrice = 0;

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var added = true;

    Cart.forEach(function (item) {
        if ((item.pizza.id == pizza.id) && (item.size == size)) {
            item.quantity += 1;
            itemsNum += 1;
            totalPrice += item.pizza[item.size].price;
            added = false;
        }
    });

    if (added == true) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        itemsNum += 1;
        totalPrice += pizza[size].price;
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    Cart.splice(Cart.indexOf(item), 1);
    itemsNum -= item.quantity;
    totalPrice -= (item.pizza[item.size].price) * (item.quantity);
    //Після видалення оновити відображення
    updateCart();
}

function removeAll(){
    Cart = [];
    itemsNum = 0;
    totalPrice = 0;
    totalPriceContr();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var savedPizza = Storage.get("cart");
    if (savedPizza) {
        Cart = savedPizza;
        Cart.forEach(function (item) {
            itemsNum += item.quantity;
            totalPrice += (item.pizza[item.size].price) * (item.quantity);
        });
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function totalPriceContr(){
    if (totalPrice === 0) {
        $('.total-price-text').hide();
        $('.total-price').hide();
        $('.order').prop("disabled", true);
    } else {
        $('.total-price-text').show();
        $('.total-price').show();
        $('.order').prop("disabled", false);
    }
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    $('.badge-right').text(itemsNum);
    $('.total-price').text(totalPrice + " грн");
    //Онволення однієї піци
    function showOnePizzaInCart(item) {
        var html_code = Templates.PizzaCart_OneItem(item);

        var $node = $(html_code);

       $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            item.quantity += 1;
            itemsNum += 1;
            totalPrice += item.pizza[item.size].price;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function () {
            //Збільшуємо кількість замовлених піц
            if (item.quantity > 1) {
                item.quantity -= 1;
                itemsNum -= 1;
                totalPrice -= item.pizza[item.size].price;
            } else {
                removeFromCart(item);
            }
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".remove").click(function () {
            removeFromCart(item);
            updateCart();
        });
        $cart.append($node);
    }
    
    totalPriceContr();
    Cart.forEach(showOnePizzaInCart);
    Storage.set("cart", Cart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;
exports.updateCart = updateCart;
exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.removeAll = removeAll;
exports.PizzaSize = PizzaSize;