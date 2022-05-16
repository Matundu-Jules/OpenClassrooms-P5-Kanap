import "../css/style.css";
import "../css/product.css";
import { getProductID, saveCart, getCart } from "./function";

const btnAddToCart = document.querySelector("#addToCart");

/* ---------------------------------- FUNCTIONS ---------------------------------- */

//////// Requêtes HTTP \\\\\\\\

// Requete HTTP vers l'api - Récupération d'un produit grace à son id :
const requestProductByID = async () => {
  let productID = getProductID();
  let response = await fetch(`http://localhost:3000/api/products/${productID}`);

  if (response.ok) {
    return await response.json();
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

//////// PANIER \\\\\\\\

// Ajouter un produit au panier :
function addToCart(product) {
  let cart = getCart();

  // Vérifier si le produit est déja présent dans le panier :
  let productIsHere = cart.find(
    (p) => p.id == product.id && p.color == product.color
  );
  if (productIsHere === undefined) {
    cart.push(product);
  } else if (productIsHere.color != product.color) {
    cart.push(product);
  } else if (
    productIsHere.id === product.id &&
    productIsHere.color === product.color
  ) {
    productIsHere.quantity += product.quantity;
  }
  saveCart(cart);
}

// Afficher le produit sur la page produit :
const displayProduct = async () => {
  let product = await requestProductByID();

  // Création de l'image du produit, ajout attributs et affichage :
  const image = document.createElement("img");
  image.setAttribute("src", product.imageUrl);
  image.setAttribute("alt", product.altTxt);
  document.querySelector(".item__img").appendChild(image);

  // Ajout du contenu du titre h1 :
  document.querySelector("#title").innerText = product.name;

  // Ajout du prix :
  document.querySelector("#price").innerText = product.price;

  // Ajout de la description :
  document.querySelector("#description").innerText = product.description;

  // Ajout de la couleur :
  const arrayColors = product.colors;
  arrayColors.forEach((color) => {
    const optionColor = document.createElement("option");
    optionColor.setAttribute("value", color);
    optionColor.innerText = color;
    document.querySelector("#colors").appendChild(optionColor);
  });
};

displayProduct();

// Evenement au clic pour ajouter un article au panier.
btnAddToCart.addEventListener("click", () => {
  const colorsElem = document.querySelector("#colors");
  const quantity = document.querySelector("#quantity");

  // Création d'une erreur en cas de couleur non sélectionner et quantités <= 0 :
  let error = document.createElement("p");
  error.textContent = "Veuillez choisir une couleur et une quantité svp.";
  error.className = "error";
  error.style.color = "red";

  // Si la couleur n'est pas selectionner ou quantité inferieur ou egal à 0 :
  if (!colorsElem.value || quantity.value <= 0) {
    // Ajout du message d'erreur s'il n'est pas deja afficher :
    if (!document.querySelector(".error")) {
      quantity.after(error);
    }
    // Sinon si tout est selectionner et quantité supérieur à 0 :
  } else if (colorsElem.value && quantity.value > 0) {
    // Suppression du message d'erreur s'il y en a :
    if (document.querySelector(".error")) {
      document.querySelector(".error").remove();
    }

    // Création du produit à ajouter au panier :
    let product = {
      id: getProductID(),
      quantity: Number(quantity.value),
      color: colorsElem.value,
    };

    // Ajout du produit au panier :
    addToCart(product);
  }
});
