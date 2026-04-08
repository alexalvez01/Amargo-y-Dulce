import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Solo se permiten peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Comprobación de seguridad: verificar que solo nuestro backend pueda llamar a esta función
  const authHeader = req.headers.authorization;
  const VERCEL_API_SECRET = process.env.VERCEL_API_SECRET;

  if (!VERCEL_API_SECRET) {
    return res.status(500).json({ error: "Falta configurar VERCEL_API_SECRET en Vercel" });
  }

  if (authHeader !== `Bearer ${VERCEL_API_SECRET}`) {
    return res.status(401).json({ error: "Petición de correo no autorizada" });
  }

  // Extraemos los datos que envía el backend
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Faltan campos obligatorios para el correo" });
  }

  try {
    // Configuramos Nodemailer exacto a como estaba en el backend
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Usamos 465 SSL para Vercel Serverless
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    // Enviamos el correo
    const info = await transporter.sendMail({
      from: `"Amargo y Dulce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error al enviar el correo desde Vercel proxy:", error);
    return res.status(500).json({ error: "Falló el envío del correo por SMTP", details: error.message });
  }
}
