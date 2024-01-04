// / Khai báo biến cart ở phạm vi toàn cục
let cart = [];
let products = []; // Khai báo biến products ở phạm vi toàn cục
let editingProductId = null; // Biến lưu trữ ID của sản phẩm đang chỉnh sửa
let isEditing = false; // Biến kiểm tra xem có đang trong chế độ chỉnh sửa hay không
let productToEdit = null; // Đảm bảo biến productToEdit được khai báo ở đây
let temporaryImage;

// Lấy danh sách sản phẩm từ API
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
// Hiển thị danh sách sản phẩm
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
             <button class="btn btn-danger" onclick="editProduct(${
               product.id
             })" >Chỉnh sửa</button>
             <button class="btn btn-success deleteButton" onclick="deleteProduct(${
               product.id
             })" >Xóa</button>
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

// Hàm khởi tạo giỏ hàng từ danh sách sản phẩm ban đầu
function initializeCart() {
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

// Hàm xóa sản phẩm
function deleteProduct(productId) {
  let alert = "Bạn có muốn xóa sản phẩm này";
  if (confirm(alert) == true) {
    apiDeleteProducts(productId);
  } else {
    return;
  }

  if (isEditing && editingProductId === productId) {
    // Nếu đang trong chế độ chỉnh sửa và sản phẩm cần xóa là sản phẩm đang chỉnh sửa,
    // thì thoát khỏi chế độ chỉnh sửa
    isEditing = false;
    editingProductId = null;
    document.getElementById("btnCapNhat").disabled = true;
  } else {
    // Nếu không trong chế độ chỉnh sửa hoặc không xóa sản phẩm đang chỉnh sửa,
    // thì xóa sản phẩm khỏi danh sách products
    products = products.filter((product) => product.id != productId);
  }

  // Hiển thị lại danh sách sản phẩm sau khi xóa
  display(products);
}

// hàm chỉnh sửa
function editProduct(productId) {
  isEditing = true; // Đặt isEditing thành true khiđang trong chế độ chỉnh sửa
  isEditingMode = true; // Đặt isEditingMode thành true khiđang trong chế độ chỉnh sửa
  // Tìm sản phẩm cần chỉnh sửa trong danh sách products
  productToEdit = products.find((product) => product.id == productId);

  // Kiểm tra xem sản phẩm cần chỉnh sửa có tồn tại hay không
  if (!productToEdit) {
    console.log("Không tìm thấy sản phẩm cần chỉnh sửa.");
    return;
  }

  // Lưu ID của sản phẩm cần chỉnh sửa vào biến toàn cục
  editingProductId = productId;

  // Đổ thông tin của sản phẩm cần chỉnh sửa vào các trường thông tin trong form THÊM MỚI
  document.getElementById("TenSP").value = productToEdit.name;
  document.getElementById("GiaSP").value = productToEdit.price;
  document.getElementById("manHinh").value = productToEdit.screen;
  document.getElementById("camSau").value = productToEdit.backCamera;
  document.getElementById("camTruoc").value = productToEdit.frontCamera;
  document.getElementById("moTa").value = productToEdit.desc;

  // Gán giá trị loại sản phẩm vào dropdown
  document.getElementById("loaiSP").value = productToEdit.type;
  // Vô hiệu hóa nút "THÊM SẢN PHẨM" và hiển thị nút "CẬP NHẬT" khi ở chế độ chỉnh sửa
  document.getElementById("btnThemSanPham").disabled = true;
  document.getElementById("btnCapNhat").style.display = "block";
  // Enable lại button "CẬP NHẬT" khi bắt đầu chỉnh sửa
  document.getElementById("btnCapNhat").disabled = false;
  // Mở cửa sổ modal để hiển thị form THÊM MỚI đã điền thông tin của sản phẩm
  $("#myModal").modal("show");
}

// Thêm sự kiện lắng nghe cho nút "Cập nhật" trong form THÊM MỚI để xử lý việc cập nhật thông tin sản phẩm sau khi chỉnh sửa:
document.getElementById("btnCapNhat").addEventListener("click", () => {
  // Lấy giá trị từng trường thông tin của sản phẩm được chỉnh sửa
  const tenSanPham = document.getElementById("TenSP").value;
  const gia = document.getElementById("GiaSP").value;
  const manHinh = document.getElementById("manHinh").value;
  const cameraSau = document.getElementById("camSau").value;
  const cameraTruoc = document.getElementById("camTruoc").value;
  const hinhAnh = document.getElementById("HinhSP").value;
  const moTa = document.getElementById("moTa").value;
  const loaiSanPham = document.getElementById("loaiSP").value;

  // Cập nhật thông tin sản phẩm
  if (productToEdit) {
    productToEdit.name = tenSanPham;
    productToEdit.price = gia;
    productToEdit.screen = manHinh;
    productToEdit.backCamera = cameraSau;
    productToEdit.frontCamera = cameraTruoc;
    productToEdit.desc = moTa;
    productToEdit.type = loaiSanPham;

    // Nếu có hình ảnh mới được chọn, thì lưu nó vào sản phẩm
    if (temporaryImage) {
      productToEdit.img = temporaryImage;
    }

    // Hiển thị lại danh sách sản phẩm sau khi cập nhật
    display(products);

    // Thoát khỏi chế độ chỉnh sửa
    isEditing = false;
    editingProductId = null;

    // Xóa dữ liệu trong các trường thông tin sau khi cập nhật
    document.getElementById("TenSP").value = "";
    document.getElementById("GiaSP").value = "";
    document.getElementById("manHinh").value = "";
    document.getElementById("camSau").value = "";
    document.getElementById("camTruoc").value = "";
    // Xóa hình ảnh tạm thời
    temporaryImage = null;
    document.getElementById("moTa").value = "";
    document.getElementById("loaiSP").value = "phone"; // Đặt lại giá trị mặc định cho dropdown

    // Ẩn nút "Cập nhật" và hiển thị nút "Thêm sản phẩm" khi hoàn thành việc cập nhật
    document.getElementById("btnCapNhat").style.display = "none";
    document.getElementById("btnThemSanPham").style.display = "block";

    // Đóng cửa sổ modal sau khi cập nhật thành công
    $("#myModal").modal("hide");
  }
  let text = "Bạn có muốn thay đổi thông tin";
  if (confirm(text) == true) {
    apiUpdateProducts(productToEdit.id, productToEdit);
  } else {
    return;
  }
});

// Hàm xử lý sự kiện khi nhấn nút "Cập nhật"
function updateProduct() {
  // Lấy thông tin sản phẩm từ các trường nhập liệu trong modal
  let productId = editingProductId;
  let updatedProduct = {
    name: document.getElementById("TenSP").value,
    price: parseFloat(document.getElementById("GiaSP").value),
    screen: document.getElementById("manHinh").value,
    cameraRear: document.getElementById("camSau").value,
    cameraFront: document.getElementById("camTruoc").value,
    image: document.getElementById("HinhSP").value,
    description: document.getElementById("moTa").value,
    category: document.getElementById("loaiSP").value,
  };

  // Gọi hàm để cập nhật thông tin sản phẩm

  // Sau khi cập nhật, cần cập nhật lại giá trị của productToEdit
  productToEdit = products.find((product) => product.id == productId);
  // Reset form sau khi cập nhật thành công
  resetForm();

  // Enable lại button "THÊM SẢN PHẨM" sau khi cập nhật thành công
  document.getElementById("btnThemSanPham").disabled = false;
}
function searchProduct() {
  // Lấy từ khóa tìm kiếm từ input và loại bỏ khoảng trắng dư thừa
  const searchKeyword = document
    .getElementById("txtSearch")
    .value.trim()
    .toLowerCase();

  // Lấy danh sách sản phẩm từ products
  const allProducts = products;

  // Lọc danh sách sản phẩm dựa vào từ khóa tìm kiếm
  const filteredProducts =
    searchKeyword === ""
      ? allProducts // Nếu từ khóa tìm kiếm rỗng, hiển thị toàn bộ danh sách sản phẩm
      : allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchKeyword)
        );

  // Hiển thị danh sách sản phẩm đã lọc
  display(filteredProducts);

  // Hiển thị thông báo nếu không tìm thấy sản phẩm
  if (filteredProducts.length === 0) {
    alert("KHÔNG TÌM THẤY SẢN PHẨM");
  }
}

document.getElementById("searchIcon").addEventListener("click", () => {
  searchProduct();
});

// Lắng nghe sự kiện khi người dùng nhấn phím "Enter" trong ô input
document.getElementById("txtSearch").addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    searchProduct();
  }
});

// Sắp xếp giá tiền tăng dần
function sortByPriceAsc(productsArray) {
  productsArray.sort((a, b) => a.price - b.price);
  display(productsArray);
}

// Sắp xếp giá tiền giảm dần
function sortByPriceDesc(productsArray) {
  productsArray.sort((a, b) => b.price - a.price);
  display(productsArray);
}
function sortProducts(sortOrder) {
  // Lấy từ khóa tìm kiếm từ input và loại bỏ khoảng trắng dư thừa
  const searchKeyword = document
    .getElementById("txtSearch")
    .value.trim()
    .toLowerCase();

  // Lấy danh sách sản phẩm từ products
  const allProducts = products;

  // Lọc danh sách sản phẩm dựa vào từ khóa tìm kiếm
  const filteredProducts =
    searchKeyword === ""
      ? allProducts // Nếu từ khóa tìm kiếm rỗng, hiển thị toàn bộ danh sách sản phẩm
      : allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchKeyword)
        );

  if (sortOrder === "asc") {
    sortByPriceAsc(filteredProducts);
  } else if (sortOrder === "desc") {
    sortByPriceDesc(filteredProducts);
  }

  // Hiển thị thông báo nếu không tìm thấy sản phẩm
  if (filteredProducts.length === 0) {
    alert("KHÔNG TÌM THẤY SẢN PHẨM");
  }
}
document.getElementById("btnSortAsc").addEventListener("click", () => {
  sortProducts("asc");
});

document.getElementById("btnSortDesc").addEventListener("click", () => {
  sortProducts("desc");
});

// Hàm thêm sản phẩm mới
function addNewProduct() {
  // Xóa thông báo lỗi cũ
  const errorMessages = document.getElementsByClassName("text-danger");
  for (const errorMessage of errorMessages) {
    errorMessage.innerHTML = "";
  }

  // Lấy giá trị từng trường thông tin của sản phẩm mới
  const tenSanPham = document.getElementById("TenSP").value.trim();
  const gia = parseFloat(document.getElementById("GiaSP").value);
  const manHinh = document.getElementById("manHinh").value.trim();
  const cameraSau = document.getElementById("camSau").value.trim();
  const cameraTruoc = document.getElementById("camTruoc").value.trim();
  const moTa = document.getElementById("moTa").value.trim();
  const loaiSanPham = document.getElementById("loaiSP").value;

  // Khởi tạo biến isValid để kiểm tra các validation
  let isValid = true;

  // Kiểm tra từng trường thông tin và lưu thông báo lỗi vào biến tương ứng nếu có
  let tenSanPhamError = "";
  let giaError = "";
  let manHinhError = "";
  let cameraSauError = "";
  let cameraTruocError = "";
  let hinhSPError = "";
  let moTaError = "";

  if (!tenSanPham) {
    tenSanPhamError = "Vui lòng nhập tên sản phẩm!";
    isValid = false;
  }
  if (isNaN(gia) || gia <= 0) {
    giaError = "Vui lòng nhập giá tiền hợp lệ!";
    isValid = false;
  }
  if (!manHinh) {
    manHinhError = "Vui lòng nhập thông tin màn hình!";
    isValid = false;
  }
  if (!cameraSau) {
    cameraSauError = "Vui lòng nhập thông tin camera sau!";
    isValid = false;
  }
  if (!cameraTruoc) {
    cameraTruocError = "Vui lòng nhập thông tin camera trước!";
    isValid = false;
  }
  if (!temporaryImage || temporaryImage.length == 0) {
    hinhSPError = "Vui lòng chọn hình ảnh!";
    isValid = false;
  }
  if (!moTa) {
    moTaError = "Vui lòng nhập mô tả sản phẩm!";
    isValid = false;
  }

  // Hiển thị thông báo lỗi nếu có
  showError("errorTenSP", tenSanPhamError);
  showError("errorGiaSP", giaError);
  showError("errorManHinh", manHinhError);
  showError("errorCameraSau", cameraSauError);
  showError("errorCameraTruoc", cameraTruocError);
  showError("errorHinhSP", hinhSPError);
  showError("errorMoTa", moTaError);

  // Kiểm tra isValid, nếu không còn lỗi thì mới thêm sản phẩm vào danh sách
  if (isValid) {
    if (isEditing) {
      // Xử lý khi ở chế độ chỉnh sửa
      // Lấy ID sản phẩm cần chỉnh sửa
      const productId = editingProductId;

      // Tìm sản phẩm cần chỉnh sửa trong danh sách products
      const productToEdit = products.find(
        (product) => product.id === productId
      );

      // Kiểm tra xem sản phẩm cần chỉnh sửa có tồn tại hay không
      if (!productToEdit) {
        console.log("Không tìm thấy sản phẩm cần chỉnh sửa.");
        return;
      }

      // Cập nhật thông tin sản phẩm
      productToEdit.name = tenSanPham;
      productToEdit.price = gia;
      productToEdit.screen = manHinh;
      productToEdit.backCamera = cameraSau;
      productToEdit.frontCamera = cameraTruoc;
      productToEdit.desc = moTa;
      productToEdit.type = loaiSanPham;

      // Nếu có hình ảnh mới được chọn, thì lưu nó vào sản phẩm
      if (temporaryImage) {
        productToEdit.img = URL.createObjectURL(temporaryImage);
      }

      // Hiển thị lại danh sách sản phẩm sau khi cập nhật
      display(products);

      // Thoát khỏi chế độ chỉnh sửa
      isEditing = false;
      editingProductId = null;

      // Xóa dữ liệu trong các trường thông tin sau khi cập nhật
      resetForm();

      // Đóng cửa sổ modal sau khi cập nhật thành công
      $("#myModal").modal("hide");

      // Reset temporaryImage sau khi đã cập nhật sản phẩm
      temporaryImage = null;
    } else {
      // Xử lý khi ở chế độ thêm mới
      // Tạo một đối tượng sản phẩm mới
      const sanPhamMoi = {
        id: products.length + 1,
        name: tenSanPham,
        price: gia,
        screen: manHinh,
        backCamera: cameraSau,
        frontCamera: cameraTruoc,
        img: URL.createObjectURL(temporaryImage), // Lấy URL hình ảnh từ tệp tải lên
        desc: moTa,
        type: loaiSanPham,
      };
      alert("Thêm thành công");
      apiCreateProducts(sanPhamMoi);

      // Thêm sản phẩm mới vào mảng products
      products.push(sanPhamMoi);

      // Hiển thị bảng sản phẩm đã được cập nhật
      display(products);

      // Xóa dữ liệu trong các trường thông tin sau khi thêm sản phẩm
      resetForm();

      // Đóng cửa sổ modal khi thêm sản phẩm thành công
      $("#myModal").modal("hide");

      // Reset temporaryImage sau khi đã thêm sản phẩm
      temporaryImage = null;
    }

    // Enable lại button "CẬP NHẬT" sau khi thêm sản phẩm hoặc hoàn thành chỉnh sửa
    document.getElementById("btnCapNhat").disabled = false;

    // Enable lại button "THÊM SẢN PHẨM" sau khi thêm sản phẩm thành công
    document.getElementById("btnThemSanPham").disabled = false;
  }
}

// Thêm sự kiện onchange cho input hình ảnh (HinhSP)
document.getElementById("HinhSP").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    // Lưu trữ hình ảnh tạm thời
    temporaryImage = file;
  } else {
    // Nếu không có hình ảnh được chọn, đặt giá trị temporaryImage về null
    temporaryImage = null;
  }
});
// Hàm hiển thị thông báo lỗi
function showError(elementId, errorMessage) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.innerHTML = errorMessage;
  }
}
function addNewProductAndDisableUpdate() {
  // Tìm button "CẬP NHẬT" và disable nó
  const btnCapNhat = document.getElementById("btnCapNhat");
  if (btnCapNhat) {
    btnCapNhat.style.display = "block";
  }
  document.getElementById("TenSP").value = "";
  document.getElementById("GiaSP").value = "";
  document.getElementById("manHinh").value = "";
  document.getElementById("camSau").value = "";
  document.getElementById("camTruoc").value = "";
  document.getElementById("moTa").value = "";

  // Hiển thị nút "Thêm sản phẩm"
  document.getElementById("btnThemSanPham").style.display = "block";

  // Enable lại button "THÊM SẢN PHẨM"
  document.getElementById("btnCapNhat").disabled = true;
  document.getElementById("btnThemSanPham").disabled = false;
  // Thêm sự kiện "onclick" cho button "THÊM SẢN PHẨM"
  document.getElementById("btnThemSanPham").onclick = addNewProduct;
}

function resetForm() {
  if (!isEditing) {
    // Xóa dữ liệu trong các trường thông tin sau khi thêm sản phẩm
    document.getElementById("TenSP").value = "";
    document.getElementById("GiaSP").value = "";
    document.getElementById("manHinh").value = "";
    document.getElementById("camSau").value = "";
    document.getElementById("camTruoc").value = "";
    document.getElementById("HinhSP").value = "";
    document.getElementById("moTa").value = "";
    document.getElementById("loaiSP").value = "phone"; // Đặt lại giá trị mặc định cho dropdown
  } else {
    // Đổ thông tin của sản phẩm cần chỉnh sửa vào các trường thông tin trong form THÊM MỚI
    document.getElementById("TenSP").value = productToEdit.name;
    document.getElementById("GiaSP").value = productToEdit.price;
    document.getElementById("manHinh").value = productToEdit.screen;
    document.getElementById("camSau").value = productToEdit.backCamera;
    document.getElementById("camTruoc").value = productToEdit.frontCamera;
    // Nếu có hình ảnh, không cần hiển thị giá trị trong input file
    document.getElementById("HinhSP").value = "";
    document.getElementById("moTa").value = productToEdit.desc;
    document.getElementById("loaiSP").value = productToEdit.type;
  }
}
function resetFormAndButtons() {
  resetForm();

  // Ẩn nút "Cập nhật" và hiển thị nút "Thêm sản phẩm" khi hoàn thành việc cập nhật hoặc click vào "THÊM MỚI"
  document.getElementById("btnCapNhat").style.display = "block";
  document.getElementById("btnThemSanPham").style.display = "block";

  // Enable lại button "THÊM SẢN PHẨM" khi hoàn thành việc cập nhật hoặc click vào "THÊM MỚI"
  document.getElementById("btnThemSanPham").disabled = false;

  // Disable nút "CẬP NHẬT" khi hoàn thành việc cập nhật hoặc click vào "THÊM MỚI"
  document.getElementById("btnCapNhat").disabled = true;
}
