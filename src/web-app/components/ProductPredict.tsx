import { useEffect, useState } from "react";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate, br, zstd",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

const ProductPredict = ({ id }: { id: string | undefined }) => {
  const [product, setProduct] = useState<any>({});
  const handleGetProductInfo = async () => {
    const response = await fetch(`https://tiki.vn/api/v2/products/${id}`, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    console.log(data);
    setProduct(data);
  };

  useEffect(() => {
    handleGetProductInfo();
  }, [id]);

  return (
    <div className="min-w-[600px] max-w-full">
      <div className="p-4 bg-white rounded-lg shadow-md">
        {product && (
          <div className="flex flex-row">
            <div className="w-[250px]">
              {product?.images && (
                <img
                  src={product.images[0].base_url}
                  alt=""
                  className="w-56 object-cover"
                />
              )}
              <p className="text-md text-gray-600 mt-2 font-bold">
                {product?.name || "Tên sản phẩm không có sẵn"}
              </p>
              <hr className="mt-2" />
              <div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Đã bán:</span>{" "}
                  {product.quantity_sold?.value}
                </span>
                <span className="text-sm text-gray-600"> | </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">SL đánh giá:</span>{" "}
                  {product.review_count}
                </span>
                <span className="text-sm text-gray-600"> | </span>
                <span className="text-sm text-gray-600">
                  ⭐️{product.rating_average}
                </span>
              </div>
            </div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPredict;
