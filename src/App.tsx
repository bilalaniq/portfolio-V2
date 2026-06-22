// src/App.tsx
import { Route, Routes } from "react-router";
import Home from "./pages/home";
import Paper from "./pages/blog";
import Blogs from "./pages/blogs";
import CourseDetail from "./pages/course-detail";
import CourseModulePage from "./pages/course-module";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:slug" element={<Paper />} />
      <Route path="/blogs" element={<Blogs />} />
      {/* Course routes – all nested under /blogs */}
      <Route path="/blogs/courses/:courseSlug" element={<CourseDetail />} />
      <Route path="/blogs/courses/:courseSlug/:moduleSlug" element={<CourseModulePage />} />
    </Routes>
  );
};

export default App;