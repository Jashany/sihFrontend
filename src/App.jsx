import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import MainSideBar from "./components/MainSideBar/MainSideBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <MainSideBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
