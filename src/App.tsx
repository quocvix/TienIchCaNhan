import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import GameRoom from "./GameRoom.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<GameRoom />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
