import "../css/style.css";
import "../css/cart.css";
export { saveCart, getCart, addToCart };

// Sauvegarder le panier dans le localStorage
function saveCart(cart) {
  localStorage.setItem("panier", JSON.stringify(cart));
}

// Récupérer le panier du localStorage
function getCart() {
  let cart = localStorage.getItem("panier");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// Ajouter un produit au panier
function addToCart(product) {
  let cart = getCart();
  let productIsHere = cart.find(
    (p) => p.id == product.id && p.color == product.color
  );
  console.log(productIsHere);
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

//

// Afficher les éléments dans la page panier :
const request = async () => {
  //   let iDStorage = getIDStorage();
  //   console.log(iDStorage);
  let response = await fetch(`http://localhost:3000/api/products/${iDStorage}`);

  if (response.ok) {
    let data = await response.json();
    console.log(data);

    displayProductsCart(
      data.altTxt,
      data.colors,
      data.description,
      data.imageUrl,
      data.name,
      data.price,
      data.idProduct
    );
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

// request();

// function displayProductsCart(
//   altTxt,
//   colors,
//   description,
//   imageUrl,
//   name,
//   price,
//   idProduct
// ) {
//   let cart = getCart();
//   //   console.log(cart);
//   cart.reduce((acc, i) => {
//     console.log("acc : ", acc);
//     console.log("id : ", i.id);
//   }, {});
// }

// displayProductsCart();

function getIDStorage() {
  // get array cart
  let cart = getCart();
  console.log(cart);
  //   loop on cart for each element and display the element
  //   element = product object
  cart.forEach((element) => {
    console.log(element);
  });
  //   cart.reduce((acc, i) => {
  //     console.log("acc : ", acc);
  // //     Récupérer l'id des éléments dans le localStorage
  //     console.log("id : ", i.id);
  //   }, {});
}

getIDStorage();
