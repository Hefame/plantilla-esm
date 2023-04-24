RabbitTemplate.suscribir("telegramas", "r11.ssi1.#", (msg) => {
    let mensaje = JSON.parse(msg.content.toString());
    //buclelele = async () => {
    //    let data = require("./" + "data");
    //    for (let mensaje of data) {
    //        await Promise.all([new Promise((resolve) => setTimeout(resolve, 1000))]);

    // Descartamos ACKs
    if (mensaje.HANDSHAKE === "AC") return;
    const telegrama = FactoriaTelegramas.crear(mensaje);
    if (telegrama) {
        const { insertada, modificada, finalizada, orden, datosFin } = ColeccionCubetas.insertar(telegrama);
        if (orden) ordenesModificadas[orden] = { insertada, modificada, finalizada, orden, datosFin };
        if (modificada) {
            let estadoEstaciones = ColeccionEstaciones.calcularEstado();
            RabbitMQ.publicar(Conf.get().servicios.RabbitMQ.colas.estaciones, "", Buffer.from(JSON.stringify(estadoEstaciones)));
        }
    }
});