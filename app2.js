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
const cartCollectionRef = collection(db, "cart");

const getAllProducts = async () => {
  let productsSnapShot = await getDocs(productsCollectionRef);
  let productsList = productsSnapShot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  console.log(productsList);
  //   return productsList;
  productsList.map((product) => {
    createProductCard(product);
  });
};

getAllProducts();

function createProductCard(productData) {
  // Create elements
  let productsContainer = document.querySelector(".products_container");

  let product = document.createElement("div");
  product.classList.add("product");

  let productContainer = document.createElement("div");
  productContainer.classList.add("product_container");

  let productLeft = document.createElement("div");
  productLeft.classList.add("product_left");

  let productImage = document.createElement("img");
  productImage.classList.add("product_image");
  productImage.src = productData.img;
  productImage.alt = "product image";

  let productRight = document.createElement("div");
  productRight.classList.add("product_right");

  let productName = document.createElement("div");
  productName.classList.add("product_name");
  productName.textContent = productData.name;

  let productDescription = document.createElement("div");
  productDescription.classList.add("product_description");
  productDescription.textContent = productData.description;

  let productPrice = document.createElement("div");
  productPrice.classList.add("product_price");
  productPrice.textContent = "$" + productData.price;

  let addToCartButton = document.createElement("div");
  addToCartButton.classList.add("product_addtocart_button");

  let addButton = document.createElement("button");
  addButton.textContent = "Add to cart";

  addButton.addEventListener("click", () => {
    console.log("addToCart clicked", productData);
    addToCart(productData);
  });
  // Append elements
  productLeft.appendChild(productImage);
  productRight.appendChild(productName);
  productRight.appendChild(productDescription);
  productRight.appendChild(productPrice);
  addToCartButton.appendChild(addButton);

  productContainer.appendChild(productLeft);
  productContainer.appendChild(productRight);

  product.appendChild(productContainer);
  productRight.appendChild(addToCartButton);

  productsContainer.appendChild(product);
}

const addToCart = async (productData) => {
  let cartContainer = document.querySelector(".cart_container");
  let cartSnapshot = await getDocs(cartCollectionRef);
  let cartList = cartSnapshot.docs.map((doc) => ({
    cartId: doc.id,
    ...doc.data(),
  }));

  console.log("cartList", cartList);
  const existingProduct = cartList.find(
    (product) => product.id === productData.id
  );

  console.log("existing product", existingProduct);

  if (existingProduct && existingProduct.id !== undefined) {
    const updatedCount = existingProduct.count + 1;

    await updateDoc(doc(db, "cart", existingProduct.cartId), {
      count: updatedCount,
    });
    cartContainer.innerHTML = "";
    getAllCartItems().then((data) => {
      data.map((item) => {
        createCartItem(item);
      });
    });
  } else {
    productData.count = 1;
    await addDoc(cartCollectionRef, productData);
    cartContainer.innerHTML = "";

    getAllCartItems().then((data) => {
      data.map((item) => {
        createCartItem(item);
      });
    });
  }

  updateCartCount();
  updateTotalPrice();
};

const getAllCount = async () => {
  let productsSnapShot = await getDocs(cartCollectionRef);
  let cartList = productsSnapShot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  let count = cartList.reduce((initial, value) => {
    return initial + value.count;
  }, 0);
  console.log("count", count);
  return count;
};

const updateCartCount = async () => {
  let badge = document.querySelector(".badge");
  badge.textContent = (await getAllCount()) || 0;
};

updateCartCount();

const openCart = () => {
  let cartIcon = document.querySelector(".nav_cart");
  let products = document.querySelector(".products");
  let cart = document.querySelector(".cart");

  cartIcon.addEventListener("click", () => {
    // Toggle the display property between 'block' and 'none'
    products.style.display =
      products.style.display === "none" ? "block" : "none";
    cart.style.display = cart.style.display === "block" ? "none" : "block";
  });

  // updateTotalPrice()
};

openCart();

const getCart = async () => {
  let cartSnapshot = await getDoc(cartCollectionRef);
  let cartList = cartSnapshot.docs.map((pro) => ({
    ...pro.doc(),
    cartId: pro.id,
  }));

  return cartList;
};

async function createCartItem(productData) {
  let cartContainer = document.querySelector(".cart_container");

  let cartItem = document.createElement("div");
  cartItem.classList.add("cart_item");

  let cartItemContainer = document.createElement("div");
  cartItemContainer.classList.add("cart_item_container");

  let cartItemLeft = document.createElement("div");
  cartItemLeft.classList.add("cart_item_left");

  let productImage = document.createElement("img");
  productImage.src = productData.img;
  productImage.alt = "Product Image";

  let cartItemRight = document.createElement("div");
  cartItemRight.classList.add("cart_item_right");

  let cartProductName = document.createElement("div");
  cartProductName.classList.add("cart_product_name");
  cartProductName.textContent = productData.name;

  let cartProductCount = document.createElement("div");
  cartProductCount.classList.add("cart_product_count");
  cartProductCount.textContent = "Quantity: " + productData.count;

  let cartProductDeleteButton = document.createElement("div");
  cartProductDeleteButton.classList.add("cart_product_delete_button");

  let increaseButton = document.createElement("button");
  increaseButton.textContent = "+";

  let decreaseButton = document.createElement("button");
  decreaseButton.textContent = "-";

  decreaseButton.addEventListener("click", async () => {
    await reduceCount(productData);
  });

  cartProductDeleteButton.appendChild(decreaseButton);

  increaseButton.addEventListener("click", async () => {
    await increaseCount(productData.cartId);
  });

  // Append elements
  cartItemLeft.appendChild(productImage);
  cartItemRight.appendChild(cartProductName);
  cartItemRight.appendChild(cartProductCount);
  cartItemRight.appendChild(cartProductDeleteButton);
  cartProductDeleteButton.appendChild(increaseButton);

  cartItemContainer.appendChild(cartItemLeft);
  cartItemContainer.appendChild(cartItemRight);
  // cartItemContainer.appendChild(cartProductDeleteButton);

  cartItem.appendChild(cartItemContainer);

  // Append the cart item to the cart container
  cartContainer.appendChild(cartItem);
  updateTotalPrice();
}

const reduceCount = async (productData) => {
  if (productData.count > 1) {
    const updatedCount = productData.count - 1;
    await updateDoc(doc(db, "cart", productData.cartId), {
      count: updatedCount,
    });
  } else {
    await removeFromCart(productData.cartId);
  }
  updateCartCount();
  clearCart();
  const cartList = await getAllCartItems();
  cartList.forEach((item) => {
    createCartItem(item);
  });
  updateTotalPrice();
};

const removeFromCart = async (productId) => {
  let productDoc = doc(db, "cart", productId);
  let deleteProduct = await deleteDoc(productDoc);
  updateCartCount();
  clearCart();
  let cartList = await getAllCartItems();
  cartList.map((item) => {
    createCartItem(item);
  });
  updateTotalPrice();
};

const getAllCartItems = async () => {
  let productsSnapShot = await getDocs(cartCollectionRef);
  let productsList = productsSnapShot.docs.map((doc) => ({
    ...doc.data(),
    cartId: doc.id,
  }));
  console.log("cart items ", productsList);
  return productsList;
};

const clearCart = () => {
  let cartContainer = document.querySelector(".cart_container");
  // Clear only cart items, excluding the total price tag
  let cartItems = document.querySelectorAll(".cart_item");
  cartItems.forEach((item) => item.remove());
};

getAllCartItems().then((data) => {
  data.map((item) => {
    createCartItem(item);
  });
});

const getTotalPrice = async () => {
  let cart = await getAllCartItems();
  let total = 0;
  cart.forEach((item) => {
    total += item.count * item.price;
  });
  return total;
};

const updateTotalPrice = async () => {
  let priceTag = document.querySelector(".total_price");
  let total = await getTotalPrice();
  priceTag.textContent = `Total Price: $${total.toFixed(2)}`; // Fixed to 2 decimal places
};

updateTotalPrice();

const increaseCount = async (cartId) => {
  const productDocRef = doc(db, "cart", cartId);
  const productDocSnapshot = await getDoc(productDocRef);

  if (productDocSnapshot.exists()) {
    const currentCount = productDocSnapshot.data().count || 0;
    const updatedCount = currentCount + 1;

    await updateDoc(productDocRef, { count: updatedCount });

    clearCart();
    const cartList = await getAllCartItems();
    cartList.forEach((item) => {
      createCartItem(item);
    });

    updateTotalPrice();

    updateCartCount();
  } else {
    console.log("Product does not exist in the cart.");
  }
};
