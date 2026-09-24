import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import GameRoom from "./GameRoom.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { useVisualViewport } from "./hooks/useVisualViewport.ts";
import MobileAppShell from "./components/MobileAppShell.tsx";

function App() {
  useVisualViewport();

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <MobileAppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room" element={<GameRoom />} />
          </Routes>
        </MobileAppShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
