import React from "react";
import logoPaLaOlla from "../assets/img/logo.png";

export default function Home() {
	return (
		<main>
			<div className="flex justify-center items-center h-screen bg-gray-200">
				<img
					src={logoPaLaOlla}
					alt=""
					className="size-36 rounded-full shadow-lg transition-transform duration-500 hover:scale-200 animate-spin"
				/>
			</div>
		</main>
	);
}
