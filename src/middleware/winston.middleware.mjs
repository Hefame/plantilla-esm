import expressWinston from "express-winston";
import { transports } from "../utils/logger.mjs";

const winstonMiddleware = expressWinston.logger({
	transports,
	level: "http",
	meta: true, // optional: control whether you want to log the meta data about the request (default to true)
	expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
	colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
	ignoreRoute: (req, res) => {
		return req.url === '/health';
	}, 
	requestFilter: (req, propName) => {
		if (propName === "headers") {
			return Object.keys(req.headers).reduce(function (filteredHeaders, key) {
				if (key === "authorization") {
					filteredHeaders[key] = `*** (${req.headers[key].length} bytes) ***`;
				} else {
					filteredHeaders[key] = req.headers[key];
				}
				return filteredHeaders;
			}, {});
		} else {
			return req[propName];
		}
	},
});

export default winstonMiddleware;
