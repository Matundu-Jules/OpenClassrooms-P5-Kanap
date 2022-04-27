import "../css/style.css";

const items = document.querySelector("#items");

// Requete HTTP vers l'api et itération sur l'array retourner pour récupérer les données de l'api.
const request = async () => {
  let response = await fetch("http://localhost:3000/api/products");
  if (response.ok) {
    let data = await response.json();
    console.log(data);

    data.forEach((element) => {
      displayProducts(
        element.altTxt,
        element.colors,
        element.description,
        element.imageUrl,
        element.name,
        element.price,
        element._id
      );
    });
  } else {
    console.error("Statut du serveur : ", response.status);
  }
};

// Fonction qui créer et affiche les éléments récupérer via l'api.
function displayProducts(
  altTxt,
  colors,
  description,
  imageUrl,
  name,
  price,
  idProduct
) {
  // Création du lien, attributs et affichage :
  const newLink = document.createElement("a");
  newLink.setAttribute("href", `./product.html?id=${idProduct}`);
  items.appendChild(newLink);

  //   Création de l'article et affichage :
  const newArticle = document.createElement("article");
  newLink.appendChild(newArticle);

  //   Création de l'image, attributs et affichage :
  const newImg = document.createElement("img");
  newImg.setAttribute("src", imageUrl);
  newImg.setAttribute("alt", altTxt);
  newArticle.appendChild(newImg);

  //   Création du titre h3, ajout class, texte et affichage :
  const newH3 = document.createElement("h3");
  newH3.className = "productName";
  newH3.innerText = name;
  newArticle.appendChild(newH3);

  //   Création du paragraphe, ajout class, texte et affichage :
  const newP = document.createElement("p");
  newP.className = "productDescription";
  newP.innerText = description;
  newArticle.appendChild(newP);
}

request();
