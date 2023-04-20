class HttpError extends Error {
	error = {
		codigo: 500,
		mensaje: "",
	};

	constructor(codigoHttp, mensaje, error) {
		const mensajeErrorEstandard = `HTTP${codigoHttp || 500}: ${mensaje}`;

		if (error) super(mensajeErrorEstandard, { cause: error });
		else super(mensajeErrorEstandard);

		this.error.codigo = parseInt(codigoHttp, 10) || 500;
		this.error.mensaje = mensaje;
	}

	get codigo() {
		return this.error.codigo;
	}
	get mensaje() {
		return this.error.mensaje;
	}

	express(res) {
		res.status(this.codigo).json(this);
	}

	static from(error, codigoHttp) {
		if (!error) return new HttpError(500, "Se recibió un valor nulo en la llamada");
		if (error.constructor === HttpError) return error;
		return new HttpError(codigoHttp || 500, error.message, error);
	}


}

export default HttpError;
