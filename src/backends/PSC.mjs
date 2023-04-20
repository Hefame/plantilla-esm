import axios from "axios";
import logger from "../utils/logger.mjs";

class PSC {
	static #axios;

	static async #getInstance() {
		if (!PSC.#axios) {
			PSC.#axios = axios.create({
				baseURL: process.env.MSRV_PSC_URL,
				validateStatus: (status) => true,
			});
			logger.axios(`Creada instancia AXIOS para PSC contra ${process.env.MSRV_PSC_URL}`);
		}
		return PSC.#axios;
	}

	static async consultaTelegramas(desde, hasta) {
		const instance = await PSC.#getInstance();

		let response = await instance.post(`/callFunction/ZWM_REP_TELEGRAM`, {
			TIMESTAMP_LOW: desde,
			TIMESTAMP_HIGH: hasta,
		});
		if (response.status > 300) {
			throw MsRestError.from(response.data);
		}
		return response.data?.TELEGRAMS_TABLE;
	}
}

export default PSC;
