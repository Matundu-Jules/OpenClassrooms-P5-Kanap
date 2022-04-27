import "../css/style.css";

const items = document.querySelector("#items");

// Requete HTTP vers l'api et itération sur l'array retourner pour récupérer les données de l'api.
const requestProducts = async () => {
  let response = await fetch("http://localhost:3000/api/products");
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

// Fonction qui créer et affiche les éléments récupérer via l'api.
const displayProducts = async () => {
  let data = await requestProducts();
  console.log(data);

  data.forEach((product) => {
    // console.log(product);

    // Création du lien, attributs et affichage :
    const newLink = document.createElement("a");
    newLink.setAttribute("href", `./product.html?id=${product._id}`);
    items.appendChild(newLink);

    //   Création de l'article et affichage :
    const newArticle = document.createElement("article");
    newLink.appendChild(newArticle);

    //   Création de l'image, attributs et affichage :
    const newImg = document.createElement("img");
    newImg.setAttribute("src", product.imageUrl);
    newImg.setAttribute("alt", product.altTxt);
    newArticle.appendChild(newImg);

    //   Création du titre h3, ajout class, texte et affichage :
    const newH3 = document.createElement("h3");
    newH3.className = "productName";
    newH3.innerText = product.name;
    newArticle.appendChild(newH3);

    //   Création du paragraphe, ajout class, texte et affichage :
    const newP = document.createElement("p");
    newP.className = "productDescription";
    newP.innerText = product.description;
    newArticle.appendChild(newP);
  });
};

displayProducts();
