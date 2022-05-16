export { getProductID, saveCart, getCart };

// Récupèrer l'id contenu dans l'URL :
function getProductID() {
  return new URLSearchParams(location.search).get("id");
}

// Sauvegarder le panier dans le localStorage
function saveCart(cart) {
  localStorage.setItem("panier", JSON.stringify(cart));
}

// Récupérer le panier du localStorage
function getCart() {
  let cart = localStorage.getItem("panier");
  if (cart === null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}
