import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";

const mockData = [
  { id: "27140", label: "동구", lat: "35.887574", lng: "128.635579"},
  { id: "27290", label: "달서구", lat: "35.829812", lng: "128.532666"},
  { id: "27710", label: "달성군", lat: "35.774707", lng: "128.431367"},
  { id: "27230", label: "북구", lat: "35.885865", lng: "128.582914"},
  { id: "27170", label: "서구", lat: "35.871950", lng: "128.559220"},
  { id: "27110", label: "중구", lat: "35.869423", lng: "128.606121"},
  { id: "27260", label: "수성구", lat: "35.858174", lng: "128.630541"},
  { id: "27200", label: "남구", lat: "35.846140", lng: "128.597418"},
  // 필요한 만큼 더 추가
];


function DetailMapPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [filterText, setFilterText] = useState([]);

  const [selectedShop, setSelectedShop] = useState(null);
  const [map, setMap] = useState(null);  

  const keyword = searchParams.get("keyword");
  const region = searchParams.get("region")?? "";
  const category = searchParams.get("category");
  const delivery = searchParams.get("delivery");
  const gunguCd = searchParams.get("selId");
  const lat = searchParams.get("lat")?? "35.850909";
  const lng = searchParams.get("lng")?? "128.550726";
  const type = searchParams.get("type_opt")?? "SRC";

  const PUBLIC_API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  const filterData = () => {
    const stored = JSON.parse(localStorage.getItem('storeData')) || [];
    
    let filtered = [];
    if(type === "SRC") {
      if(keyword) {
        const clean = str => str?.toLowerCase().replace(/\s/g, '');

        filtered = stored.filter(item => 
          item.coJobSt==="01"
          && clean(item.shopName).includes(keyword.toLowerCase())
          && item.gunguCode?.toString().includes(region)
          // && item.shopBsType?.toString().includes(category==="전체"?"":category)
          // && item.deliverYn?.toString().includes(delivery==="전체"?"":delivery)
        );

      }
    } else {
      const cleanKeyword = gunguCd?.toString().trim();
      if(cleanKeyword) {
          filtered = stored.filter(item => item.coJobSt==="01" && item.gunguCode?.toString().includes(cleanKeyword));
      }
    }

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

    let coords = "";
    if(region) {
      coords = mockData.find(mock => mock.id === region);
    }
    const {lat, lng} = coords;

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

  const handleSearchInCurrentRegion = async () => {
    if (!map) return;

    const center = map.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();

    const radius = 1000; // 단위: 미터 (ex. 1km 반경)

    console.log("현재 중심 좌표:", lat, lng);

    // 서버에 요청 보내거나 클라이언트에서 거리 기반 필터링
    const params = {
      lat,
      lng,
      radius,
    };

    // API 호출 예시
    const url = `${endPoint}/getNearbyParks?lat=${lat}&lng=${lng}&radius=${radius}`;
    const res = await fetch(url);
    const json = await res.json();

    // 마커 다시 그리기 등 후속 작업
    updateMapMarkers(json.items);
  };


  const updateMapMarkers = (items) => {
    items.forEach(({ lat, lng, name }) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map: map,
        title: name,
      });
    });
  };


  return (
    <div>
      <div>
        <h2>검색 결과</h2>
        <p>키워드: {keyword}</p>
        <p>지역: {region}</p>
        <p>카테고리: {category}</p>
        <p>배달 여부: {delivery}</p>
      </div>
      <div style={{ display: "relative" }}>
        
        <div id="map" style={{ width: '520px', height: '500px' }}></div>

        {/* 지도 위 버튼 */}
        <button
          onClick={handleSearchInCurrentRegion}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            padding: '8px 12px',
            background: '#3182f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          이 지역에서 찾기
        </button>

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