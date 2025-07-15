import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Perfil from "./pages/Perfil";
import PasosFacil from "./pages/PasosFacil";
import PasosAvanzados from "./pages/PasosAvanzados";



function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/Perfil" element={<Perfil />} />
				<Route path="/PasosFacil" element={<PasosFacil />} />
				<Route path="/PasosAvanzados" element={<PasosAvanzados />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
