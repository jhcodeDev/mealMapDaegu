import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";


function DetailMapPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [filterText, setFilterText] = useState([]);

  const [selectedShop, setSelectedShop] = useState(null);
  const [map, setMap] = useState(null);  

  const keyword = searchParams.get("keyword");
  const region = searchParams.get("region");
  const category = searchParams.get("category");
  const delivery = searchParams.get("delivery");
  const gunguCd = searchParams.get("selId");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  const filterData = () => {
    // const filteredData = results.filter(data => data.gunguCode.includes(gunguCd));
    const stored = JSON.parse(localStorage.getItem('storeData')) || [];
    // const filtered = stored.filter(item => item.storeName?.includes(keyword) || item.gunguCode?.includes(gunguCd));
    const cleanKeyword = gunguCd.toString().trim();
    
    let filtered = [];
    if(cleanKeyword) {
        filtered = stored.filter(item => item.coJobSt==="01" && item.gunguCode?.toString().includes(cleanKeyword));
    }

    // console.log('filtered: ', filtered);
    setFilterText(filtered);
  };

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
        setResults(item); // 응답 형식에 맞게 수정 필요
        filterData();
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
    //✅ 2. kakaoMap API 호출
    const script = document.createElement("script");

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          // center: new window.kakao.maps.LatLng(35.849005, 128.558425),
          // center: new window.kakao.maps.LatLng(35.6334626219468, 128.425151210972),
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
      });
    };
    
    script.onerror = () => {
      console.log('fail: ', script.src);
    }

    filterData();
  }, []);

  useEffect(() => {
    if (!map) return;

    const rawData = filterText;
    if(!filterText) return;
    console.log('markerData: ', rawData);

    const infoWindow = new window.kakao.maps.InfoWindow();

    rawData.forEach(item => {
      console.log('item: ', item);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(parseFloat(item.shopLat), parseFloat(item.shopLon)),
        title: item.shopName,
      });
      const content = `
        <div style="padding:5px; font-size:13px;">
          <strong>${item.shopName}</strong><br />
          주소: ${item.shopRoadAddr}<br />
          전화: ${item.shopTel}
        </div>
      `;

      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedShop(item);
        infoWindow.setContent(content);
        infoWindow.open(map,marker);
      });
    });
  }, [map]);

      // <div>
      //   <ul>
      //     {filterText.map((item, i) => (
      //       <li key={i}>{item.shopName} - {item.gunguCode}</li>
      //     ))}
      //   </ul>
      // </div>

  return (
    <div>
      <div>
        <h2>검색 결과</h2>
        <p>키워드: {keyword}</p>
        <p>지역: {region}</p>
        <p>카테고리: {category}</p>
        <p>배달 여부: {delivery}</p>
      </div>
      <div style={{ display: "flex" }}>
        <div id="map" style={{ width: '520px', height: '500px' }}></div>

        {/* 오른쪽 상세 정보 패널 */}
        <div style={{ width: "300px", padding: "10px", borderLeft: "1px solid #ccc" }}>
          {selectedShop ? (
            <div>
              <h3>{selectedShop.shopName}</h3>
              <p><strong>주소:</strong> {selectedShop.shopRoadAddr}</p>
              <p><strong>전화:</strong> {selectedShop.shopTel}</p>
              <p><strong>프랜차이즈:</strong> {selectedShop.coFrNm}</p>
              <p><strong>배달 여부:</strong> {selectedShop.deliverYn === "Y" ? "가능" : "불가"}</p>
            </div>
          ) : (
            <p>지도에서 마커를 클릭하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailMapPage;