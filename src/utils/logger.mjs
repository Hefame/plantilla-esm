import winston from "winston";

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
export const levels = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	http: 4,
	debug: 5,
	mongodb: 6,
	axios: 7,
	all: 1000
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
export const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "all" : "warn";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
export const colorize = process.env.NODE_ENV !== "production";
export const colors = {
	fatal: "white redBG",
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "italic white",
	mongodb: "italic white",
	axios: "italic white",
	
};

winston.addColors(colors);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
export const transports = [
	// Allow the use the console to print the messages
	new winston.transports.Console({
		handleExceptions: true,
		format: winston.format.combine(
			winston.format.errors({ stack: true }),
			winston.format.timestamp({ format: "HH:mm:ss.SSS" }),
			colorize ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),
			winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}${info.stack ? "\r\n" + info.stack : ""}`)
		),
	}),
	// Allow to print all the error level messages inside the error.log file
	new winston.transports.File({
		filename: "error.log",
		level: "error",
		format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	}),
	// Allow to print all the error message inside the all.log file
	// (also the error log that are also printed inside the error.log)
	new winston.transports.File({
		filename: "combined.log",
		format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	}),
];

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
	level: level(),
	levels,
	transports,
});

export default logger;
