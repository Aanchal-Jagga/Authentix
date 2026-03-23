import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import ImageDetection from "../pages/ImageDetection";
import TextVerification from "../pages/TextVerification";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<ImageDetection />} />
        <Route path="/text" element={<TextVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;