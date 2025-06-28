import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinkRedirector from "./components/LinkRedirector";
import Statistics from "./components/Statistics";
import InputForm from "./components/InputForm";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<InputForm />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:shortCode" element={<LinkRedirector />} />
        </Routes>
      </Router>
  );
}

export default App;