import Title from "../common/Title";
import Ads from "../common/Ads";
import OptButton from "../main/OptButton";
import SearchBar from "../main/SearchBar";
import LocaOptBar from "../main/LocaOptBar";
import { useState } from "react";

export default function MainPage() {
  const [mode, setMode] = useState("location"); // 'location' or 'search'

  return (
    <div>
      <Title />
      <Ads />
      <OptButton mode={mode} setMode={setMode} />
      {mode === "search" ? <SearchBar /> : <LocaOptBar />}
    </div>
  );
}
