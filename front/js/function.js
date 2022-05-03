export {
  getProductID,
  saveCart,
  getCart,
  addToCart,
  deleteProductCart,
  getTotalQuantity,
  changeQuantity,
  formVerify,
  hasNumber,
};

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

// Fonction qui recupère la quantité totale de produit dans le panier :
const getTotalQuantity = () => {
  let cart = getCart();
  let totalQuantity = 0;

  cart.forEach((i) => {
    totalQuantity += Number(i.quantity);
  });

  return totalQuantity;
};

// Fonction qui permet de modifier la quantité d'un produit dans le panier :
const changeQuantity = (product, input) => {
  let id = product.dataset.id;
  let color = product.dataset.color;
  let cart = getCart();
  let newQuantity = input.value;
  console.log(newQuantity);
  cart.forEach((element) => {
    if (input.value == 0) {
      deleteProductCart(product);
    } else if (element.id == id && element.color == color) {
      element.quantity = newQuantity;
      console.log(element);
      saveCart(cart);
    }
  });
};

/* // Fonction qui additionne le prix total des produits dans le panier :
const getTotalPrice = async () => {
  let cart = getCart();
  let totalPrice = 0;
  console.log(cart);

  cart.forEach(async (element) => {
    let dataProduct = await requestProductByID(element.id);
    displayProducts(dataProduct, element);
  });

  cart.forEach((i) => {
    totalPrice += Number(i.price * i.quantity);
  });

  console.log(totalPrice);
  return totalPrice;
}; */

/* ---------------------------------- Formulaire ---------------------------------- */

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

// Afficher le message d'erreur
const setError = (element, errorMsg) => {
  element.style.border = "3px solid red";
  const errorElem = element.nextElementSibling;
  // console.log(errorElem);
  //   Ajout du message d'erreur
  errorElem.innerText = errorMsg;
};

// Afficher une validation sur les input correctement renseigné
function setSuccess(element) {
  element.style.border = "3px solid green";
  const errorElem = element.nextElementSibling;
  // console.log(errorElem);
  //   Ajout du message d'erreur
  errorElem.innerText = "";
}

// Vérification du firstname ou lastname
const nameVerif = (nameElem, nameValue) => {
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
};

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
    return cityValue;
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

// Vérification du formulaire
const formVerify = (
  formData,
  formElem,
  firstNameElem,
  lastNameElem,
  addressElem,
  cityElem,
  emailElem
) => {
  // Récupération des valeurs des inputs et suppressions ds espaces avant/après
  const firstNameValue = firstNameElem.value.trim();
  const lastNameValue = lastNameElem.value.trim();
  const addressValue = addressElem.value.trim();
  const cityValue = cityElem.value.trim();
  const emailValue = emailElem.value.trim();

  // Ajout des valeurs du fomulaire dans le FormData en supprimant tout les espaces avant/apres :
  formData.set("firstName", nameVerif(firstNameElem, firstNameValue));
  formData.set("lastName", nameVerif(lastNameElem, lastNameValue));
  formData.set("address", addressVerif(addressElem, addressValue));
  formData.set("city", cityVerif(cityElem, cityValue));
  formData.set("email", emailVerif(emailElem, emailValue));

  // console.log(isCompleteAddress(addressValue));

  // console.log(hasSpecialChars(cityValue));

  console.log(formData.get("firstName"));
  console.log(formData.get("lastName"));
  console.log(formData.get("address"));
  console.log(formData.get("city"));
  console.log(formData.get("email"));

  // for (let pair of formData) {
  //   console.log(pair);
  // }
};
