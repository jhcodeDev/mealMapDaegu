import { useState, useRef } from 'react'
import "../css/LocaOptBar.css";


const mockData = [
  { id: 1, label: "donggu", img: "../../assets/logo_donggu.jpg" },
  { id: 2, label: "dalseo", img: "../../assets/react.svg" },
  { id: 3, label: "loca me2", img: "/img3.jpg" },
  { id: 4, label: "loca me3", img: "../assets/react.svg" },
  // 필요한 만큼 더 추가
];

export default function LocaOptBar() {
  const [selectedId, setSelectedId] = useState(1);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="loca-opt-bar">
      <button className="arrow-btn" onClick={() => scroll("left")}>◀</button>

      <div className="card-list" ref={scrollRef}>
        {mockData.map((item) => (
          <div
            key={item.id}
            className={`card ${selectedId === item.id ? "selected" : ""}`}
            onClick={() => setSelectedId(item.id)}
          >
            <img src={item.img} alt={item.label} />
            <span>{item.label}</span>
            {selectedId === item.id && <div className="pin-icon">📍</div>}
          </div>
        ))}
      </div>

      <button className="arrow-btn" onClick={() => scroll("right")}>▶</button>
    </div>
  );
}