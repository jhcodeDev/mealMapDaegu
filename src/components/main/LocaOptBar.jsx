import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "../css/LocaOptBar.css";


const mockData = [
  { id: "27290", label: "동구", img: "/assets/logo_donggu.jpg" },
  { id: "27710", label: "달서구", img: "../../assets/react.svg" },
  { id: "27170", label: "달성군", img: "/img3.jpg" },
  { id: "27140", label: "북구", img: "../assets/react.svg" },
  { id: "27230", label: "서구", img: "../assets/react.svg" },
  { id: "27110", label: "중구", img: "../assets/react.svg" },
  { id: "27260", label: "수성구", img: "../assets/react.svg" },
  { id: "27200", label: "남구", img: "../assets/react.svg" },
  // 필요한 만큼 더 추가
];

export default function LocaOptBar() {
  const [selectedId, setSelectedId] = useState(1);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleLoca = (selId) => {
    setSelectedId(selId);
    const params = new URLSearchParams({
      selId,
    });
    console.log("locaCd: ", selId);

    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="loca-opt-bar">
      <button className="arrow-btn" onClick={() => scroll("left")}>◀</button>

      <div className="card-list" ref={scrollRef}>
        {mockData.map((item) => (
          <div
            key={item.id}
            className={`card ${selectedId === item.id ? "selected" : ""}`}
            onClick={() => handleLoca(item.id)}
          >
            {/* <img src={item.img} alt={item.label} /> */}
            <span>{item.label}</span>
            {selectedId === item.id && <div className="pin-icon">📍</div>}
          </div>
        ))}
      </div>

      <button className="arrow-btn" onClick={() => scroll("right")}>▶</button>
    </div>
  );
}