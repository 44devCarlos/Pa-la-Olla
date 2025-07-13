import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Perfil from "./pages/Perfil";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Perfil" element={<Perfil />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
