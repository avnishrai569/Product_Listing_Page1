const apiEndpoint = "https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093";
const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("search");
const gridViewButton = document.getElementById("grid-view");
const listViewButton = document.getElementById("list-view");


const productCard = document.getElementsByClassName('product-card');

let products = [];

async function fetchProducts() {
  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    products = data.data;
    console.log(products);
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

function renderProducts(products, searchKeyword) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    const variantStrings = product.product_variants.map((variant) => {
      const key = Object.keys(variant)[0];
      return `${variant[key]}`;
    });
    productCard.innerHTML = `
        <div class='my-img'>
        <img src= "${product.product_image}"/>
        <span class="badge">${product.product_badge}</span>
        </div>
        <div class='txt'>
        
        <h2>${product.product_title}</h2>
        
        ${variantStrings.map(variant=>`<p class="variants-styling">${highlightMatches(variant,searchKeyword)}</p>`).join(' ')}
        
        </div>
    `;

    productContainer.appendChild(productCard);
  });
}

function highlightMatches(text, searchKeyword) {
  if (!searchKeyword) {
    return text; 
  }

  const regex = new RegExp(searchKeyword, "gi");
  const matchFound = regex.test(text);

  if (matchFound) {
    return `<div class="highlight-green">${text}</div>`;
  } else {
    return text;
  }
}


searchInput.addEventListener("input", () => {
  const searchKeyword = searchInput.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.product_title.toLowerCase().includes(searchKeyword)
  );
  renderProducts(filteredProducts, searchKeyword); 
});

gridViewButton.addEventListener("click", () => {
  productContainer.classList.remove("active");

  for(let product of productCard){
    product.classList.add('vertical-view')
  }
});


listViewButton.addEventListener("click", () => {
  productContainer.classList.add("active");
  
  for(let product of productCard){
    product.classList.remove('vertical-view')
  }
});

fetchProducts();

