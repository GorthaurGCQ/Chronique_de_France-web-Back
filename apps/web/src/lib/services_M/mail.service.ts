// =============================================================================
// SERVICE — Envoi d'e-mails transactionnels (Nodemailer / Gmail)
// Utilisé par : auth (reset MDP), inscriptions événements
// =============================================================================

// Module : node_modules/nodemailer
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

/** Vérifie que GMAIL_USER et GMAIL_APP_PASSWORD sont définis. */
export function isMailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getFromAddress(): string {
  return `"Chronique de France" <${process.env.GMAIL_USER}>`;
}

/** Transport SMTP Gmail (singleton lazy). */
export function getMailTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

function emailLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 40px 32px;text-align:center;">
            <h1 style="color:#d4af37;margin:0;font-size:26px;font-weight:700;letter-spacing:1px;">⚜ Chronique de France</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${title}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">${bodyHtml}</td>
        </tr>
        <tr>
          <td style="background:#f9f9f7;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#bbb;font-size:12px;margin:0;">© ${new Date().getFullYear()} Chronique de France · Tous droits réservés</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** E-mail de réinitialisation du mot de passe (Better Auth). */
export async function sendResetPasswordEmail(params: {
  to: string;
  name?: string | null;
  url: string;
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn("[mail] SMTP non configuré — e-mail reset non envoyé");
    return false;
  }

  const greeting = params.name ?? params.to;
  const body = `
    <p style="color:#333;font-size:16px;margin:0 0 16px;">Bonjour <strong>${greeting}</strong>,</p>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.url}" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#b8941f);color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    <p style="color:#888;font-size:13px;line-height:1.6;margin:24px 0 0;">Ce lien expirera dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez simplement cet e-mail.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
    <p style="color:#aaa;font-size:12px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:<br/>
      <a href="${params.url}" style="color:#d4af37;word-break:break-all;">${params.url}</a>
    </p>`;

  try {
    await getMailTransporter().sendMail({
      from: getFromAddress(),
      to: params.to,
      subject: "Réinitialisation de votre mot de passe",
      html: emailLayout("Réinitialisation du mot de passe", body),
    });
    return true;
  } catch (err) {
    console.error("[mail] Échec envoi reset mot de passe", err);
    return false;
  }
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** E-mail de confirmation d'inscription à un événement culturel. */
export async function sendEventRegistrationConfirmation(params: {
  to: string;
  prenom: string;
  nom: string;
  event: { titre: string; lieu: string; date: Date };
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn("[mail] SMTP non configuré — confirmation événement non envoyée");
    return false;
  }

  const eventDate = params.event.date;
  const body = `
    <p style="color:#333;font-size:16px;margin:0 0 16px;">Bonjour <strong>${params.prenom} ${params.nom}</strong>,</p>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">Votre inscription à l'événement suivant est bien enregistrée&nbsp;:</p>
    <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="color:#1a1a2e;font-size:18px;font-weight:700;margin:0 0 12px;">${params.event.titre}</p>
      <p style="color:#555;font-size:14px;margin:0 0 8px;">📅 ${formatEventDate(eventDate)} · ${formatEventTime(eventDate)}</p>
      <p style="color:#555;font-size:14px;margin:0;">📍 ${params.event.lieu}</p>
    </div>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Conservez cet e-mail comme justificatif. À bientôt&nbsp;!</p>`;

  try {
    await getMailTransporter().sendMail({
      from: getFromAddress(),
      to: params.to,
      subject: `Confirmation — ${params.event.titre}`,
      html: emailLayout("Confirmation d'inscription", body),
    });
    return true;
  } catch (err) {
    console.error("[mail] Échec envoi confirmation événement", err);
    return false;
  }
}

/** E-mail d'inscription en liste d'attente (événement complet). */
export async function sendEventWaitlistConfirmation(params: {
  to: string;
  prenom: string;
  nom: string;
  event: { titre: string; lieu: string; date: Date };
  position: number;
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn("[mail] SMTP non configuré — e-mail liste d'attente non envoyé");
    return false;
  }

  const eventDate = params.event.date;
  const body = `
    <p style="color:#333;font-size:16px;margin:0 0 16px;">Bonjour <strong>${params.prenom} ${params.nom}</strong>,</p>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">L'événement <strong>${params.event.titre}</strong> est complet. Vous êtes inscrit(e) en <strong>liste d'attente</strong> (position ${params.position}).</p>
    <div style="background:#f9f9f7;border:1px solid #eee;border-radius:8px;padding:20px;margin:0 0 24px;">
      <p style="color:#1a1a2e;font-size:18px;font-weight:700;margin:0 0 12px;">${params.event.titre}</p>
      <p style="color:#555;font-size:14px;margin:0 0 8px;">📅 ${formatEventDate(eventDate)} · ${formatEventTime(eventDate)}</p>
      <p style="color:#555;font-size:14px;margin:0;">📍 ${params.event.lieu}</p>
    </div>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Si une place se libère, vous serez automatiquement confirmé(e) et recevrez un nouvel e-mail.</p>`;

  try {
    await getMailTransporter().sendMail({
      from: getFromAddress(),
      to: params.to,
      subject: `Liste d'attente — ${params.event.titre}`,
      html: emailLayout("Liste d'attente", body),
    });
    return true;
  } catch (err) {
    console.error("[mail] Échec envoi liste d'attente", err);
    return false;
  }
}
