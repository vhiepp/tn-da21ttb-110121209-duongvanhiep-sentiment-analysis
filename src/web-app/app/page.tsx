"use client";

import FormSearch from "@/components/FormSearch";
import { useSearchParams } from "next/navigation";


export default function Home() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");

  if (!text) {
    return <FormSearch />;
  }

  return (
    <>
      <p>{text}</p>
    </>
  );
}
