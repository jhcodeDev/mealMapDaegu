import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SearchBar.css";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("전체");
  const [delivery, setDelivery] = useState("");
  const [type_opt, setType_opt] = useState("SRC");
  const navigate = useNavigate();
  
  const handleReset = () => {
    setKeyword("");
    setRegion("");
    setCategory("전체");
    setDelivery("전체");
  };

  const handleSearch = () => {
    if(!keyword) {
      alert('please insert the keyword'); 
      return;
    }

    console.log("검색:", { keyword, region, category, delivery });
    // 검색 로직 처리
    setType_opt("SRC");

    const params = new URLSearchParams({
      type_opt,
      keyword,
      region,
      category,
      delivery,
    });

    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="search-bar-container">
      {/* 검색창 */}
      <div className="search-input-wrapper">
        <input
          type="text"
          value={keyword}
          placeholder="검색어를 입력해주세요"
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && <button onClick={() => setKeyword("")}>❌</button>}
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 필터 */}
      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">전체</option>
          <option value="27140">동구</option>
          <option value="27290">달서구</option>
          <option value="27710">달성군</option>
          <option value="27230">북구</option>
          <option value="27170">서구</option>
          <option value="27110">중구</option>
          <option value="27260">수성구</option>
          <option value="27200">남구</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">전체 </option>
          <option value="10">치킨/찜닭 </option>
          <option value="11">중식 </option>
          <option value="12">분식 </option>
          <option value="13">한식 </option>
          <option value="14">찜/탕 </option>
          <option value="15">피자 </option>
          <option value="16">족발/보쌈 </option>
          <option value="17">패스트푸드 </option>
          <option value="18">돈까스/일식 </option>
          <option value="19">도시락/죽 </option>
          <option value="20">카페/디저트 </option>
          <option value="21">아시안/양식 </option>
          <option value="22">반찬/신선 </option>
          <option value="23">편의점 </option>
        </select>

        <div className="delivery-options">
          <label>
            <input
              type="radio"
              value=""
              checked={delivery === ""}
              onChange={(e) => setDelivery(e.target.value)}
            />
            전체
          </label>
          <label>
            <input
              type="radio"
              value="Y"
              checked={delivery === "Y"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            배달가능
          </label>
          <label>
            <input
              type="radio"
              value="N"
              checked={delivery === "N"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            배달불가
          </label>
        </div>
      </div>
    </div>
  );
}
