import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SearchBar.css";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [delivery, setDelivery] = useState("전체");
  const navigate = useNavigate();
  
  const handleReset = () => {
    setKeyword("");
    setRegion("전체");
    setCategory("전체");
    setDelivery("전체");
  };

  const handleSearch = () => {
    console.log("검색:", { keyword, region, category, delivery });
    // 검색 로직 처리

    const params = new URLSearchParams({
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
          <option>전체</option>
          <option>서울</option>
          <option>부산</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>전체</option>
          <option>한식</option>
          <option>중식</option>
        </select>

        <div className="delivery-options">
          <label>
            <input
              type="radio"
              value="전체"
              checked={delivery === "전체"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            전체
          </label>
          <label>
            <input
              type="radio"
              value="배달가능"
              checked={delivery === "배달가능"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            배달가능
          </label>
          <label>
            <input
              type="radio"
              value="배달불가"
              checked={delivery === "배달불가"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            배달불가
          </label>
        </div>
      </div>
    </div>
  );
}
