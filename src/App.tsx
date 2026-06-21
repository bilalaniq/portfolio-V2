import { Route, Routes } from "react-router";
import Home from "./pages/home";
import Paper from "./pages/paper";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* The :slug parameter lets you open /paper/jammer, /paper/decrypt, etc. */}
      <Route path="/paper/:slug" element={<Paper />} />
    </Routes>
  )
}

export default App;
