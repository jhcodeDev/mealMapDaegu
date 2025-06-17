import Title from "../common/Title";
import Ads from "../common/Ads";
import OptButton from "../main/OptButton";
import SearchBar from "../main/SearchBar";
import LocaOptBar from "../main/LocaOptBar";
import { useState, useEffect } from "react";

export default function MainPage() {
  const [mode, setMode] = useState("location"); // 'location' or 'search'
  const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      const existing = localStorage.getItem('storeData');
      if(existing) return;

      try {
        // ✅ 1. 공공 API 호출
        // const response = await fetch(`https://https://apis.data.go.kr/6270000/dgMealCardShop/getShopList?keyword=${keyword}&region=${region}&category=${category}&delivery=${delivery}`);
        const response = await fetch(`https://apis.data.go.kr/6270000/dgMealCardShop/getShopList?serviceKey=${PUBLIC_API_KEY}&type=json&numOfRows=5000&pageNo=1`);

        const data = await response.json();
        const item = data.body.items.item;
        // const item = json?.body?.items?.item || [];
        localStorage.setItem('storeData', JSON.stringify(item));
        localStorage.setItem('storeData_un', item);

        console.log('API data sotred to localStorage');
        // setResults(item); // 응답 형식에 맞게 수정 필요
        // filterData();
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <Title />
      <Ads />
      <OptButton mode={mode} setMode={setMode} />
      {mode === "search" ? <SearchBar /> : <LocaOptBar />}
    </div>
  );
}
