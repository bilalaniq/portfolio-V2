// src/App.tsx
import { Route, Routes } from "react-router";
import Home from "./pages/home";
import Paper from "./pages/blog";
import Blogs from "./pages/blogs"; // <-- import the new component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:slug" element={<Paper />} />
      {/* Blog routes */}
      <Route path="/blogs" element={<Blogs />} />
    </Routes>
  );
};

export default App;