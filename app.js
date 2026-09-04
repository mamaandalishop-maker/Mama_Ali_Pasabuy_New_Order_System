// ============================================
// MAMA & ALI PASABUY
// PRODUCT DATABASE
// ============================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyOlZ0kG_wpwvTdh18p7jMmUpXyfqvXeugEQfIdEca_RjtixaFXT44MGxH42AR8AWba-Q/exec";

function saveCart() {
  localStorage.setItem("mamaAliCart", JSON.stringify(cart));
}

const PRODUCTS = [
  {
    id: "P001",
    name: "Nissin Seafood Rame Cup Noodles",
    category: "Food",
    price: 0,
    folder: "ramen",
    image: "01.png",
    description: "Authentic Japanese ramen selected for our pasabuy."
  },

  {
    id: "P002",
    name: "Lipton Berry mix Tea",
    category: "Drinks",
    price: 0,
    folder: "berry tea",
    image: "01.png",
    description: "A delicious Japanese berry tea selected for our pasabuy."
  },

  {
    id: "P003",
    name: "Cow Soap Blue",
    category: "Beauty",
    price: 70,
    folder: "cow soap blue",
    image: "01.png",
    description: "Popular Japanese body soap."
  },

  {
    id: "P004",
    name: "Cow Soap Red",
    category: "Beauty",
    price: 80,
    folder: "cow soap red",
    image: "01.png",
    description: "Popular Japanese body soap."
  },

  {
    id: "P005",
    name: "Nescafé Fluffy Assorted 10's",
    category: "Drinks",
    price: 250,
    folder: "nescafe fluffy",
    image: "01.png",
    description: "Japanese coffee favorite."
  },

  {
    id: "P006",
    name: "Vita Pure Collagen",
    category: "Beauty",
    price: 750,
    folder: "Vita Pure Collage",
    image: "01.png",
    description: "Japanese beauty and wellness favorite."
  },

  {
    id: "P007",
    name: "AGF Blendy Café Latory Rich Tiramisu Chocolate Latte",
    category: "Drinks",
    price: 250,
    folder: "Cafe latory",
    image: "01.png",
    description: "Japanese cafe-style drink."
  },

  {
    id: "P008",
    name: "Nescafe KitKat",
    category: "Drinks",
    price: 220,
    folder: "nescafe kitkat",
    image: "01.png",
    description: "Limited Japanese coffee favorite."
  },

  {
    id: "P009",
    name: "Lipton Sakura Tea",
    category: "Drinks",
    price: 280,
    folder: "Sakura Tea",
    image: "01.png",
    description: "Japanese sakura-inspired tea."
  },

  {
    id: "P010",
    name: "Starbucks Strawberry Latte",
    category: "Drinks",
    price: 350,
    folder: "Starbucks Strawberry Latte",
    image: "01.png",
    description: "Japanese Starbucks strawberry latte."
  },

  {
    id: "P011",
    name: "Nescafe Raspberry",
    category: "Drinks",
    price: 220,
    folder: "Nescafe Raspberry",
    image: "01.png",
    description: "Japanese raspberry coffee favorite."
  },

  {
    id: "P012",
    name: "Marutai Ramen",
    category: "Food",
    price: 165,
    folder: "Marutai",
    image: "01.png",
    description: "Popular Japanese noodle product.",
    flavors: [
      "Nagasaki Agodashi Soy Sauce Ramen",
      "Saga Beef Salt Ramen",
      "Kurume Rich Tonkotsu Pork Bone Ramen",
      "Nagahama Hakata Tonkotsu Ramen",
      "Kagoshima Kurobuta Tonkotsu Ramen",
      "Kumamoto Garlic Pork Ramen",
      "Oita Chicken Paitan Ramen",
      "Miyazaki Spicy Noodles"
    ]
  },

  {
    id: "P013",
    name: "Meito Sangyo Chocolate",
    category: "Snacks",
    price: 120,
    folder: "Meito Sangyo Chocolate",
    image: "01.png",
    description: "Japanese chocolate favorite."
  },

  {
    id: "P014",
    name: "KitKat Dark Matcha",
    category: "Snacks",
    price: 0,
    folder: "kitakat matcha",
    image: "01.png",
    description: "Japanese matcha KitKat."
  },

  {
    id: "P015",
    name: "Nescafé Potion Uji Matcha Latte",
    category: "Drinks",
    price: 200,
    folder: "UJI MATCHA",
    image: "01.png",
    description: "Japanese Uji matcha."
  },
  
  {
      id: "P016",
      name: "Tsujiri Double Rich Matcha (Koicha)",
      category: "Drinks",
      price: 350,
      folder: "Tsujiri Double Rich Matcha (Koicha)",
      image: "01.png",
      description: "Rich Japanese matcha milk with a deep, smooth Koicha-style taste."
  },
];


// ============================================
// VARIABLES
// ============================================

let activeCategory = "All";
let modalQuantity = 1;

let cart = JSON.parse(
  localStorage.getItem("mamaAliCart") || "[]"
);

function clearCart() {
  cart = [];
  localStorage.removeItem("mamaAliCart");
  updateCartCount();
}

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const cartCount = document.getElementById("cartCount");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");


// ============================================
// HELPER
// ============================================

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char])
  );
}


function money(value) {
  if (!value || Number(value) === 0) {
    return "Price coming soon";
  }

  return "₱" + Number(value).toLocaleString("en-PH", {
    maximumFractionDigits: 0
  });
}


// ============================================
// PRODUCT IMAGE
// ============================================

function firstImage(product) {

  // If product has images array
  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images[0];
  }

  // Current product setup
  if (product.folder && product.image) {
    return (
      "assets/products/" +
      product.folder +
      "/" +
      product.image
    );
  }

  return "assets/placeholder.svg";
}


// ============================================
// FILTERS
// ============================================

function renderFilters() {

  if (!filters) return;

  const categories = [
    "All",
    ...new Set(
      PRODUCTS
        .map(product => product.category)
        .filter(Boolean)
    )
  ];

  filters.innerHTML = categories
    .map(category => `
      <button
        class="filter ${category === activeCategory ? "active" : ""}"
        type="button"
        onclick="setCategory('${esc(category)}')"
      >
        ${esc(category)}
      </button>
    `)
    .join("");
}


// ============================================
// CATEGORY
// ============================================

function setCategory(category) {

  activeCategory = category;

  renderFilters();
  renderProducts();
}


// ============================================
// RENDER PRODUCTS
// ============================================

function renderProducts() {

  if (!grid) {
    console.error("productGrid not found.");
    return;
  }

  const q = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const items = PRODUCTS.filter(product => {

    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchableText = [
      product.name,
      product.category,
      product.description || ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchableText.includes(q);

    return matchesCategory && matchesSearch;
  });


  if (!items.length) {

    grid.innerHTML = `
      <div class="empty">
        <h3>No products found</h3>
        <p>Try another search.</p>
      </div>
    `;

    return;
  }


  grid.innerHTML = items
    .map(product => `

      <article class="product">

        <div class="product-image">

          <img
            src="${esc(firstImage(product))}"
            alt="${esc(product.name)}"
            onerror="this.src='assets/placeholder.svg'"
          >

        </div>


        <div class="product-info">

          <span class="category">
            ${esc(product.category)}
          </span>


          <h3>
            ${esc(product.name)}
          </h3>


          <p class="description">
            ${esc(product.description || "")}
          </p>


          <div class="price">
            ${
              product.price > 0
                ? money(product.price)
                : "Price coming soon"
            }
          </div>


          <button
            class="add"
            type="button"
            onclick="viewProduct('${esc(product.id)}')"
          >
            VIEW PRODUCT
          </button>

        </div>

      </article>

    `)
    .join("");
}


// ============================================
// OLD FUNCTION COMPATIBILITY
// ============================================

function openProduct(productId) {
  viewProduct(productId);
}


// ============================================
// VIEW PRODUCT
// ============================================

function viewProduct(productId) {

  const product = PRODUCTS.find(
    item =>
      String(item.id) === String(productId)
  );

  if (!product) return;

  if (!modal || !modalContent) {
    console.error("Modal elements not found.");
    return;
  }


  // ALWAYS RESET MODAL QUANTITY
  modalQuantity = 1;


  // Main image
  const mainImage = firstImage(product);


  // ========================================
  // GALLERY
  // ========================================

  let galleryImages = [];


  if (
    Array.isArray(product.images) &&
    product.images.length
  ) {

    galleryImages = product.images;

  } else {

    galleryImages = [
      product.image || "01.png",
      "02.png",
      "03.png",
      "04.png",
      "05.png"
    ].map(filename =>
      "assets/products/" +
      product.folder +
      "/" +
      filename
    );
  }


  const gallery = galleryImages
    .map((src, index) => `

      <img
        src="${esc(src)}"
        alt="${esc(product.name)}"
        style="
          width:70px;
          height:70px;
          object-fit:cover;
          border-radius:10px;
          cursor:pointer;
          border:1px solid #ddd;
        "
        onclick="selectProductImage(this)"
        onerror="this.style.display='none'"
      >

    `)
    .join("");


  // ========================================
  // MODAL HTML
  // ========================================

  modalContent.innerHTML = `

    <button
      class="modal-close"
      type="button"
      onclick="closeModal()"
      aria-label="Close"
    >
      ×
    </button>


    <div style="text-align:center;">

      <img
        id="mainProductImage"
        src="${esc(mainImage)}"
        alt="${esc(product.name)}"
        style="
          width:100%;
          max-height:350px;
          object-fit:contain;
          border-radius:15px;
          margin-bottom:15px;
          display:block;
        "
        onerror="this.src='assets/placeholder.svg'"
      >


      <div
        style="
          display:flex;
          gap:10px;
          justify-content:center;
          flex-wrap:wrap;
          margin-bottom:20px;
        "
      >

        ${gallery}

      </div>

    </div>


    <div
      style="
        font-size:12px;
        font-weight:bold;
        color:#c8922e;
        text-transform:uppercase;
        margin-bottom:8px;
      "
    >
      ${esc(product.category)}
    </div>


    <h2
      style="
        margin:0 0 10px;
        color:#087574;
      "
    >
      ${esc(product.name)}
    </h2>


    <p
      style="
        color:#455;
        line-height:1.5;
      "
    >
      ${esc(product.description || "")}
    </p>


    <h3 style="margin-top:20px;">
      ${
        product.price > 0
          ? money(product.price)
          : "Price coming soon"
      }
    </h3>

    <!-- MARUTAI FLAVOR -->
    ${
      String(product.id) === "P012"
        ? `
          <div style="margin:15px 0;">
            <label
              for="marutaiFlavor"
              style="
                display:block;
                font-weight:bold;
                color:#087574;
                margin-bottom:8px;
              "
            >
              Choose Flavor
            </label>

            <select
              id="marutaiFlavor"
              style="
                width:100%;
                padding:12px;
                border:1px solid #ddd8ca;
                border-radius:10px;
                background:white;
                color:#34484a;
                font-size:15px;
                outline:none;
              "
            >
              <option value="Nagasaki Agodashi Soy Sauce">
                Nagasaki Agodashi Soy Sauce
              </option>

              <option value="Saga Beef Salt">
                Saga Beef Salt
              </option>

              <option value="Kurume Rich Tonkotsu">
                Kurume Rich Tonkotsu
              </option>

              <option value="Nagahama Hakata Tonkotsu">
                Nagahama Hakata Tonkotsu
              </option>

              <option value="Kagoshima Kurobuta Tonkotsu">
                Kagoshima Kurobuta Tonkotsu
              </option>

              <option value="Kumamoto Garlic Pork">
                Kumamoto Garlic Pork
              </option>

              <option value="Oita Chicken Paitan">
                Oita Chicken Paitan
              </option>

              <option value="Miyazaki Spicy Noodles">
                Miyazaki Spicy Noodles
              </option>
            </select>
          </div>
        `
        : ""
    }

    <!-- QUANTITY -->

    <div
      class="modal-qty"
      style="margin:15px 0;"
    >

      <span>Quantity</span>


      <div class="qty-control">

        <button
          type="button"
          onclick="changeModalQuantity(-1)"
        >
          −
        </button>


        <span id="modalQty">1</span>


        <button
          type="button"
          onclick="changeModalQuantity(1)"
        >
          +
        </button>

      </div>

    </div>

  

    <!-- ADD TO CART -->

    <button
      class="add"
      type="button"
   onclick="
     if ('${esc(product.id)}' === 'P012' && !document.getElementById('marutaiFlavor')?.value) {
       alert('Please select a flavor.');
       return;
     }

     addToCart(
       '${esc(product.id)}',
       modalQuantity,
       document.getElementById('marutaiFlavor')?.value || ''
     )
   "
      style="
        width:100%;
        padding:14px;
        border:none;
        border-radius:10px;
        background:#087574;
        color:white;
        font-size:16px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      ADD TO CART
    </button>

  `;


  modal.classList.add("open");
}


// ============================================
// PRODUCT IMAGE SWITCH
// ============================================

function selectProductImage(imageElement) {

  const mainImage =
    document.getElementById("mainProductImage");

  if (mainImage && imageElement) {

    mainImage.src = imageElement.src;

  }
}


// ============================================
// MODAL QUANTITY
// ============================================

function changeModalQuantity(amount) {

  modalQuantity += Number(amount) || 0;


  if (modalQuantity < 1) {
    modalQuantity = 1;
  }


  const qtyDisplay =
    document.getElementById("modalQty");


  if (qtyDisplay) {
    qtyDisplay.textContent = modalQuantity;
  }
}


// ============================================
// ADD TO CART
// ============================================

function addToCart(productId, quantity = 1, flavor = "") {

  // Find product
  const product = PRODUCTS.find(
    item => String(item.id) === String(productId)
  );

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  // Make sure quantity is a valid number
  const qty = Math.max(1, Number(quantity) || 1);

  // Check if product is already in cart
    const existing = cart.find(
      item =>
        String(item.id) === String(productId) &&
        String(item.flavor || "") === String(flavor || "")
    );

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + qty;
  } else {
      cart.push({
        id: product.id,
        quantity: qty,
        flavor: flavor
      });
  }

  // Save cart
  localStorage.setItem(
    "mamaAliCart",
    JSON.stringify(cart)
  );

  // Update cart number
  updateCartCount();

  // Reset product quantity
  modalQuantity = 1;

  const qtyDisplay = document.getElementById("modalQty");

  if (qtyDisplay) {
    qtyDisplay.textContent = "1";
  }

  // Close product modal
  closeModal();

  // NO ALERT HERE
  // This keeps the page fully clickable.
}


// ============================================
// CART COUNT
// ============================================

function updateCartCount() {

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}


// ============================================
// CART COUNT
// ============================================

function updateCartCount() {

  const totalItems =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );


  if (cartCount) {

    cartCount.textContent =
      totalItems;

  }
}


// ============================================
// CART QUANTITY
// ============================================

function changeQuantity(productId, change, flavor = "") {

  const item = cart.find(
    cartItem =>
      String(cartItem.id) === String(productId) &&
      String(cartItem.flavor || "") === String(flavor || "")
  );

  if (!item) return;

  item.quantity =
    Number(item.quantity || 0) +
    Number(change || 0);

  if (item.quantity <= 0) {
    cart = cart.filter(
      cartItem =>
        !(
          String(cartItem.id) === String(productId) &&
          String(cartItem.flavor || "") === String(flavor || "")
        )
    );
  }

  localStorage.setItem(
    "mamaAliCart",
    JSON.stringify(cart)
  );

  updateCartCount();
  openCart();
}

// ============================================
// REMOVE CART ITEM
// ============================================

function removeFromCart(productId, flavor = "") {

  cart = cart.filter(
    item =>
      !(
        String(item.id) === String(productId) &&
        String(item.flavor || "") === String(flavor || "")
      )
  );

  localStorage.setItem(
    "mamaAliCart",
    JSON.stringify(cart)
  );

  updateCartCount();
  openCart();
}


// ============================================
// OPEN CART
// ============================================

function openCart() {

  if (!modal || !modalContent) return;

  // EMPTY CART
  if (!cart.length) {

    modalContent.innerHTML = `
      <button
        class="modal-close"
        type="button"
        onclick="closeModal()"
      >
        ×
      </button>

      <h2>Your Cart</h2>

      <p>
        Your cart is empty.
      </p>
    `;

    modal.classList.add("open");

    return;
  }

  // =========================================
  // CART ITEMS
  // =========================================

  let subtotal = 0;

  const rows = cart
    .map(item => {

      const product = PRODUCTS.find(
        p =>
          String(p.id) ===
          String(item.id)
      );

      if (!product) return "";

      const quantity =
        Number(item.quantity || item.qty || 0);

      const price =
        Number(product.price || 0);

      const itemTotal =
        price * quantity;

      subtotal += itemTotal;

      return `
        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:15px;
            padding:15px 0;
            border-bottom:1px solid #eee;
          "
        >

          <div style="flex:1;">

            <strong>
              ${esc(product.name)}
            </strong>

            ${
              item.flavor
                ? `
                  <div
                    style="
                      margin-top:5px;
                      font-size:14px;
                      color:#087574;
                      font-weight:600;
                    "
                  >
                    Flavor: ${esc(item.flavor)}
                  </div>
                `
                : ""
            }

            <div
              style="
                display:flex;
                align-items:center;
                gap:8px;
                margin-top:10px;
              "
            >

              <button
                type="button"
                onclick="
                  changeQuantity(
                    '${esc(product.id)}',
                    -1,
                    '${esc(item.flavor || "")}'
                  )
                "
              >
                −
              </button>

              <span>
                Qty:
                ${quantity}
              </span>

              <button
                type="button"
                onclick="
                  changeQuantity(
                    '${esc(product.id)}',
                    1,
                    '${esc(item.flavor || "")}'
                  )
                "
              >
                +
              </button>

            </div>

          </div>

          <div
            style="
              text-align:right;
              min-width:90px;
            "
          >

            <div
              style="
                font-size:14px;
                color:#666;
              "
            >
              ₱${price.toLocaleString()}
            </div>

            <strong
              style="
                display:block;
                margin-top:5px;
                font-size:16px;
              "
            >
              ₱${itemTotal.toLocaleString()}
            </strong>

            <button
              type="button"
              onclick="
                removeFromCart(
                  '${esc(product.id)}',
                  '${esc(item.flavor || "")}'
                )
              "
              style="
                border:0;
                background:none;
                color:#b44;
                cursor:pointer;
                margin-top:8px;
              "
            >
              Remove
            </button>

          </div>

        </div>
      `;
    })
    .join("");

  // =========================================
  // CART MODAL
  // =========================================

  modalContent.innerHTML = `

    <button
      class="modal-close"
      type="button"
      onclick="closeModal()"
    >
      ×
    </button>

    <h2>Your Cart</h2>

    <div>
      ${rows}
    </div>

    <div
      style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:18px 0;
        margin-top:5px;
        border-top:2px solid #ddd;
        font-size:18px;
      "
    >

      <strong>
        Subtotal
      </strong>

      <strong>
        ₱${subtotal.toLocaleString()}
      </strong>

    </div>

    <button
      class="add"
      type="button"
      onclick="checkout()"
      style="
        width:100%;
        padding:14px;
        border:none;
        border-radius:10px;
        background:#087574;
        color:white;
        font-weight:bold;
        cursor:pointer;
      "
    >
      PROCEED TO ORDER
    </button>

  `;

  modal.classList.add("open");
}


// ============================================
// TRACK ORDER
// ============================================

function showTrack() {

  if (!modal || !modalContent) return;


  modalContent.innerHTML = `

    <button
      class="modal-close"
      type="button"
      onclick="closeModal()"
    >
      ×
    </button>


    <h2>Track Your Order</h2>


    <p>
      Enter your order number to check
      your pasabuy order.
    </p>


    <input
      type="text"
      id="trackingNumber"
      placeholder="Order number"
      style="
        width:100%;
        padding:12px;
        border:1px solid #ddd;
        border-radius:10px;
        margin-bottom:12px;
        box-sizing:border-box;
      "
    >


    <button
      class="add"
      type="button"
      onclick="trackOrder()"
      style="
        width:100%;
        padding:14px;
        border:none;
        border-radius:10px;
        background:#087574;
        color:white;
        font-weight:bold;
      "
    >
      TRACK ORDER
    </button>


    <div id="trackingResult"></div>

  `;


  modal.classList.add("open");
}


// ============================================
// TRACK
// ============================================

function trackOrder() {

  const input =
    document.getElementById(
      "trackingNumber"
    );

  const result =
    document.getElementById(
      "trackingResult"
    );


  if (!input || !result) return;


  const number =
    input.value.trim();


  if (!number) {

    result.innerHTML = `
      <p>
        Please enter your order number.
      </p>
    `;

    return;
  }


  result.innerHTML = `

    <div style="margin-top:20px;">

      <strong>
        Order received
      </strong>


      <p>
        Your order number is:
        <strong>
          ${esc(number)}
        </strong>
      </p>


      <p>
        Tracking information will be
        available once your pasabuy order
        has been processed.
      </p>

    </div>

  `;
}


// ============================================
// CLOSE MODAL
// ============================================

function closeModal() {

  if (modal) {

    modal.classList.remove("open");

  }
}


// ============================================
// CHECKOUT
// ============================================

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

    document.getElementById("modal").classList.remove("show");

  const total = cart.reduce(
    (sum, item) =>
    sum + PRODUCTS.find(p => p.id === item.id).price * item.quantity,
    0
  );

    document.getElementById("modalContent").innerHTML = `
      <div style="
        max-width:760px;
        margin:0 auto;
        color:#344b4d;
      ">

        <!-- CHECKOUT HEADER -->
        <div style="
          border-bottom:1px solid #e6dfcf;
          padding-bottom:14px;
          margin-bottom:20px;
        ">
          <div style="
            font-family:Georgia,serif;
            font-size:30px;
            font-weight:700;
            color:#006f70;
            margin-bottom:6px;
          ">
            Checkout
          </div>

          <div style="
            color:#6e7c7c;
            font-size:14px;
          ">
            September Pasabuy • ETA Sept 13
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div style="
          background:#fbf8f0;
          border:1px solid #e6dfcf;
          border-radius:14px;
          padding:18px;
          margin-bottom:22px;
        ">

          <div style="
            font-size:13px;
            font-weight:700;
            letter-spacing:1.5px;
            color:#c99124;
            text-transform:uppercase;
            margin-bottom:12px;
          ">
            Your Order
          </div>

          <div id="checkoutItems">
            ${
              cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id);
                if (!product) return "";

                return `
                  <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    padding:11px 0;
                    border-bottom:1px solid #e6dfcf;
                  ">
                    <div style="flex:1;">
                      <div style="
                        font-weight:600;
                        color:#006f70;
                        font-size:15px;
                      ">
                        ${product.name}
                      </div>

                      <div style="
                        color:#6e7c7c;
                        font-size:13px;
                        margin-top:3px;
                      ">
                        Qty: ${item.quantity} × ${money(product.price)}
                      </div>
                    </div>

                    <div style="
                      font-weight:700;
                      color:#344b4d;
                      white-space:nowrap;
                    ">
                      ${money(product.price * item.quantity)}
                    </div>
                  </div>
                `;
              }).join("")
            }
          </div>
        </div>

        <!-- CUSTOMER INFORMATION -->
        <div style="
          font-size:13px;
          font-weight:700;
          letter-spacing:1.5px;
          color:#c99124;
          text-transform:uppercase;
          margin-bottom:12px;
        ">
          Customer Information
        </div>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:16px;
          margin-bottom:16px;
        ">

          <label style="display:block;">
            <span style="
              display:block;
              font-weight:600;
              margin-bottom:6px;
            ">
              Full Name
            </span>

            <input
              id="custName"
              placeholder="Your name"
              required
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px 13px;
                border:1px solid #ddd5c5;
                border-radius:9px;
                background:#fff;
                font-size:14px;
              "
            >
          </label>

          <label style="display:block;">
            <span style="
              display:block;
              font-weight:600;
              margin-bottom:6px;
            ">
              Mobile Number
            </span>

            <input
              id="custPhone"
              placeholder="09xx xxx xxxx"
              required
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px 13px;
                border:1px solid #ddd5c5;
                border-radius:9px;
                background:#fff;
                font-size:14px;
              "
            >
          </label>

        </div>

        <!-- EMAIL -->
        <label style="
          display:block;
          margin-bottom:16px;
        ">
          <span style="
            display:block;
            font-weight:600;
            margin-bottom:6px;
          ">
            Email Address
          </span>

          <input
            id="custEmail"
            type="email"
            placeholder="you@example.com"
            required
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px 13px;
              border:1px solid #ddd5c5;
              border-radius:9px;
              background:#fff;
              font-size:14px;
            "
          >
        </label>

        <!-- DELIVERY ADDRESS -->
        <label style="
          display:block;
          margin-bottom:18px;
        ">
          <span style="
            display:block;
            font-weight:600;
            margin-bottom:6px;
          ">
            Delivery Address
          </span>

          <textarea
            id="custAddress"
            rows="4"
            placeholder="Complete delivery address"
            required
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px 13px;
              border:1px solid #ddd5c5;
              border-radius:9px;
              background:#fff;
              font-size:14px;
              resize:vertical;
              font-family:inherit;
            "
          ></textarea>
        </label>

        <!-- PAYMENT -->
        <div style="
          font-size:13px;
          font-weight:700;
          letter-spacing:1.5px;
          color:#c99124;
          text-transform:uppercase;
          margin-bottom:12px;
        ">
          Payment
        </div>

        <!-- PAYMENT OPTION -->
        <label style="
          display:block;
          margin-bottom:16px;
        ">
          <span style="
            display:block;
            font-weight:600;
            margin-bottom:6px;
          ">
            Payment Option
          </span>

          <select
            id="payOption"
            onchange="updatePaymentSummary()"
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px 13px;
              border:1px solid #ddd5c5;
              border-radius:9px;
              background:#fff;
              font-size:14px;
              color:#344b4d;
            "
          >
            <option value="full">Pay Full</option>
            <option value="dp">50% Down Payment</option>
          </select>
        </label>

        <!-- PAYMENT METHOD -->
        <label style="
          display:block;
          margin-bottom:16px;
        ">
          <span style="
            display:block;
            font-weight:600;
            margin-bottom:6px;
          ">
            Payment Method
          </span>

          <select
              id="payment"
              onchange="updatePaymentDetails()"
              style="
              width:100%;
              box-sizing:border-box;
              padding:12px 13px;
              border:1px solid #ddd5c5;
              border-radius:9px;
              background:#fff;
              font-size:14px;
              color:#344b4d;
            "
          >
            <option value="GCash">GCash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </label>
    
    <!-- PAYMENT DETAILS -->
    <div id="paymentDetails" style="
        display:none;
        margin-top:-4px;
        margin-bottom:18px;
        padding:16px;
        background:#f8f6ef;
        border:1px solid #e6dfcf;
        border-radius:10px;
    "></div>

        <!-- PAYMENT SCREENSHOT -->
        <label style="
          display:block;
          margin-bottom:18px;
        ">
          <span style="
            display:block;
            font-weight:600;
            margin-bottom:6px;
          ">
            Payment Screenshot
          </span>

          <input
            id="paymentScreenshot"
            type="file"
            accept="image/*"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px;
              border:1px solid #ddd5c5;
              border-radius:9px;
              background:#fff;
              font-size:14px;
            "
          >

          <small style="
            display:block;
            color:#6e7c7c;
            margin-top:7px;
            font-size:12px;
          ">
            Please upload your payment receipt or screenshot.
          </small>
        </label>

        <!-- PAYMENT SUMMARY -->
        <div
          id="paymentSummary"
          style="
            background:#fbf8f0;
            border:1px solid #e6dfcf;
            padding:17px;
            border-radius:12px;
            margin:6px 0 20px;
            line-height:1.7;
          "
        ></div>

        <!-- PLACE ORDER -->
        <button
          id="placeOrderBtn"
          class="btn primary full"
          onclick="placeOrder()"
          style="
            width:100%;
            border:none;
            border-radius:10px;
            padding:14px 20px;
            font-size:16px;
            font-weight:700;
            cursor:pointer;
          "
        >
          Place Order
        </button>

      </div>
    `;

  document.getElementById("modal").classList.add("show");

  updatePaymentSummary();
}

function updatePaymentDetails() {

    const method = document.getElementById("payment")?.value;
    const box = document.getElementById("paymentDetails");

    if (!box) return;

    if (method === "GCash") {

        box.style.display = "block";

        box.innerHTML = `
            <div style="
                font-size:16px;
                font-weight:700;
                color:#006f70;
                margin-bottom:10px;
            ">
                GCash Payment Details
            </div>

            <div style="
                font-size:14px;
                line-height:1.8;
                color:#344b4d;
            ">
                <strong>Account Name:</strong> Jannine Andico<br>
                <strong>GCash Number:</strong> 096 2847 6006
            </div>

            <div style="
                text-align:center;
                margin:15px 0;
            ">
                <img
                   src="QR/gcash_qr.png"
                    alt="GCash QR Code"
                  onclick="showQR('QR/gcash_qr.png', 'GCash QR Code')"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:contain;
                        background:#fff;
                        padding:8px;
                        border-radius:8px;
                    "
                >
            </div>

            <div style="
                font-size:13px;
                color:#687878;
                text-align:center;
            ">
                Scan the QR code to pay, then upload your payment screenshot below.
            </div>
        `;

    } else if (method === "Bank Transfer") {

        box.style.display = "block";

        box.innerHTML = `
            <div style="
                font-size:16px;
                font-weight:700;
                color:#006f70;
                margin-bottom:10px;
            ">
                Bank Transfer Details
            </div>

            <div style="
                font-size:14px;
                line-height:1.8;
                color:#344b4d;
            ">
                <strong>Bank:</strong> GOtyme bank<br>
                <strong>Account Name:</strong> Jannine Andico<br>
                <strong>Account Number:</strong> 0168 0340 1474
            </div>

            <div style="
                text-align:center;
                margin:15px 0;
            ">
                <img
                  src="QR/gotyme_qr.png"
                    alt="Bank Transfer QR Code"
                 onclick="showQR('QR/gotyme_qr.png', 'GoTyme Bank QR Code')"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:contain;
                        background:#fff;
                        padding:8px;
                        border-radius:8px;
                    "
                >
            </div>

            <div style="
                font-size:13px;
                color:#687878;
                text-align:center;
            ">
                Scan the QR code to pay, then upload your payment screenshot below.
            </div>
        `;

    } else {

        box.style.display = "none";
        box.innerHTML = "";
    }
}

function showQR(imageSrc, title) {
    const overlay = document.createElement("div");

    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.85);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        cursor:pointer;
    `;

    overlay.innerHTML = `
        <div style="
            position:relative;
            max-width:90%;
            max-height:90%;
            text-align:center;
        ">
            <div style="
                color:white;
                font-size:18px;
                font-weight:700;
                margin-bottom:15px;
            ">
                ${title}
            </div>

            <img
                src="${imageSrc}"
                alt="${title}"
                style="
                    max-width:85vw;
                    max-height:75vh;
                    width:auto;
                    height:auto;
                    object-fit:contain;
                    background:white;
                    padding:10px;
                    border-radius:12px;
                    box-shadow:0 10px 40px rgba(0,0,0,0.5);
                "
            >

            <div style="
                color:white;
                font-size:13px;
                margin-top:12px;
            ">
                Click anywhere to close
            </div>
        </div>
    `;

    overlay.onclick = function () {
        overlay.remove();
    };

    document.body.appendChild(overlay);
}

function updatePaymentSummary() {
  const total = cart.reduce(
    (sum, item) =>
    sum + PRODUCTS.find(p => p.id === item.id).price * item.quantity,
    0
  );

  const option =
    document.getElementById("payOption")?.value || "full";

    const paidNow =
        option === "dp"
            ? Math.ceil(total / 2)
            : total;

    const balance =
        total - paidNow;

  const box =
    document.getElementById("paymentSummary");

  if (!box) return;

    box.innerHTML = `
    <strong>Order Summary</strong><br>
    Total: ${money(total)}<br>
    Amount Due Now: ${money(paidNow)}<br>
    Remaining Balance: ${balance === 0 ? "₱0" : money(balance)}
    `;
}


async function placeOrder() {
  const name =
    document.getElementById("custName").value.trim();

  const email =
    document.getElementById("custEmail").value.trim();

  const phone =
    document.getElementById("custPhone").value.trim();

  const address =
    document.getElementById("custAddress").value.trim();

  const payOption =
    document.getElementById("payOption").value;

  const paymentMethod =
    document.getElementById("payment").value;

  if (!name)
    return alert("Please enter your full name.");

  if (
    !email ||
    !/^\S+@\S+\.\S+$/.test(email)
  )
    return alert("Please enter a valid email address.");

  if (!phone)
    return alert("Please enter your mobile number.");

  if (!address)
    return alert("Please enter your delivery address.");

  if (!cart.length)
    return alert("Your cart is empty.");

  const total = cart.reduce(
    (sum, item) =>
  sum + PRODUCTS.find(p => p.id === item.id).price * item.quantity,
    0
  );

    const paidNow =
        payOption === "dp"
            ? Math.ceil(total / 2)
            : total;
    
  const balance =
    total - paidNow;

  const items = cart.map(item => {
    const product =
      PRODUCTS.find(p => p.id === item.id);

    return {
      id: product.id,
      name: product.name,
        qty: item.quantity,
      price: product.price,
        subtotal: product.price * item.quantity
    };
  });

  const btn =
    document.getElementById("placeOrderBtn");

  btn.disabled = true;
  btn.textContent = "Placing Order…";

  try {

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body: JSON.stringify({
        action: "createOrder",

        order: {
          name,
          email,
          phone,
          address,
          payOption,
          paymentMethod,
          total,
          paidNow,
          balance,
          items
        }
      })
    });

    const result =
      await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
        "Unable to place order."
      );
    }

    const savedOrder = {
      orderNo: result.orderNo,
      name,
      email,
      phone,
      address,
      payOption,
      paymentMethod,
      total,
      paidNow,
      balance,
      status: result.status
    };

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(savedOrder)
    );

      cart = [];
      localStorage.removeItem("mamaAliCart");
      updateCartCount();
      

    document.getElementById(
      "modalContent"
    ).innerHTML = `
      <h2>Order Placed 🎉</h2>

      <p>Thank you, ${name}!</p>

      <div style="background:#fbf8f0;padding:18px;border-radius:10px">

        <strong>Order #${result.orderNo}</strong><br>

        Total: ${money(total)}<br>

        Payment:
        ${
          payOption === "dp"
            ? "50% Down Payment"
            : "Full Payment"
        }
        — ${paymentMethod}<br>

        Amount Due Now:
        ${money(paidNow)}<br>

        Remaining Balance:
        ${money(balance)}<br>

        Batch: September Pasabuy<br>

        ETA: September 13

      </div>

      <p style="color:#6e7c7c">
        A confirmation email has been sent to ${email}.
      </p>

      <button
        class="btn primary full"
        onclick="showTrack()">
        Track This Order
      </button>
    `;

  } catch (error) {

    console.error(error);

    btn.disabled = false;
    btn.textContent = "Place Order";

    alert(
      "We couldn't place the order yet. Please try again.\n\n" +
      error.message
    );
  }
}


// ============================================
// EVENTS
// ============================================

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderProducts
  );

}


const cartBtn =
  document.getElementById("cartBtn");


if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    openCart
  );

}


const trackBtn =
  document.getElementById("trackBtn");


if (trackBtn) {

  trackBtn.addEventListener(
    "click",
    showTrack
  );

}


const trackHeroBtn =
  document.getElementById(
    "trackHeroBtn"
  );


if (trackHeroBtn) {

  trackHeroBtn.addEventListener(
    "click",
    showTrack
  );

}


if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeModal();
      }

    }
  );

}


// ============================================
// START
// ============================================

renderFilters();
renderProducts();
updateCartCount();
