import "../css/style.css";
import "../css/confirmation.css";

import { getProductID } from "./function";

// const test = getProductID();
// console.log(test);
document.querySelector("#orderId").textContent = getProductID();
