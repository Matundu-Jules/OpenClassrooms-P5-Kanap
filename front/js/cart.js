import "../css/style.css";
import "../css/cart.css";

import { saveCart, getCart } from "./function";

let cart = getCart();

/* ---------------------------------- FUNCTIONS ---------------------------------- */

//////// Requêtes HTTP \\\\\\\\

// Requête GET pour récupérer un seul produit via son id :
async function requestProductByID(idProduct) {
  let response = await fetch(`http://localhost:3000/api/products/${idProduct}`);

  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    console.error("Statut du serveur : ", response.status);
  }
}

// Requête POST : Envoi des données formulaire(obj contact) et du tableau d'id(product) :
async function sendOrder(contact, products) {
  let requetePost = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contact, products }),
  });

  if (requetePost.ok) {
    let data = await requetePost.json();
    return data;
  } else {
    console.error("Statut du serveur : ", requetePost.status);
  }
}

//////// PANIER \\\\\\\\

// Fonction de tri croissante pour l'id et la couleur :
function sortArray(x, y) {
  if (x.id < y.id) {
    return -1;
  }
  if (x.id > y.id) {
    return 1;
  }
  if (x.color < y.color) {
    return -1;
  }
  if (x.color > y.color) {
    return 1;
  }
  return 0;
}

// Récupérer un tableau contenant tout les ID des produits contenu dans le panier
function getArrayIDCart() {
  let cart = getCart();
  let arrayIDCart = [];

  cart.forEach((e) => {
    arrayIDCart.push(e.id);
  });

  return arrayIDCart;
}

// Trier le panier (localStorage) par id et couleur :
function sortLocalStorage(cart) {
  cart.sort(sortArray);
  saveCart(cart);
}

// Supprimer un article du panier :
async function deleteProductCart(article) {
  let cart = getCart();
  let id = article.dataset.id;
  let color = article.dataset.color;
  article.remove();

  cart = cart.filter((p) => p.color != color || p.id != id);

  saveCart(cart);

  document.querySelector("#totalQuantity").textContent = getTotalQuantity();
  document.querySelector("#totalPrice").textContent = await getTotalPrice(cart);
}

// Modifier la quantité d'un produit dans le panier :
async function changeQuantity(article, input) {
  let cart = getCart();
  let id = article.dataset.id;
  let color = article.dataset.color;
  let newQuantity = input.value;

  cart.forEach((element) => {
    if (input.value == 0) {
      deleteProductCart(cart, article);
    } else if (element.id == id && element.color == color) {
      element.quantity = newQuantity;
      saveCart(cart);
    }
  });

  document.querySelector("#totalQuantity").textContent = getTotalQuantity();
  document.querySelector("#totalPrice").textContent = await getTotalPrice(cart);
}

// Récupérer et additionner le prix des produits du panier :
async function getTotalPrice(cart) {
  let quantity;
  let price;
  let totalPrice = Number();
  for (let i = 0; i < cart.length; i++) {
    let dataProduct = await requestProductByID(cart[i].id);

    quantity = cart[i].quantity;
    price = dataProduct.price;

    totalPrice += quantity * price;
  }

  return totalPrice;
}

// Récupérer et additionner la quantité des produits du panier :
const getTotalQuantity = () => {
  let cart = getCart();
  let totalQuantity = 0;

  cart.forEach((i) => {
    totalQuantity += Number(i.quantity);
  });

  return totalQuantity;
};

//////// Gestion d'erreurs \\\\\\\\

// Création d'un message 'panier vide' :
async function msgCartIsEmpty(cart) {
  const empyCartMsg = document.createElement("p");
  empyCartMsg.className = "cart__item";
  empyCartMsg.textContent = "Votre panier est vide.";
  document.querySelector("#cart__items").append(empyCartMsg);

  document.querySelector("#totalQuantity").textContent = getTotalQuantity();
  document.querySelector("#totalPrice").textContent = await getTotalPrice(cart);
}

// Afficher le message d'erreur
function setError(element, errorMsg) {
  element.style.border = "3px solid red";
  const errorElem = element.nextElementSibling;
  errorElem.innerText = errorMsg;
}

// Afficher une validation sur les input correctement renseigné
function setSuccess(element) {
  element.style.border = "3px solid green";
  const errorElem = element.nextElementSibling;
  errorElem.innerText = "";
}

//////// REGEX \\\\\\\\

// Regex : Vérifier si une string contient un nombre ou pas
function hasNumber(string) {
  return /\d/.test(string);
}

// Regex : Vérifier si la string contient des car spéciaux autre que ceux indiquer
function hasSpecialChars(string) {
  return /[^a-zA-Zé'èçàäâîï-]/.test(string);
}

// Regex : Vérifier si l'adresse est bonne :
function isValidAddress(string) {
  return /^[0-9]{1,6}\s[a-zA-Zé'èçàäâîï]{1,15}\s[a-zA-Zé'èçàäâîï\s-]{1,30}$/.test(
    string
  );
}

// Regex : Vérifier si l'email est valide :
function isValidEmail(string) {
  return /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(string);
}

//////// Vérification Formulaire \\\\\\\\

// Vérification du firstname ou lastname
function nameVerif(nameElem, nameValue) {
  if (nameValue === "" || nameValue.length < 3) {
    let errorMsg = "Minimum 3 caractères.";
    setError(nameElem, errorMsg);
  } else if (hasNumber(nameValue)) {
    let errorMsg = "Le champ ne doit pas contenir de chiffres.";
    setError(nameElem, errorMsg);
  } else if (hasSpecialChars(nameValue)) {
    let errorMsg = "Caractères spéciaux non autorisé.";
    setError(nameElem, errorMsg);
  } else {
    setSuccess(nameElem);
    return nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
  }
}

// Vérification input adresse
function addressVerif(addressElem, addressValue) {
  if (addressValue === "" || addressValue.length < 8) {
    let errorMsg = "Minimum 8 caractères.";
    setError(addressElem, errorMsg);
  } else if (!isValidAddress(addressValue)) {
    let errorMsg = "Veuillez indiquer une addresse valide.";
    setError(addressElem, errorMsg);
  } else {
    setSuccess(addressElem);
    return addressValue;
  }
}

// Vérification input ville
function cityVerif(cityElem, cityValue) {
  if (cityValue === "") {
    let errorMsg = "Ce champ doit être renseigner.";
    setError(cityElem, errorMsg);
  } else if (hasNumber(cityValue)) {
    let errorMsg = "La ville ne peux pas contenir de numéro.";
    setError(cityElem, errorMsg);
  } else if (hasSpecialChars(cityValue)) {
    let errorMsg = "Caractères spéciaux non autorisé.";
    setError(cityElem, errorMsg);
  } else {
    setSuccess(cityElem);
    return cityValue.charAt(0).toUpperCase() + cityValue.slice(1);
  }
}

// Vérification Email
function emailVerif(emailElem, emailValue) {
  if (emailValue === "") {
    let errorMsg = "Veuillez renseigner une adresse email.";
    setError(emailElem, errorMsg);
  } else if (!isValidEmail(emailValue)) {
    let errorMsg = "Veuillez renseigner une adresse email valide.";
    setError(emailElem, errorMsg);
  } else {
    setSuccess(emailElem);
    return emailValue;
  }
}

// Vérification du formulaire :
function formVerify(
  firstNameElem,
  lastNameElem,
  addressElem,
  cityElem,
  emailElem
) {
  // Création d'un objet vide
  const contact = {};

  // Récupération des valeurs des inputs et suppressions ds espaces avant/après
  const firstNameValue = firstNameElem.value.trim();
  const lastNameValue = lastNameElem.value.trim();
  const addressValue = addressElem.value.trim();
  const cityValue = cityElem.value.trim();
  const emailValue = emailElem.value.trim();

  contact.firstName = nameVerif(firstNameElem, firstNameValue);
  contact.lastName = nameVerif(lastNameElem, lastNameValue);
  contact.address = addressVerif(addressElem, addressValue);
  contact.city = cityVerif(cityElem, cityValue);
  contact.email = emailVerif(emailElem, emailValue);

  return contact;
}

/* ---------------------------------- GLOBAL ---------------------------------- */

if (cart.length === 0) {
  msgCartIsEmpty(cart);
}

// Trier le localStorage par id et couleur :
sortLocalStorage(cart);

// Itérer dans le panier pour afficher tout les produits :
cart.forEach(async (productCart) => {
  // Récupérer les articles via leurs id :
  let product = await requestProductByID(productCart.id);

  //   Création des éléments, ajouts classes/attributs et affichage :
  const items = document.querySelector("#cart__items");
  const article = document.createElement("article");
  article.className = "cart__item";
  article.setAttribute("data-id", productCart.id);
  article.setAttribute("data-color", productCart.color);
  items.appendChild(article);

  const divImg = document.createElement("div");
  divImg.className = "cart__item__img";
  article.appendChild(divImg);

  const image = document.createElement("img");
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.altTxt);
  divImg.appendChild(image);

  const divItemContent = document.createElement("div");
  divItemContent.className = "cart__item__content";
  article.appendChild(divItemContent);

  const divDescription = document.createElement("div");
  divDescription.className = "cart__item__content__description";
  divItemContent.appendChild(divDescription);

  const h2Description = document.createElement("h2");
  h2Description.textContent = product.name;

  const colorDescription = document.createElement("p");
  colorDescription.textContent = productCart.color;

  const priceDescription = document.createElement("p");
  priceDescription.textContent = `${product.price} €`;
  divDescription.append(h2Description, colorDescription, priceDescription);

  const divSettings = document.createElement("div");
  divSettings.className = "cart__item__content__settings";
  divItemContent.appendChild(divSettings);

  const divQuantity = document.createElement("div");
  divQuantity.className = "cart__item__content__settings__quantity";
  divSettings.appendChild(divQuantity);

  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté :";

  const input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("class", "itemQuantity");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", productCart.quantity);
  divQuantity.append(pQuantity, input);

  const divDelete = document.createElement("div");
  divDelete.className = "cart__item__content__settings__delete";
  divSettings.appendChild(divDelete);

  const pDelete = document.createElement("p");
  pDelete.className = "deleteItem";
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);

  document.querySelector("#totalQuantity").textContent = getTotalQuantity();
  document.querySelector("#totalPrice").textContent = await getTotalPrice(cart);

  /* -------------- Events -------------- */

  // Evènement - Modifier la quantité d'un produit :
  input.addEventListener("change", async (e) => {
    changeQuantity(article, input);
  });

  // Evènement - Supprimer un produit du panier :
  pDelete.addEventListener("click", async (e) => {
    deleteProductCart(article);
    let cart = getCart();

    if (getTotalQuantity() === 0 && (await getTotalPrice(cart)) === 0) {
      msgCartIsEmpty(cart);
    }
  });
});

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
  const contact = formVerify(firstName, lastName, address, city, email);

  let products = getArrayIDCart();

  // Vérification si panier vide sinon rediriger l'user vers la confirmation :
  if (products.length === 0) {
    firstName.style.border = "3px solid red";
    lastName.style.border = "3px solid red";
    address.style.border = "3px solid red";
    city.style.border = "3px solid red";
    email.style.border = "3px solid red";

    const error = email.nextElementSibling;
    error.innerText =
      "Veuillez ajouter des produits à votre panier pour soumettre le formulaire.";
  } else {
    // Redirection page confirmation
    location.href = `./confirmation.html?id=${
      (await sendOrder(contact, products)).orderId
    }`;

    // Vider le panier
    localStorage.removeItem("panier");
  }
});
