import apiClient from "@/api/api-client";
import { useEffect, useState } from "react";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate, br, zstd",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

const total = (obj: any) => {
  return Object.values(obj).reduce(
    // @ts-ignore
    (acc: number, curr: number) => acc + curr,
    0
  );
};

const ProductPredict = ({ id }: { id: string | undefined }) => {
  const [product, setProduct] = useState<any>({});
  const [time, setTime] = useState<number>(0);
  const [result, setResult] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictTotal, setPredictTotal] = useState<any>({
    positive: 0,
    neutral: 0,
    negative: 0,
    empty: 0,
  });

  const handleGetProductInfo = async () => {
    const response = await fetch(`https://tiki.vn/api/v2/products/${id}`, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    console.log(data);
    setProduct(data);
  };

  const getComment = async (page: number) => {
    const params = {
      limit: 20,
      page: page,
      include: "comments",
      sort: "score%7Cdesc,id%7Cdesc,stars%7Call",
      product_id: id || "",
    };
    // @ts-ignore
    const queryString = new URLSearchParams(params).toString();

    const response = await fetch(
      `https://tiki.vn/api/v2/reviews?${queryString}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    const data = await response.json();

    return {
      data: data.data
        .map((dt) => {
          if (dt.content.length > 0) {
            return dt.content;
          } else {
            setPredictTotal((prev: any) => ({
              ...prev,
              empty: prev.empty + 1,
            }));
          }
        })
        .filter(Boolean),
      total: data.paging.last_page,
      next_page:
        data.paging.current_page < data.paging.last_page
          ? data.paging.current_page + 1
          : null,
    };
  };

  const handleGetPredict = async (texts: string[]) => {
    if (texts.length === 0) return;
    try {
      const response = await apiClient.post("/predict/multi", { texts });
      const data = response.data;
      setResult((prev) => [...prev, ...data.results]);
      // setTime((prev) => prev + data.time);
      setPredictTotal((prev: any) => {
        return {
          ...prev,
          positive:
            prev.positive +
            data.results.filter((r: any) => r.predicted_class === "positive")
              .length,
          neutral:
            prev.neutral +
            data.results.filter((r: any) => r.predicted_class === "neutral")
              .length,
          negative:
            prev.negative +
            data.results.filter((r: any) => r.predicted_class === "negative")
              .length,
        };
      });
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  };

  // console.log(result);

  const handleGetCommentAndPredict = async () => {
    let page = 1;
    const timeStart = performance.now();
    while (page) {
      const { data, next_page } = await getComment(page);
      await handleGetPredict(data);
      page = next_page;
    }
    const timeEnd = performance.now();
    // chuyen sang giay
    setTime((timeEnd - timeStart) / 1000);
  };

  useEffect(() => {
    setResult([]);
    setTime(0);
    setPredictTotal({
      positive: 0,
      neutral: 0,
      negative: 0,
      empty: 0,
    });
    setProduct({});
    handleGetProductInfo();
    handleGetCommentAndPredict();
  }, [id]);

  return (
    <div className="w-[700px]">
      <div className="p-4 bg-white rounded-lg shadow-md">
        {product && (
          <div className="flex flex-row">
            <div className="w-[250px] mr-2">
              {product?.images && (
                <img
                  src={product.images[0].base_url}
                  alt=""
                  className="w-56 object-cover"
                />
              )}
              <p
                className="text-md text-gray-600 mt-2 font-bold"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product?.name || ""}
              >
                {product?.name || ""}
              </p>
              <hr className="mt-2" />
              <div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Đã bán:</span>{" "}
                  {product.quantity_sold?.value}
                </span>
                {/* <span className="text-sm text-gray-600"> | </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">SL đánh giá:</span>{" "}
                  {product.review_count}
                </span> */}
                <span className="text-sm text-gray-600"> | </span>
                <span className="text-sm text-gray-600">
                  ⭐️{product.rating_average}
                </span>
              </div>
            </div>
            <div className="pl-2 w-[430px]">
              <div className="flex items-center justify-between w-full pr-2">
                <h2 className="text-xl font-semibold ">Kết quả phân tích:</h2>
                <span className="text-md font-semibold">
                  {time > 0 && <>~ {Number(time).toFixed(3)} giây</>}
                  {time <= 0 && (
                    <div className="flex justify-center items-center">
                      <img className="w-6 h-6" src="/loading.jpg" alt="" />
                    </div>
                  )}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 rounded-lg text-xl my-2.5  justify-between`}
              >
                <span className="font-semibold"></span>
                <span>SL</span>
              </div>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xl my-2.5 text-green-500 bg-green-100 justify-between`}
              >
                <span className="font-semibold">😄 Tích cực </span>
                <span className="font-semibold text-2xl">
                  {predictTotal.positive}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xl my-2.5 text-gray-500 bg-gray-100 justify-between`}
              >
                <span className="font-semibold">😐 Trung lập </span>
                <span className="font-semibold text-2xl">
                  {predictTotal.neutral}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xl my-2.5 text-red-500 bg-red-100 justify-between`}
              >
                <span className="font-semibold">😡 Tiêu cực </span>
                <span className="font-semibold text-2xl">
                  {predictTotal.negative}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xl my-2.5 text-sky-500 bg-sky-100 justify-between`}
              >
                <span className="font-semibold">🦥 Trống </span>
                <span className="font-semibold text-2xl">
                  {predictTotal.empty}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xl my-2.5 text-gray-600 justify-between`}
              >
                <span className="">Tổng</span>
                <span className="font-semibold text-2xl">
                  {/* @ts-ignore */}
                  {!predictTotal ? 0 : total(predictTotal)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPredict;
