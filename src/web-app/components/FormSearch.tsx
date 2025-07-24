import Image from "next/image";
import { useRef, useState } from "react";

const FormSearch = () => {
  const formRef = useRef(null);
  const [warning, setWarning] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current as HTMLFormElement);
    const text = formData.get("text") as string;
    if (!text) {
      setWarning("Vui lòng nhập đoạn văn bản hoặc đường dẫn sản phẩm!");
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("text", text);

    window.location.href = url.toString();
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (warning.length > 0) {
      setWarning("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="mt-20 p-8">
        <h1 className="text-4xl font-bold text-center mb-25">
          Sentiment Analysis
        </h1>
        <div className="flex mb-2 pl-4 gap-2">
          <Image
            src={"/logo/tiki.png"}
            width={40}
            height={40}
            className="rounded-lg"
            alt=""
          />
          <Image
            src={"/logo/shopee.png"}
            width={40}
            height={40}
            className="rounded-lg"
            alt=""
          />
          <Image
            src={"/logo/lazada.png"}
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
              name="text"
              className="p-2 w-[500px] max-w-full focus:outline-none"
              autoFocus
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
    </div>
  );
};

export default FormSearch;
