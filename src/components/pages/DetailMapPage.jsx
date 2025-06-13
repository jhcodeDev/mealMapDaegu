import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";


function DetailMapPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  const keyword = searchParams.get("keyword");
  const region = searchParams.get("region");
  const category = searchParams.get("category");
  const delivery = searchParams.get("delivery");

  const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 1. 공공 API 호출
        // const response = await fetch(`https://https://apis.data.go.kr/6270000/dgMealCardShop/getShopList?keyword=${keyword}&region=${region}&category=${category}&delivery=${delivery}`);
        const response = await fetch(`https://apis.data.go.kr/6270000/dgMealCardShop/getShopList?serviceKey=${PUBLIC_API_KEY}&type=json&numOfRows=10&pageNo=1`);

        const data = await response.json();
        setResults(data); // 응답 형식에 맞게 수정 필요
        console.log(data);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();
  }, [keyword, region, category, delivery]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && results.length > 0) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(35.849005, 128.558425), // 기본 중심 서울
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);

      results.forEach((item) => {
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(item.lat, item.lng), // item.lat/lng는 실제 필드명에 맞게
          title: item.name,
        });
      });
    }
  }, [results]);


  useEffect(() => {
    const script = document.createElement("script");

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
    // script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_PUBLIC_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(35.849005, 128.558425),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
      });
    };

    script.onerror = () => {
      console.log('fail: ', script.src);
    }
  }, []);



  return (
    <div>
      <div>
        <h2>검색 결과</h2>
        <p>키워드: {keyword}</p>
        <p>지역: {region}</p>
        <p>카테고리: {category}</p>
        <p>배달 여부: {delivery}</p>
      </div>
      <div id="map" style={{ width: '540px', height: '500px' }}></div>
    </div>
  );
}

export default DetailMapPage;