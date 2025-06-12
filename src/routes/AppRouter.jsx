import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "../components/pages/SearchPage";
import ResultPage from "../components/pages/DetailMapPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}
