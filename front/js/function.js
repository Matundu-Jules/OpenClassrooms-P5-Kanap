export { getProductID, saveCart, getCart, addToCart, deleteProductCart };

// Fonction qui récupère l'id dans l'URL :
function getProductID() {
  const url = new URLSearchParams(location.search).get("id");
  return url;
}

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

// Fonction qui permet de supprimer un article du panier :
const deleteProductCart = (product) => {
  let id = product.dataset.id;
  let color = product.dataset.color;
  let cart = getCart();
  console.log("id : ", id);
  console.log("color : ", color);
  console.log(cart);
  console.log("product : ", product);

  cart.forEach((element) => {
    console.log(element);
    if (element.id == id && element.color == color) {
      console.log("supprime");
      product.remove();
      cart = cart.filter((p) => p.id != id || p.color != color);
      saveCart(cart);
    }
  });
};

/* // Fonction qui recupère la quantité totale d'article dans le panier :
  const displayTotalQuantity = (cart) => {
    let totalQuantity = 0;
  
    cart.forEach((i) => {
      totalQuantity += Number(i.quantity);
    });
  
    return totalQuantity;
    // document.querySelector("#totalQuantity").textContent = totalQuantity;
  }; */
