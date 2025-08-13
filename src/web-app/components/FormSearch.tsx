import apiClient from "@/api/api-client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { text } from "stream/consumers";
import ProductPredict from "./ProductPredict";

const labels: any = {
  negative: {
    name: "Tiêu cực",
    color: "text-red-500",
    bgColor: "bg-red-100",
    emoji: "😡",
  },
  neutral: {
    name: "Trung lập",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    emoji: "😐",
  },
  positive: {
    name: "Tích cực",
    color: "text-green-500",
    bgColor: "bg-green-100",
    emoji: "😄",
  },
};

const idx: string[] = ["positive", "neutral", "negative"];

// viết hàm chuyển đổi sang % làm tròn 2 chữ số
const roundToPercentage = (value: number) => {
  return Math.round(value * 10000) / 100;
};

const FormSearch = () => {
  const formRef = useRef(null);
  const [warning, setWarning] = useState("");
  const [textPredict, setTextPredict] = useState("");
  const [isUrl, setIsUrl] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [productId, setProductId] = useState<string | undefined>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current as HTMLFormElement);
    let text = formData.get("text1") as string;
    if (!text) {
      setWarning("Vui lòng nhập đoạn văn bản hoặc đường dẫn sản phẩm!");
      return;
    }

    // bỏ khoảng trống dư thừa
    text = text.trim();

    // kiểm tra xem có bắt đầu từ http:// hoặc https:// không
    const isUrl = text.startsWith("http://") || text.startsWith("https://");

    if (isUrl) {
      // kiểm tra xem đường dẫn có hợp lệ không
      try {
        new URL(text);
        const isValidUrl =
          /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/.test(text);
        if (!isValidUrl) {
          setWarning("Đường dẫn không hợp lệ!");
          return;
        }
        // Nếu là URL hợp lệ, thì kiểm tra xem có phải là đường dẫn sản phẩm hay không
        if (
          !text.includes("tiki.vn")
          // !text.includes("shopee.vn") &&
          // !text.includes("lazada.vn")
        ) {
          setWarning("Đường dẫn phải là sản phẩm của Tiki!");
          return;
        }
      } catch (error) {
        setWarning("Đường dẫn không hợp lệ!");
        return;
      }

      console.log("Đây là đường dẫn sản phẩm:", text);
      setIsUrl(true);

      const m = new URL(text).pathname.match(/-p(\d+)(?=\.html|$)/);
      const id = m?.[1];
      console.log(id);
      setProductId(id);

      return;
    }
    if (text.length > 512) {
      setWarning(
        "Đoạn văn bản quá dài, vui lòng nhập đoạn văn bản khác! (Dưới 512 ký tự)"
      );
      return;
    }
    if (text !== textPredict) {
      setIsUrl(false);
      setTextPredict(text);
      setWarning("");
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (warning.length > 0) {
      setWarning("");
    }
  };

  const handlePredict = async (text: string) => {
    if (!text) return;
    setResult(null);
    try {
      const response = await apiClient.post("/predict", { text });
      const data = response.data;
      console.log(data);
      // setTextPredict(text);
      setResult(data);
    } catch (error) {
      console.error("Error during prediction:", error);
      setWarning("Có lỗi xảy ra trong quá trình phân tích cảm xúc.");
    }
  };

  useEffect(() => {
    if (textPredict.length > 0) {
      console.log("Text to predict:", textPredict);
      handlePredict(textPredict);
      // Call the API to get the prediction
    }
  }, [textPredict]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="mt-10 p-8">
        <h1 className="text-4xl font-bold text-center mb-15">
          Sentiment Analysis
        </h1>
        <div className="flex mb-2 pl-4 gap-2">
          <Image
            src={"/logo/text.png"}
            width={30}
            height={40}
            // className="rounded-lg"
            alt=""
          />
          <Image
            src={"/logo/tiki.png"}
            width={40}
            height={40}
            className="rounded-lg"
            alt=""
          />
        </div>
        <form action="" onSubmit={handleSubmit} ref={formRef} method="get">
          <div className="flex justify-center border border-gray-300 p-0.5 pl-3 bg-white rounded-4xl relative">
            <input
              type="text"
              placeholder="Nhập đoạn văn bản hoặc đường dẫn sản phẩm"
              name="text1"
              className="p-2 w-[500px] max-w-full focus:outline-none"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={handleTextChange}
            />
            {warning && (
              <span className="absolute top-full left-3 text-sm italic text-red-500">
                {warning}
              </span>
            )}
            <button className="bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
      {!isUrl && (
        <div className="w-[600px]">
          {textPredict && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 text-justify mb-4">
                ✍🏼 {textPredict}
              </p>
              {!result && (
                <div className="flex justify-center mb-4">
                  <img className="w-10 h-10" src="/loading.jpg" alt="" />
                </div>
              )}
              {result && (
                <>
                  <h2 className="text-xl font-semibold ">Kết quả phân tích:</h2>
                  <div className="text-center">
                    <p className="text-8xl">
                      {labels[result.predicted_class].emoji}
                    </p>
                    <p
                      className={
                        "text-2xl font-bold mt-1 " +
                        labels[result.predicted_class].color
                      }
                    >
                      {labels[result.predicted_class].name}
                    </p>
                  </div>
                  <div className="w-full mt-8 flex gap-2 justify-between">
                    {idx.map((cls) => (
                      <div
                        key={`label-${cls}`}
                        className={`flex items-center gap-2 p-2 rounded-lg ${labels[cls].bgColor} ${labels[cls].color}`}
                      >
                        <span>{labels[cls].emoji}</span>
                        <span>{labels[cls].name}</span>
                        <span>
                          {roundToPercentage(result.prob_percentages[cls])}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {isUrl && <ProductPredict id={productId} />}
    </div>
  );
};

export default FormSearch;
