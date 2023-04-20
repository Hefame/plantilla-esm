import EmpleadosDB from "../../backends/EmpleadosDB.mjs";
import PSC from "../../backends/PSC.mjs";
import logger from "../../utils/logger.mjs";
import express from "express";
const router = express.Router({ mergeParams: true });

router.post("/", async (req, res) => {
	logger.info("Petición de STOCK");
	const col = await EmpleadosDB.getCollection("test");
	let mongo = await col.findOne({});

	const teletipo = await PSC.consultaTelegramas(20230410120000.0, 20230410120010.0);
	
	res.json({ stock: 1, request: req.body, mongo: mongo, teletipo });
});

router.get("/", async (req, res) => {
	res.json({ stock: 1 });
});

export default router;
