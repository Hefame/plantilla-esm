import { MongoClient, ObjectId } from "mongodb";
import logger from "../utils/logger.mjs";

const DEFAULT_COLLECTION_OPTIONS = { writeConcern: { w: 1, wtimeout: 1000 } };

class EmpleadosDB {
	static ObjectId = ObjectId;
	static #connection;
	static #database;
	static #collections = {};

	static async getBD() {
		if (!EmpleadosDB.#connection || !EmpleadosDB.#database) {
			const MONGO_CONF = {
				url: process.env.MDB_URL,
				database: process.env.MDB_DATABASE,
				connectionOptions: {
					connectTimeoutMS: 5000,
					serverSelectionTimeoutMS: 5000,
					useUnifiedTopology: true,
					appname: process.MICRONAME,
					// loggerLevel: "warn",
				},
			};

			const client = new MongoClient(MONGO_CONF.url, MONGO_CONF.connectionOptions);
			EmpleadosDB.#connection = await client.connect();
			EmpleadosDB.#database = EmpleadosDB.#connection.db(MONGO_CONF.database);

			const logUrl = new URL(MONGO_CONF.url);
			logUrl.password = "****";
			logger.mongodb(`Conexión establecida con la base de datos ${logUrl}`);
		}

		return EmpleadosDB.#database;
	}

	static async getCollection(collectionName) {
		if (!EmpleadosDB.#collections[collectionName]) {
			logger.mongodb(`Obteniendo colección ${collectionName}`);
			const COLLECTION_CONF = DEFAULT_COLLECTION_OPTIONS;
			const db = await EmpleadosDB.getBD();
			EmpleadosDB.#collections[collectionName] = db.collection(collectionName, COLLECTION_CONF);
			logger.mongodb(`Colección ${collectionName} instanciada`);
		}
		return EmpleadosDB.#collections[collectionName];
	}

	static oid(value) {
		if (value) return new ObjectId(value);
		return new ObjectId();
	}
}
export default EmpleadosDB;
