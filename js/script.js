/// slider-main

$("#slider-main").owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  dots: true,
  autoplay: true,
  autoplayTimeout: 5000,
  responsive: {
    0: {
      items: 1,
    },
  },
});

/// shop

const cart = document.querySelector(".cart");
const close = document.querySelector(".cart-close");
import { sets } from "./productsData.js";
import { rolls } from "./productsData.js";
import { pizza } from "./productsData.js";
import { wok } from "./productsData.js";
import { news } from "./productsData.js";

class ProductList {
  constructor(products, container) {
    this.products = products;
    this.container = container;
  }
  render() {
    for (let item of this.products) {
      item.quantity = item.quantity ? item.quantity : 1;
      let product = document.createElement("div");
      product.classList.add("product");
      item.special && product.classList.add(item.special);
      let img = document.createElement("img");
      img.src = item.img;
      let productText = document.createElement("div");
      productText.classList.add("product-text");
      let title = document.createElement("h3");
      title.textContent = item.title;
      let info = document.createElement("div");
      info.classList.add("product-info");
      info.innerHTML =
        (item.portion ? item.portion + " | " : "") + item.g + " | " + item.kkal;
      let order = document.createElement("div");
      order.classList.add("product-order");
      let price = document.createElement("p");
      price.textContent = item.price + " грн.";
      let btnWrapper = document.createElement("div");
      let btnMinus = document.createElement("button");
      btnMinus.textContent = "-";
      btnMinus.classList.add("change-btn");
      btnMinus.addEventListener("click", (e) =>
        this.updateQuantity(e, item, "remove")
      );
      let btnCount = document.createElement("span");
      btnCount.textContent = item.quantity;
      btnCount.classList.add("count-btn");
      let btnPlus = document.createElement("button");
      btnPlus.textContent = "+";
      btnPlus.classList.add("change-btn");
      btnPlus.addEventListener("click", (e) =>
        this.updateQuantity(e, item, "add")
      );
      let btnBuy = document.createElement("button");
      btnBuy.textContent = "в корзину";
      btnBuy.classList.add("buy-btn");
      btnBuy.addEventListener("click", () => updateCart(item, "add"));
      product.appendChild(img);
      productText.appendChild(title);
      productText.appendChild(info);
      order.appendChild(price);
      btnWrapper.appendChild(btnMinus);
      btnWrapper.appendChild(btnCount);
      btnWrapper.appendChild(btnPlus);
      order.appendChild(btnWrapper);
      productText.appendChild(order);
      productText.appendChild(btnBuy);
      product.appendChild(productText);
      this.container.appendChild(product);
    }
  }
  updateQuantity(e, item, countParam) {
    let product = this.products.find((product) => item.id === product.id);
    countParam === "add" ? (product.quantity += 1) : (product.quantity -= 1);
    if (product.quantity < 1) product.quantity = 1;
    e.target.parentNode.querySelector(".count-btn").innerHTML = item.quantity;
  }
}

const setList = new ProductList(sets, document.querySelector(".sets"));
setList.render();
const rollList = new ProductList(rolls, document.querySelector(".rolls"));
rollList.render();
const pizzaList = new ProductList(pizza, document.querySelector(".pizza"));
pizzaList.render();
const wokList = new ProductList(wok, document.querySelector(".wok"));
wokList.render();
const newsList = new ProductList(news, document.querySelector(".news"));
newsList.render();

// cart

class CartItem {
  constructor(item) {
    this.id = item.id;
    this.title = item.title;
    this.img = item.img;
    this.price = item.price;
    this.quantity = item.quantity;
  }
  render() {
    let product = document.createElement("div");
    product.classList.add("cart-product");
    let img = document.createElement("img");
    img.src = this.img;
    let title = document.createElement("h3");
    title.textContent = this.title;
    let btnMinus = document.createElement("button");
    btnMinus.textContent = "-";
    btnMinus.classList.add("change-btn");
    btnMinus.addEventListener("click", () => updateCart(this, "remove"));
    let btnCount = document.createElement("button");
    btnCount.textContent = this.quantity;
    btnCount.dataset.id = this.id;
    btnCount.classList.add("count-btn");
    let btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.classList.add("change-btn");
    btnPlus.addEventListener("click", () => updateCart(this, "add"));
    let price = document.createElement("p");
    price.textContent = this.price * this.quantity + "грн.";
    product.appendChild(img);
    product.appendChild(title);
    product.appendChild(btnMinus);
    product.appendChild(btnCount);
    product.appendChild(btnPlus);
    product.appendChild(price);

    return product;
  }
}

class Cart {
  constructor(products, container, counterIcon, priceContainer) {
    this.products = products;
    this.productsContainer = container;
    this.counterIcon = counterIcon;
    this.priceContainer = priceContainer;
    this.totalPrice = 0;
    this.counter = 0;
  }

  render() {
    this.totalPrice = 0;
    this.counter = 0;

    if (!this.products.length) {
      this.productsContainer.innerHTML = "<p>No products yet</p>";
      this.counterIcon.innerHTML = this.counter;
      this.priceContainer.innerHTML = this.totalPrice;
      return;
    }

    this.productsContainer.innerHTML = "";

    this.products.forEach((item) => {
      console.log(item);
      this.counter += item.quantity;
      this.totalPrice += item.quantity * item.price;
      let cartItem = new CartItem(item);
      this.productsContainer.appendChild(cartItem.render());
    });

    this.counterIcon.innerHTML = this.counter;
    this.priceContainer.innerHTML = this.totalPrice;
  }

  update(item) {
    let productInCart = this.products.find((product) => item.id === product.id);
    if (productInCart) {
      let newProducts = [];
      console.log("already in", productInCart.quantity);
      if (productInCart.quantity > 0) {
        newProducts = this.products.map((product) =>
          product.id === item.id ? item : product
        );
      } else {
        newProducts = this.products.filter((product) => product.id !== item.id);
        console.log("<0", newProducts);
      }
      this.products = newProducts;
    } else {
      this.products.push(item);
    }

    this.render();
  }
}

const shoppingCart = new Cart(
  [],
  document.querySelector(".cart-products"),
  document.querySelector(".cart-icon-count"),
  document.querySelector(".cart-price")
);

shoppingCart.render();

function updateCart(item, countParam) {
  let product = shoppingCart.products.find((product) => item.id === product.id);
  if (product) {
    if (countParam === "add") {
      product.quantity += 1;
    } else product.quantity -= 1;
    shoppingCart.update(product);
  } else {
    if (item.quantity < 1) item.quantity = 1;
    shoppingCart.update(item);
  }
}

///slider

if (window.innerWidth > 900) {
  class Slider {
    constructor(sliderContainer, current = 0) {
      this.sliderContainer = sliderContainer;
      this.slider = this.sliderContainer.querySelector(".slider");
      this.slide =
        (this.sliderContainer.querySelector(".product").offsetWidth + 25) * 4;
      this.buttonsContainer =
        this.sliderContainer.querySelector(".slider-buttons");
      this.prev = this.buttonsContainer.querySelector(".prev");
      this.next = this.buttonsContainer.querySelector(".next");
      this.maxSlide =
        this.sliderContainer.querySelectorAll(".product").length / 4;
      this.current = current;
    }
    render() {
      this.buttonsContainer.addEventListener("click", (e) => {
        this.changeSlide(e);
      });
    }
    changeSlide(e) {
      if (e.target == this.next || e.target.parentNode == this.next) {
        if (this.current > -this.maxSlide + 1) {
          this.current -= 1;
        }
      } else if (e.target == this.prev || e.target.parentNode == this.prev) {
        if (this.current < 0) {
          this.current = +this.current + 1;
        }
      } else if (e.target.classList.contains("dot")) {
        this.current = e.target.dataset.slide;
      }
      this.sliderContainer.querySelectorAll(".dot").forEach((item) => {
        if (item.dataset.slide == this.current) {
          item.classList.add("active");
        } else item.classList.remove("active");
      });
      this.slider.style.transform = `translate3d(${
        this.slide * this.current
      }px, 0, 0)`;
    }
  }

  const setSlider = new Slider(document.querySelector(".sets-wrapper"));
  setSlider.render();
  const rollSlider = new Slider(document.querySelector(".rolls-wrapper"));
  rollSlider.render();
  const pizzaSlider = new Slider(document.querySelector(".pizza-wrapper"));
  pizzaSlider.render();
  const wokSlider = new Slider(document.querySelector(".wok-wrapper"));
  wokSlider.render();
  const newsSlider = new Slider(document.querySelector(".news-wrapper"));
  newsSlider.render();
}

// popup cart

document.querySelector("#cart-open").addEventListener("click", function () {
  cart.classList.add("show");
});

close.addEventListener("click", function () {
  cart.classList.remove("show");
});


///modal

const backCall = document.querySelector('.back-call')
const modalCall = document.querySelector('.modal-call')
const closeCall = document.querySelector('.close-call')
backCall.addEventListener('click', function(e){
  modalCall.classList.remove('none')
})  
closeCall.addEventListener('click', function(e){
  modalCall.classList.add('none')
})  

const account = document.querySelector('#account-open')
const modalAcc = document.querySelector('.modal-acc')
const closeAcc = document.querySelector('.close-acc')
account.addEventListener('click', function(e){
  modalAcc.classList.remove('none')
})  
closeAcc.addEventListener('click', function(e){
  modalAcc.classList.add('none')
}) 
// modal.addEventListener('click', function(e){
//   e.preventDefault()
//   modal.classList.add('none')
// })   
// modal.querySelector('.card').addEventListener('click', function(e){
//     e.stopPropagation()
// })

// burger
if (window.innerWidth < 900) {

document.querySelector('.burger').addEventListener('click', ()=>{
  document.querySelector('.mobile').classList.toggle('show');
});
}
