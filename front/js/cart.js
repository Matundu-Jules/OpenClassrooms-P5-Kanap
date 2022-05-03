import "../css/style.css";
import "../css/cart.css";

import {
  getCart,
  deleteProductCart,
  getTotalQuantity,
  changeQuantity,
  formVerify,
  getArrayIDCart,
  sendOrder,
} from "./function";

// Afficher les éléments dans la page panier :
const requestProductByID = async (idProduct) => {
  let response = await fetch(`http://localhost:3000/api/products/${idProduct}`);

  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

// Fonction qui récupère un article du localStorage via son id :
const getProductByIDStorage = async () => {
  let cart = getCart();
  cart.forEach(async (element) => {
    let dataProduct = await requestProductByID(element.id);
    displayProducts(dataProduct, element);
  });
};

// Fonction qui additionne le prix total des produits dans le panier :
const getTotalPrice = async () => {
  let cart = getCart();
  let quantity;
  let price;
  let totalPrice = Number();
  for (let i = 0; i < cart.length; i++) {
    // console.log(cart);
    // console.log(cart[i]);
    // console.log(dataProduct);
    // console.log(quantity);
    // console.log(price);
    let dataProduct = await requestProductByID(cart[i].id);

    quantity = cart[i].quantity;
    price = dataProduct.price;

    totalPrice += quantity * price;
  }

  // console.log("totalPrice : ", totalPrice);
  return totalPrice;
};

getProductByIDStorage();

const displayProducts = async (dataProduct, cart) => {
  //   Création de l'article et affichage :
  const items = document.querySelector("#cart__items");
  const newArticle = document.createElement("article");
  newArticle.className = "cart__item";
  newArticle.setAttribute("data-id", cart.id);
  newArticle.setAttribute("data-color", cart.color);
  items.appendChild(newArticle);

  // div .cart__item__img :
  const divImg = document.createElement("div");
  divImg.className = "cart__item__img";
  newArticle.appendChild(divImg);

  // Ajout de l'image du produit + attribut alt :
  const newImg = document.createElement("img");
  newImg.setAttribute("src", dataProduct.imageUrl);
  newImg.setAttribute("alt", dataProduct.altTxt);
  divImg.appendChild(newImg);

  // div .cart__item__content :
  const divItemContent = document.createElement("div");
  divItemContent.className = "cart__item__content";
  newArticle.appendChild(divItemContent);

  // div .cart__item__content__description :
  const divDescription = document.createElement("div");
  divDescription.className = "cart__item__content__description";
  divItemContent.appendChild(divDescription);

  // h2 description, p color, p price :
  const h2Description = document.createElement("h2");
  h2Description.textContent = dataProduct.name;

  const colorDescription = document.createElement("p");
  colorDescription.textContent = cart.color;

  const priceDescription = document.createElement("p");
  priceDescription.textContent = `${dataProduct.price} €`;
  divDescription.append(h2Description, colorDescription, priceDescription);

  // div .cart__item__content__settings :
  const divSettings = document.createElement("div");
  divSettings.className = "cart__item__content__settings";
  divItemContent.appendChild(divSettings);

  // div .cart__item__content__settings__quantity :
  const divQuantity = document.createElement("div");
  divQuantity.className = "cart__item__content__settings__quantity";
  divSettings.appendChild(divQuantity);

  // p quantity, input
  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté :";

  const input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("class", "itemQuantity");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", cart.quantity);
  divQuantity.append(pQuantity, input);

  // Event Quantity :
  input.addEventListener("change", async (e) => {
    changeQuantity(newArticle, input);
    document.querySelector("#totalQuantity").textContent = getTotalQuantity();
    document.querySelector("#totalPrice").textContent = await getTotalPrice();
  });

  // div .cart__item__content__settings__delete :
  const divDelete = document.createElement("div");
  divDelete.className = "cart__item__content__settings__delete";
  divSettings.appendChild(divDelete);

  // p delete :
  const pDelete = document.createElement("p");
  pDelete.className = "deleteItem";
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);

  // Event Delete :
  pDelete.addEventListener("click", async (e) => {
    deleteProductCart(newArticle);
    document.querySelector("#totalQuantity").textContent = getTotalQuantity();
    document.querySelector("#totalPrice").textContent = await getTotalPrice();
  });

  // Quantity :
  document.querySelector("#totalQuantity").textContent = getTotalQuantity();

  // Price :
  document.querySelector("#totalPrice").textContent = await getTotalPrice();
};

/* ---------------------------------- Formulaire ---------------------------------- */
// Récupération des éléments HTML :
const form = document.querySelector(".cart__order__form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

// Soumission du formulaire :
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contact = formVerify(form, firstName, lastName, address, city, email);

  console.log("log contact event : ", contact);

  let products = getArrayIDCart();
  console.log("Array of ID : ", products);

  // let order = JSON.stringify(contact) + JSON.stringify(arrayIDCart);
  // let test = JSON.stringify({ contact, products });
  // console.log(test);

  // Envoie de la requete
  let dataResponsePost = await sendOrder(contact, products);
  console.log(dataResponsePost);
});
