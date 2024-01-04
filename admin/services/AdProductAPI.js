function apiGetProducts() {
  return axios({
    url: "https://6576f992197926adf62cea11.mockapi.io/Products",
    method: "GET",
  });
}

function apiGetProductById(ProductsId) {
  return axios({
    url: `https://6576f992197926adf62cea11.mockapi.io/Products/${ProductsId}`,
    method: "GET",
  });
}
function apiCreateProducts(Products) {
  return axios({
    url: "https://6576f992197926adf62cea11.mockapi.io/Products",
    method: "POST",
    data: Products,
  });
}

function apiUpdateProducts(ProductsId, newProducts) {
  return axios({
    url: `https://6576f992197926adf62cea11.mockapi.io/Products/${ProductsId}`,
    method: "PUT",
    data: newProducts,
  });
}

function apiDeleteProducts(ProductsId) {
  return axios({
    url: `https://6576f992197926adf62cea11.mockapi.io/Products/${ProductsId}`,
    method: "DELETE",
  });
}
