// Khai báo biến cart ở phạm vi toàn cục
let cart = [];
let products = []; // Khai báo biến products ở phạm vi toàn cục
async function getProducts() {
  try {
    // Khởi tạo giỏ hàng từ localStorage trước khi tải sản phẩm
    initializeCart();

    const response = await apiGetProducts();
    products = response.data;
    display(products);
  } catch (error) {
    console.log(error);
  }
}

getProducts();

function display(products) {
  let html = products.reduce((result, value, index) => {
    let product = new Products(
      value.id,
      value.name,
      value.price,
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    return (
      result +
      `
           <tr>
             <td>${index + 1}</td>
             <td>${product.name}</td>
             <td>${product.price}</td>
             <td>${product.screen}</td>
             <td>${product.backCamera}</td>
             <td>${product.frontCamera}</td>
             <td>
               <img src="${product.img}" width="100px" height="100px" />
             </td>
             <td>${product.desc}</td>
             <td>${product.type}</td>
             <td>
             <button class="btn btn-danger" onclick="addToCart(${
               product.id
             })">Thêm vào giỏ hàng</button>
   
             </td>
           </tr>
         `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// Thêm sự kiện onchange cho dropdown (select)
document.getElementById("filterLoaiSP").onchange = function () {
  const selectedValue = this.value; // Lấy giá trị được chọn trong dropdown (select)
  filterProducts(selectedValue); // Gọi hàm filterProducts để lọc danh sách sản phẩm
};

function filterProducts(selectedValue) {
  apiGetProducts()
    .then((response) => {
      // Lấy danh sách sản phẩm từ response.data
      const allProducts = response.data;

      // Lọc danh sách sản phẩm dựa vào loại sản phẩm được chọn
      const filteredProducts =
        selectedValue === "all"
          ? allProducts
          : allProducts.filter(
              (product) => product.type.toLowerCase() === selectedValue
            );

      // Hiển thị danh sách sản phẩm đã lọc
      display(filteredProducts);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Gọi hàm getProducts khi tải trang
getProducts();

// Thêm sự kiện onchange cho dropdown (select)
document.getElementById("filterLoaiSP").onchange = function () {
  const selectedValue = this.value; // Lấy giá trị được chọn trong dropdown (select)
  filterProducts(selectedValue); // Gọi hàm filterProducts để lọc danh sách sản phẩm
};
// Thêm sự kiện click cho button CART để hiển thị giỏ hàng
document.getElementById("cartButton").addEventListener("click", () => {
  renderCart();
});

// Hàm hiển thị giỏ hàng
function renderCart() {
  let cartHtml = cart.reduce((result, item) => {
    return (
      result +
      `
         <tr>
         <td>${item.name}</td>
         <td>${item.price}</td>
         <td>
           <button class="btn btn-secondary btn-sm" onclick="decreaseQuantity(${
             item.id
           })">-</button>
           ${item.quantity}
           <button class="btn btn-primary btn-sm" onclick="increaseQuantity(${
             item.id
           })">+</button>
         </td>
         <td>${item.price * item.quantity}</td>
         <td>
              <button class="btn btn-danger btn-sm btn-remove" data-product-id="${
                item.id
              }">Xóa</button>
         </td>
       </tr>
         `
    );
  }, "");

  let amountCart = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  const totalAmount = calculateTotalPrice(); // Tính tổng giá tiền của giỏ hàng
  const cartTableBody = document.getElementById("container");
  cartTableBody.innerHTML = `
       <table class="table">
         <thead>
           <th>Name</th>
           <th>Price</th>
           <th>Quantity</th>
           <th>Total</th>  
           <th>Action</th> 
         </thead>
         <tbody>
           ${cartHtml}
         </tbody>
         <tr>
             <td colspan="3"><strong>THÀNH TIỀN:</strong></td>
             <td id="totalAmount" colspan="2"><strong>${totalAmount}</strong></td>
           </tr>
       </table>
     `;
  document.getElementById("cart-amount").innerHTML = amountCart;
  document.getElementById("totalAmount").innerHTML = totalAmount; // Hiển thị tổng tiền
}
// Hàm khởi tạo giỏ hàng từ danh sách sản phẩm ban đầu
function initializeCart() {
  // Kiểm tra xem có giỏ hàng trong localStorage hay không
  loadCartFromLocalStorage();

  // Nếu không có giỏ hàng trong localStorage, khởi tạo giỏ hàng từ danh sách sản phẩm ban đầu
  if (cart.length === 0) {
    products.forEach((product) => {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        screen: product.screen,
        backCamera: product.backCamera,
        frontCamera: product.frontCamera,
        img: product.img,
        desc: product.desc,
        type: product.type,
        quantity: 0,
      });
    });
  }
}

// Gọi hàm initializeCart để khởi tạo giỏ hàng từ danh sách sản phẩm ban đầu
initializeCart();

// Hàm cập nhật giỏ hàng khi thêm sản phẩm
function updateCart(productId) {
  // Tìm sản phẩm được chọn dựa vào productId
  const selectedProduct = products.find((product) => product.id === productId);

  if (selectedProduct) {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng lên 1
      existingCartItem.quantity++;
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm vào giỏ hàng
      cart.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      });
    }

    // Hiển thị giỏ hàng sau khi thêm sản phẩm
    renderCart();
  } else {
    console.log("Không có sản phẩm để thêm");
  }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  const existingCartItem = cart.findIndex((item) => item.id == productId);

  if (existingCartItem === -1) {
    let index = products.findIndex((item) => item.id == productId);
    const cartItem = new CartItem(
      products[index].id,
      products[index].name,
      products[index].price,
      products[index].img,
      1
    );

    cart.push(cartItem);
    renderCart(cart);

    if (cart.length > 0) {
      // Lưu giỏ hàng vào localStorage sau khi thay đổi
      saveCartToLocalStorage();
    }
  }

  // cart da ton tai cai element ma minh select den => khi muon tang cai quantity, thi em phai biet duoc cai vi tri index cua element trong mang  cart =>
  cart[existingCartItem].quantity += 1;

  renderCart(cart);
}

// Hàm tăng số lượng sản phẩm trong giỏ hàng
function increaseQuantity(productId) {
  const cartItem = cart.find((item) => item.id == productId);

  if (cartItem) {
    cartItem.quantity++;
    renderCart();
  }
  // Lưu giỏ hàng vào localStorage sau khi thay đổi
  saveCartToLocalStorage();
}

// Hàm giảm số lượng sản phẩm trong giỏ hàng
function decreaseQuantity(productId) {
  const cartItem = cart.find((item) => item.id == productId);

  if (cartItem) {
    // Giảm số lượng chỉ khi nó lớn hơn 0
    if (cartItem.quantity > 0) {
      cartItem.quantity--;
    }
    renderCart();
  }
  // Lưu giỏ hàng vào localStorage sau khi thay đổi
  saveCartToLocalStorage();
}
// hàm tính tổng tiền
function calculateTotalPrice() {
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  return totalPrice;
}
// hàm lưu vào localstorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load giỏ hàng từ localStorage:
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    cart = JSON.parse(cartData);
  }
}
// Thêm sự kiện click cho nút "THANH TOÁN"
document.getElementById("checkoutButton").addEventListener("click", () => {
  // Xóa giỏ hàng và set mảng giỏ hàng về mảng rỗng []
  cart = [];
  renderCart(); // Cập nhật giao diện giỏ hàng để hiển thị mảng rỗng

  // Lưu giỏ hàng rỗng vào localStorage
  saveCartToLocalStorage();
  alert("Thanh toán thành công");
});
// hàm remove
function removeProductFromCart(productId) {
  // Tìm sản phẩm cần xóa trong giỏ hàng
  const index = cart.findIndex((item) => item.id === productId);

  if (index !== -1) {
    // Nếu sản phẩm được tìm thấy trong giỏ hàng, xóa sản phẩm đó ra khỏi mảng giỏ hàng
    cart.splice(index, 1);
    renderCart(); // Cập nhật giao diện giỏ hàng sau khi xóa sản phẩm
    saveCartToLocalStorage(); // Lưu giỏ hàng vào localStorage sau khi thay đổi
  }
}

// Bổ sung sự kiện click cho nút "Xóa" trong hàm renderCart
document.getElementById("container").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-remove")) {
    const productId = event.target.dataset.productId;
    removeProductFromCart(productId);
  }
});

// Hàm xóa sản phẩm ra khỏi giỏ hàng
function removeProductFromCart(productId) {
  // Tìm sản phẩm cần xóa trong giỏ hàng
  const index = cart.findIndex((item) => item.id === productId);

  if (index !== -1) {
    // Nếu sản phẩm được tìm thấy trong giỏ hàng, xóa sản phẩm đó ra khỏi mảng giỏ hàng
    cart.splice(index, 1);
    renderCart(); // Cập nhật giao diện giỏ hàng sau khi xóa sản phẩm
    saveCartToLocalStorage(); // Lưu giỏ hàng vào localStorage sau khi thay đổi
  }
}
