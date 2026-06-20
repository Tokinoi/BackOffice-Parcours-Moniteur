// src/App.jsx
import POIProvider from "./providers/POIProvider";
import MapPage from "./pages/MapPage";
import "./App.css";

function App() {
    return (
        <POIProvider>
            <MapPage />
        </POIProvider>
    );
}

export default App;