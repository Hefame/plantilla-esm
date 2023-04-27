process.MICRONAME = "PLANTILLA-ESM";
import expressApp from "./services/expressApp.mjs";
import schedulerTemplate from "./services/schedulerTemplate.mjs";
import suscripcionRabbit from "./services/suscripcionRabbit.mjs";
import logger from "./utils/logger.mjs";

const main = async () => {
	logger.info(`Iniciando servicio ${process.MICRONAME}`);
	await expressApp({
		puerto: parseInt(process.env.EXPRESS_PORT, 10) || 3000,
		parsers: {
			json: {
				activo: true,
				opciones: {
					limit: process.env.EXPRESS_MAX_BODY_SIZE || "1mb",
				},
			},
//			raw: {
//				activo: true,
//				opciones: {
//					inflate: true,
//					limit: "1mb",
//					type: "*/*",
//				},
//			},
//			urlencoded: {
//				activo: true,
//				opciones: {
//					extended: true,
//				},
//			}
		},
	});

	try {
		await suscripcionRabbit();
	} catch (error) {
		logger.fatal(`Error al suscribirse al servicio Rabbit: ${error.message}`);
	}

	schedulerTemplate();
};

main().catch((error) => {
	logger.fatal(`La aplicación a tenido un error irrecuperable: ${error.message}`);
});

export {};
