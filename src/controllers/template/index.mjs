import MongoDBTemplate from "../../backends/MongoDBTemplate.mjs";
import AxiosTemplate from "../../backends/AxiosTemplate.mjs";
import logger from "../../utils/logger.mjs";
import express from "express";
const router = express.Router({ mergeParams: true });

// POST /template
router.post("/", async (req, res) => {


	logger.info("Petición de STOCK");
	const respuestaMongo = await MongoDBTemplate.consultaOk();

	// Ejemplo consulta AXIOS
	const respuestaAxios = await AxiosTemplate.consultaOk(20230410120000.0, 20230410120010.0);
	
	res.json({ stock: 1, body: req.body, mongo: respuestaMongo, axios: respuestaAxios });

});

// GET /template
router.get("/", async (req, res) => {
	res.json({ stock: 1 });
});

export default router;
