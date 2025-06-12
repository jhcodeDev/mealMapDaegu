import { useState } from 'react'
import { useSearchParams } from "react-router-dom";



function DetailMapPage() {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword");
  const region = searchParams.get("region");
  const category = searchParams.get("category");
  const delivery = searchParams.get("delivery");

  return (
    <div>
      <h2>검색 결과</h2>
      <p>키워드: {keyword}</p>
      <p>지역: {region}</p>
      <p>카테고리: {category}</p>
      <p>배달 여부: {delivery}</p>
    </div>
  );
}

export default DetailMapPage;