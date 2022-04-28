import "../css/style.css";
import "../css/cart.css";

import { getCart, deleteProductCart } from "./function";

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

getProductByIDStorage();

const displayProducts = (dataProduct, cart) => {
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
  priceDescription.textContent = dataProduct.price;
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

  // div .cart__item__content__settings__delete :
  const divDelete = document.createElement("div");
  divDelete.className = "cart__item__content__settings__delete";
  divSettings.appendChild(divDelete);

  // p delete :
  const pDelete = document.createElement("p");
  pDelete.className = "deleteItem";
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);
  pDelete.addEventListener("click", (e) => {
    deleteProductCart(newArticle);
  });

  // Quantity :
  // document.querySelector("#totalQuantity").textContent =
  //   displayTotalQuantity(cart);

  // document.querySelector("#totalQuantity").textContent = ;
};

// let btnSupprimer = document.querySelector(".deleteItem");
// console.log(btnSupprimer);
