function Products(
  id,
  name,
  price,
  screen,
  backCamera,
  frontCamera,
  img,
  desc,
  type
) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.screen = screen;
  this.backCamera = backCamera;
  this.frontCamera = frontCamera;
  this.img = img;
  this.desc = desc;
  this.type = type;
}

class CartItem {
  constructor(id, name, price, img, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.quantity = quantity;
  }
}
