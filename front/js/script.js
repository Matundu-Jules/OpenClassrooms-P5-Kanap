import "../css/style.css";

// Requete HTTP vers l'api - Récupération de tout les produits :
const requestProducts = async () => {
  let response = await fetch("http://localhost:3000/api/products");
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Statut du serveur :", response.status);
  }
};

// Afficher les produits sur la page d'accueil :
const displayProducts = async () => {
  let arrayProducts = await requestProducts();

  arrayProducts.forEach((product) => {
    // Création du lien, ajout attributs et affichage :
    const items = document.querySelector("#items");
    const link = document.createElement("a");
    link.setAttribute("href", `./product.html?id=${product._id}`);
    items.appendChild(link);

    // Création de l'article et affichage :
    const article = document.createElement("article");
    link.appendChild(article);

    // Création de l'image, ajout attributs et affichage :
    const image = document.createElement("img");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.altTxt);
    article.appendChild(image);

    // Création du titre h3, ajout class/texte et affichage :
    const title = document.createElement("h3");
    title.className = "productName";
    title.innerText = product.name;
    article.appendChild(title);

    //   Création du paragraphe, ajout class/texte et affichage :
    const paragraphe = document.createElement("p");
    paragraphe.className = "productDescription";
    paragraphe.innerText = product.description;
    article.appendChild(paragraphe);
  });
};

displayProducts();
