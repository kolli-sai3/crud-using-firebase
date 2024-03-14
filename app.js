// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG9ZKs-CQrH4IrhsFNHLHrVJqPnTYsrxc",
  authDomain: "shopping-task-6786d.firebaseapp.com",
  projectId: "shopping-task-6786d",
  storageBucket: "shopping-task-6786d.appspot.com",
  messagingSenderId: "357224571878",
  appId: "1:357224571878:web:ea202fa9758296d60aec27",
  measurementId: "G-C3G0E1FMN7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const productsCollectionRef = collection(db, "products");

// Function to get a single product by ID
const getProductById = async (productId) => {
  try {
    const productDocRef = doc(db, "products", productId);
    const productDocSnapshot = await getDoc(productDocRef);

    if (productDocSnapshot.exists()) {
      // Document exists, you can access the data using .data()
      const productData = productDocSnapshot.data();
      console.log("Product data:", productData);
      return productData;
    } else {
      console.log("Product not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

const getAllProducts = async () => {
  let productsSnapShot = await getDocs(productsCollectionRef);
  let productsList = productsSnapShot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return productsList;
};
getAllProducts().then((data) => console.log(data));

const createProduct = async (productData) => {
  let addProduct = await addDoc(productsCollectionRef, productData);
  let productsList = await getAllProducts();
  displayProducts(productsList);
};

// createProduct().then(data=>{
//     console.log('product created',data)
// })

const updateProduct = async (id, data) => {
  try {
    console.log("product id", id);
    let productDoc = doc(db, "products", id);
    let updateProduct = await updateDoc(productDoc, data);
    console.log("update doc", updateProduct);
    let allProducts = await getAllProducts();
  displayProducts(allProducts);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  console.log("product id", id);
  let productDoc = doc(db, "products", id);
  let deleteProduct = await deleteDoc(productDoc);
  let allProducts = await getAllProducts();
  displayProducts(allProducts);
};

// deleteProduct()

const openAddProductModalBtn = document.getElementById(
  "openAddProductModalBtn"
);
const addProductModal = document.getElementById("addProductModal");
const closeAddProductModalBtn = document.getElementById(
  "closeAddProductModalBtn"
);
const submitAddProductBtn = document.getElementById("submitAddProductBtn");
const cancelAddProductBtn = document.getElementById("cancelAddProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productsTableBody = document.getElementById("productsTableBody");

const openAddProductModal = () => {
  addProductModal.style.display = "block";
};

const closeAddProductModal = () => {
  addProductModal.style.display = "none";
};

openAddProductModalBtn.addEventListener("click", openAddProductModal);

closeAddProductModalBtn.addEventListener("click", closeAddProductModal);

cancelAddProductBtn.addEventListener("click", closeAddProductModal);

submitAddProductBtn.addEventListener("click", () => {
  const addProductName = document.getElementById("addProductName").value;
  const addProductDescription = document.getElementById(
    "addProductDescription"
  ).value;
  const addProductPrice = document.getElementById("addProductPrice").value;
  const addProductImage = document.getElementById("addProductImage").value;

  if (addProductName === "") {
    return alert("Name is required");
  }
  if (addProductDescription === "") {
    return alert("description is required");
  }
  if (addProductPrice === "") {
    return alert("price is required");
  }
  if (addProductImage === "") {
    return alert("Image is required");
  }

  createProduct({
    name: addProductName,
    description: addProductDescription,
    price: Number(addProductPrice),
    img: addProductImage,
  }).then((data) => console.log("product created ", data));

  closeAddProductModal();
});

window.addEventListener("click", (event) => {
  if (event.target === addProductModal) {
    closeAddProductModal();
  }
});

const displayProducts = (productsList) => {
  const tableBody = document.getElementById("productsTableBody");

  tableBody.innerHTML = "";

  productsList.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td><img src="${product.img}" alt="Product Image" style="max-width: 50px;"></td>
        <td>
          <button class="updateBtn" data-id="${product.id}">Update</button>
          <button class="deleteBtn" data-id="${product.id}">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);

    const updateBtn = row.querySelector(".updateBtn");
    const deleteBtn = row.querySelector(".deleteBtn");

    updateBtn.addEventListener("click", () => {
      const productId = updateBtn.getAttribute("data-id");
      openUpdateProductModal(productId);
    });

    deleteBtn.addEventListener("click", () => {
      const productId = deleteBtn.getAttribute("data-id");
      deleteProduct(productId);
    });
  });
};

getAllProducts().then((productsList) => {
  displayProducts(productsList);
});

const openUpdateProductModalBtns = document.querySelectorAll(".updateBtn");
const updateProductModal = document.getElementById("updateProductModal");
const closeUpdateProductModalBtn = document.getElementById(
  "closeUpdateProductModalBtn"
);
const submitUpdateProductBtn = document.getElementById(
  "submitUpdateProductBtn"
);
const cancelUpdateProductBtn = document.getElementById(
  "cancelUpdateProductBtn"
);
const updateProductForm = document.getElementById("updateProductForm");

let selectedProductId;

const openUpdateProductModal = async (id) => {
  updateProductModal.style.display = "block";
  history.pushState({ productId: id }, null, `?productId=${id}`);
  console.log("update", id);
  let product = await getProductById(id);

  document.getElementById("updateProductName").value = product.name;
  document.getElementById("updateProductDescription").value =
    product.description;

  document.getElementById("updateProductPrice").value = product.price;

  document.getElementById("updateProductImage").value = product.img;
};

closeUpdateProductModalBtn.addEventListener("click", () => {
  updateProductModal.style.display = "none";
  removeProductIdFromUrl();
});

cancelUpdateProductBtn.addEventListener("click", () => {
  updateProductModal.style.display = "none";
  removeProductIdFromUrl();
});

const removeProductIdFromUrl = () => {
  history.pushState({}, null, window.location.pathname);
};

submitUpdateProductBtn.addEventListener("click", async () => {
  const currentUrl = window.location.search;

  const urlParams = new URLSearchParams(currentUrl);

  const productId = urlParams.get("productId") || "0";
  console.log({
    currentUrl,
    urlParams,
    productId,
  });
  const updateProductName = document.getElementById("updateProductName").value;
  const updateProductDescription = document.getElementById(
    "updateProductDescription"
  ).value;
  const updateProductPrice =
    document.getElementById("updateProductPrice").value;
  const updateProductImage =
    document.getElementById("updateProductImage").value;

  if (updateProductName === "") {
    return alert("Name is required");
  }
  if (updateProductDescription === "") {
    return alert("Description is required");
  }
  if (updateProductPrice === "") {
    return alert("Price is required");
  }
  if (updateProductImage === "") {
    return alert("Image is required");
  }

  console.log("local updated values", {
    updateProductName,
    updateProductImage,
    updateProductPrice,
    updateProductDescription,
  });

  await updateProduct(productId, {
    name: updateProductName,
    description: updateProductDescription,
    price: Number(updateProductPrice),
    img: updateProductImage,
  });

  updateProductModal.style.display = "none";
});
