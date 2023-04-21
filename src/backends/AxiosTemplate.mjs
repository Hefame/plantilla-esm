import axios from "axios";
import logger from "../utils/logger.mjs";

/**
 * El nombre se utiliza para determinar de manera estandar el nombre de las variables de entorno
 * esperadas.
 */
const NOMBRE = "TEMPLATE";
const getEntorno = (nombreVariable) => {
	return process.env[`AXIOS_${NOMBRE}_${nombreVariable}`];
};

const log = logger.generarSubnivel("axios", NOMBRE.toLowerCase());

class AxiosTemplate {
	static #axios;

	static async #getInstance() {
		if (!AxiosTemplate.#axios) {
			AxiosTemplate.#axios = axios.create({
				baseURL: getEntorno("URL"),
				validateStatus: (status) => true,
			});
			log(`Creada instancia AXIOS para PSC contra ${getEntorno("URL")}`);
		}
		return AxiosTemplate.#axios;
	}

	static async consultaOk(desde, hasta) {
		const _inicio = Date.now();

		const method = "post";
		const url = "/callFunction/ZWM_REP_TELEGRAM";
		const body = {
			TIMESTAMP_LOW: desde,
			TIMESTAMP_HIGH: hasta,
		};

		try {
			const instance = await AxiosTemplate.#getInstance();

			let response = await instance[method](url, body);
			const _fin = Date.now();
			log(`${method.toUpperCase()} ${url} - ${_fin - _inicio}ms - ${response.status} - ${response.headers?.["content-length"]}bytes`);

			if (response.status > 300) {
				throw new HttpError(500, `La llamada AXIOS falló con código de error ${response.status}`);
			}
			return response.data?.TELEGRAMS_TABLE;
		} catch (error) {
			const _fin = Date.now();
			log(`${method.toUpperCase()} ${url} - ${_fin - _inicio}ms - Error: ${error.message} `);
			throw HttpError.from(error, 500);
		}
	}
}

export default AxiosTemplate;
