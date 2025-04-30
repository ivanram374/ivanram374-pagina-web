const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json({ limit: "10mb" })); // Para recibir PDFs en base64
app.use(bodyParser.json());

app.post("/comprar", async (req, res) => {
    const { email, factura } = req.body;

    if (!email || !factura) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    // Configurar el transporte de correo
    let transporter = nodemailer.createTransport({
        service: "gmail", // Puedes cambiarlo si usas otro servicio
        auth: {
            user: "tu_correo@gmail.com", // Coloca aquí tu correo
            pass: "tu_contraseña", // **IMPORTANTE** Usa una contraseña de aplicación si usas Gmail
        },
    });

    // Configurar el correo
    let mailOptions = {
        from: '"Tienda de Casas" <tu_correo@gmail.com>',
        to: email,
        subject: "Factura de tu compra",
        text: "Gracias por tu compra. Adjuntamos la factura.",
        attachments: [
            {
                filename: "factura.pdf",
                content: factura.split("base64,")[1], // Extraer el contenido Base64
                encoding: "base64",
            },
        ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado: " + info.response);
        res.json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ success: false, message: "Error enviando correo" });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
