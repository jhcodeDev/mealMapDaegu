import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "../css/LocaOptBar.css";


const mockData = [
  { id: "27140", label: "동구", lat: "35.887574", lng: "128.635579",  img: "/assets/logo_donggu.jpg" },
  { id: "27290", label: "달서구", lat: "35.829812", lng: "128.532666",  img: "../../assets/react.svg" },
  { id: "27710", label: "달성군", lat: "35.774707", lng: "128.431367",  img: "/img3.jpg" },
  { id: "27230", label: "북구", lat: "35.885865", lng: "128.582914",  img: "../assets/react.svg" },
  { id: "27170", label: "서구", lat: "35.871950", lng: "128.559220",  img: "../assets/react.svg" },
  { id: "27110", label: "중구", lat: "35.869423", lng: "128.606121",  img: "../assets/react.svg" },
  { id: "27260", label: "수성구", lat: "35.858174", lng: "128.630541",  img: "../assets/react.svg" },
  { id: "27200", label: "남구", lat: "35.846140", lng: "128.597418",  img: "../assets/react.svg" },
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

  const handleLoca = (selId, lat, lng) => {
    setSelectedId(selId);
    const params = new URLSearchParams({
      selId,
      lat,
      lng
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
            onClick={() => handleLoca(item.id, item.lat, item.lng)}
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