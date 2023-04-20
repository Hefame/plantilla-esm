import HttpError from "../model/HttpError.mjs";
import express from "express";
import bodyParser from "body-parser";
import winstonMiddleware from "../middleware/winston.middleware.mjs";
import logger from "../utils/logger.mjs";
import expressRouter from "../controllers/express.router.mjs";

const expressApp = async (opciones) => {
	return new Promise((resolve) => {
		logger.debug("Inicializando aplicación Express con la siguiente configuración:");
		logger.debug(opciones);

		const app = express();
		app.use(winstonMiddleware);
		app.disable("x-powered-by");

		if (opciones?.parsers?.json?.activo) {
			app.use(bodyParser.json(opciones.parsers.json.opciones || { limit: "1mb" }));
			logger.debug("Activado Express bodyparser JSON con opciones:");
			logger.debug(opciones.parsers.json.opciones);
		}

		if (opciones?.parsers?.urlencoded?.activo) {
			app.use(bodyParser.urlencoded(opciones.parsers.urlencoded.opciones || { extended: true }));
			logger.debug("Activado Express bodyparser URL-Encoded con opciones:");
			logger.debug(opciones.parsers.urlencoded.opciones);
		}

		if (opciones?.parsers?.raw?.activo) {
			app.use(bodyParser.raw(opciones.parsers.raw.opciones || { inflate: true, limit: "1mb", type: "*/*" }));
			logger.debug("Activado Express bodyparser RAW con opciones:");
			logger.debug(opciones.parsers.raw.opciones);
		}

		app.use(async (errorExpress, req, res, next) => {
			if (errorExpress) {
				const error = HttpError.from(errorExpress, 400);
				return error.express(res);
			}
			next();
		});

		app.get("/health", (req, res) => {
			res.json({ ok: true });
		});

		// Carga de los controladores Express
		expressRouter(app);

		app.use(async (req, res) => {
			const error = new HttpError(404, "No se encuentra la ruta solicitada");
			return error.express(res);
		});

		const puerto = parseInt(process.env.EXPRESS_PUERTO, 10) || 3000;
		app.listen(puerto, () => {
			logger.info(`Servicio Express a la escucha en el puerto ${puerto}`);
			resolve();
		});
	});
};

export default expressApp;
