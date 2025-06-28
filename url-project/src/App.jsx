import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinkRedirector from "./components/LinkRedirector";
import Statistics from "./components/Statistics";
import InputForm from "./components/InputForm";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NavButton() {
  const navigate = useNavigate();
  return (
    <Box p={2}>
      <Button variant="contained" color="secondary" onClick={() => navigate("/stats")}>
        View Statistics
      </Button>
    </Box>
  );
}

function App() {

  return (
      <Router>
           <NavButton />

        <Routes>
          <Route path="/" element={<InputForm />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:shortCode" element={<LinkRedirector />} />
        </Routes>
      </Router>
  );
}

export default App;