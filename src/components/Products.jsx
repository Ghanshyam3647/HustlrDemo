import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };
  // Changes are from here to keep minimal changes to code Part 1

  const localVariants = { // A Local Database to emulate "variants", because it wasn't there in the API
    1: ["S", "M", "L"],
    2: ["Red", "Blue", "Green"],
    3: ["S", "M", "L"],
    4: ["One Size"],
    5: ["Pack of 2", "Pack of 4"],
    // Added product IDs and their variants
  };
  // Changes are till here Part 1

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {/* Changes are from here to keep minimal changes to code Part 2*/}
        {filter.map((product) => {
          // console.log(product); // Checking what API is sending
          const isOutOfStock =
            product.stock === 0 || product.available === false;
          const variants = localVariants[product.id] || [];
          const rating = product.rating?.rate || 0;

          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div
                className="card h-100 border-0 shadow-sm position-relative"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.05)";
                }}
              >
                {/* Product Image */}
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt={product.title}
                  height={250}
                  style={{ objectFit: "contain" }}
                />

                <div
                  className="card-body text-center d-flex flex-column"
                  style={{ objectFit: "contain", backgroundColor: "#f9f9f9" }}
                >
                  {/* Stock Badge Above Title */}
                  <span
                    className={`badge py-2 px-3 mb-2 mx-auto ${
                      isOutOfStock ? "bg-danger" : "bg-success"
                    }`}
                    style={{
                      fontSize: "0.8rem",
                      display: "block",
                      width: "fit-content",
                    }}
                  >
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </span>

                  {/* Product Title */}
                  <h5 className="card-title mb-2 fw-semibold">
                    {product.title.length > 20
                      ? `${product.title.substring(0, 20)}...`
                      : product.title}
                  </h5>

                  {/* Description */}
                  <p className="card-text text-muted small mb-3">
                    {product.description.substring(0, 80)}...
                  </p>

                  {/* Rating Stars */}
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(rating)
                            ? "text-warning"
                            : "text-secondary"
                        }
                      >
                        ★
                      </span>
                    ))}
                    <small className="text-muted ms-1">
                      ({product.rating?.count || 0})
                    </small>
                  </div>

                  {/* Variant Dropdown */}
                  {variants.length > 0 ? (
                    <div className="mb-3">
                      <select className="form-select text-center">
                        {variants.map((variant, index) => (
                          <option key={index} value={variant}>
                            {variant}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div
                      className="mb-3 text-danger fw-semibold"
                      style={{ fontSize: "1.55rem" }}
                    >
                      No variants available
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-3">
                    <span className="fw-bold text-primary fs-5">
                      ${product.price}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto d-flex justify-content-center gap-2 flex-wrap">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => {
                        if (!isOutOfStock) {
                          toast.success("Added to cart");
                          addProduct(product);
                        }
                      }}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? "Unavailable" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Changes are till here Part 2*/}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
