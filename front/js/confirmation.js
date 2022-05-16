import "../css/style.css";
import "../css/confirmation.css";

import { getProductID } from "./function";

// Afficher le numéro de commande
document.querySelector("#orderId").textContent = getProductID();
