import MathPoint from "./MathPoint.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MathPoint />
    </ThemeProvider>
  );
}

export default App;
