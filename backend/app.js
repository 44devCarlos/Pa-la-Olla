import cors from "cors";

export const createApp = (express) => {
	const app = express();
	app.use(cors());

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
	return app;
};
