import "../css/style.css";
import "../css/product.css";
import { addToCart, getProductID } from "./function";

const requestProductByID = async () => {
  let productID = getProductID();
  let response = await fetch(`http://localhost:3000/api/products/${productID}`);

  if (response.ok) {
    return await response.json();
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

// Fonction qui créer les éléments HTML et affiche le produit :
const displayProduct = async () => {
  let product = await requestProductByID();
  // console.log(product);
  // Ajout de l'image du produit + attribut alt :
  const newImg = document.createElement("img");
  newImg.setAttribute("src", product.imageUrl);
  newImg.setAttribute("alt", product.altTxt);
  document.querySelector(".item__img").appendChild(newImg);

  //   Ajout du contenu du titre h1 :
  document.querySelector("#title").innerText = product.name;

  //   Ajout du prix :
  document.querySelector("#price").innerText = product.price;

  //   Ajout de la description :
  document.querySelector("#description").innerText = product.description;

  // Ajout de la couleur :
  const colors = product.colors;
  colors.forEach((element) => {
    //     console.log(element);
    const newColor = document.createElement("option");
    newColor.setAttribute("value", element);
    newColor.innerText = element;
    document.querySelector("#colors").appendChild(newColor);
  });
};

displayProduct();

// Ajout de produit dans le panier :
const btnAddToCart = document.querySelector("#addToCart");
const colors = document.querySelector("#colors");
const quantity = document.querySelector("#quantity");

// Evenement au clic pour ajouter un article au panier.
btnAddToCart.addEventListener("click", (e) => {
  // Création d'une erreur en cas de couleur non choisis et quantités <=0 :
  let error = document.createElement("p");
  error.textContent = "Veuillez choisir une couleur et une quantité svp.";
  error.className = "error";
  error.style.color = "red";

  // Si la couleur n'est pas selectionner ou quantité inferieur ou egal à 0 :
  if (!colors.value || quantity.value <= 0) {
    // Ajout du message d'erreur s'il n'est pas deja afficher :
    if (!document.querySelector(".error")) {
      quantity.after(error);
    }
    // Sinon si tout est selectionner et quantité supérieur à 0 :
  } else if (colors.value && quantity.value > 0) {
    // Suppression du message d'erreur s'il y en a :
    if (document.querySelector(".error")) {
      document.querySelector(".error").remove();
    }

    // Récupérer la valeur de la couleur et la quantité :
    console.log(Number(quantity.value));
    let product = {
      id: getProductID(),
      quantity: Number(quantity.value),
      color: colors.value,
    };

    addToCart(product);
  }
});
