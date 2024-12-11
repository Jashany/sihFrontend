import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import UploadDocument from "./views/UploadDocument";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
