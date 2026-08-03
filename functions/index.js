// Notificaciones en tiempo real al equipo cuando entra un lead nuevo.
// Se dispara al crearse un documento en "leads" o "partsQuotes" y avisa por
// los canales configurados en functions/.env (Telegram y/o correo Gmail).
// Si un canal no está configurado, simplemente se omite.
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineString } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

setGlobalOptions({ region: "us-east1", maxInstances: 3 });

// Configuración vía functions/.env (ver functions/.env.example)
const TELEGRAM_BOT_TOKEN = defineString("TELEGRAM_BOT_TOKEN", { default: "" });
const TELEGRAM_CHAT_ID = defineString("TELEGRAM_CHAT_ID", { default: "" });
const GMAIL_USER = defineString("GMAIL_USER", { default: "" });
const GMAIL_APP_PASSWORD = defineString("GMAIL_APP_PASSWORD", { default: "" });
const NOTIFY_EMAIL_TO = defineString("NOTIFY_EMAIL_TO", { default: "" });

/** Convierte un teléfono local (04XX...) a enlace wa.me internacional. */
function waLink(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const intl = digits.startsWith("58")
    ? digits
    : digits.startsWith("0")
      ? "58" + digits.slice(1)
      : digits;
  return `https://wa.me/${intl}`;
}

function line(label, value) {
  return value ? `${label}: ${value}` : "";
}

/** Texto plano del aviso para una cotización (colección "leads"). */
function formatLead(d) {
  return [
    "🔔 NUEVO LEAD — Cotización",
    "",
    line("Nombre", d.nombre),
    line("Empresa", d.empresa),
    line("WhatsApp", d.whatsapp),
    line("Responder", waLink(d.whatsapp)),
    line("Interés", Array.isArray(d.necesidades) ? d.necesidades.join(", ") : d.necesidad),
    line("Comentarios", d.comentarios),
    line("Origen", d.source),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Texto plano del aviso para una solicitud de repuestos ("partsQuotes"). */
function formatPartsQuote(d) {
  return [
    "🔧 NUEVO LEAD — Repuestos",
    "",
    line("Nombre", d.nombre),
    line("WhatsApp", d.whatsapp),
    line("Responder", waLink(d.whatsapp)),
    line("Equipo", [d.brand, d.model].filter(Boolean).join(" ")),
    line("Serial", d.serial),
    line("Categoría", d.category),
    line("Descripción", d.description),
    line("N° de parte", d.partNumber),
    line("Urgencia", d.urgencia),
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendTelegram(text) {
  const token = TELEGRAM_BOT_TOKEN.value();
  const chatId = TELEGRAM_CHAT_ID.value();
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    logger.error("Telegram falló", { status: res.status, body: await res.text() });
    return false;
  }
  return true;
}

async function sendEmail(subject, text) {
  const user = GMAIL_USER.value();
  const pass = GMAIL_APP_PASSWORD.value();
  const to = NOTIFY_EMAIL_TO.value() || user;
  if (!user || !pass) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  await transporter.sendMail({ from: `Grupo RCA Web <${user}>`, to, subject, text });
  return true;
}

async function notify(subject, text) {
  const results = await Promise.allSettled([sendTelegram(text), sendEmail(subject, text)]);
  const sent = results.some((r) => r.status === "fulfilled" && r.value === true);
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => logger.error("Canal de notificación falló", r.reason));
  if (!sent) {
    logger.warn(
      "Ningún canal de notificación está configurado o todos fallaron. " +
        "Configura TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID o GMAIL_USER/GMAIL_APP_PASSWORD en functions/.env"
    );
  }
}

exports.onNewLead = onDocumentCreated("leads/{leadId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;
  await notify(`Nuevo lead: ${data.nombre || "sin nombre"}`, formatLead(data));
});

exports.onNewPartsQuote = onDocumentCreated("partsQuotes/{quoteId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;
  await notify(`Nuevo lead de repuestos: ${data.nombre || "sin nombre"}`, formatPartsQuote(data));
});
