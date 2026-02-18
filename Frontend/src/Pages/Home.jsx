import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
}

export default Home;
