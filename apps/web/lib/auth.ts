import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.authUser,
      session: schema.authSession,
      account: schema.authAccount,
      verification: schema.authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"Chronique de France" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 40px 32px;text-align:center;">
            <h1 style="color:#d4af37;margin:0;font-size:26px;font-weight:700;letter-spacing:1px;">⚜ Chronique de France</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Réinitialisation du mot de passe</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#333;font-size:16px;margin:0 0 16px;">Bonjour <strong>${user.name ?? user.email}</strong>,</p>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#b8941f);color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color:#888;font-size:13px;line-height:1.6;margin:24px 0 0;">Ce lien expirera dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez simplement cet email — votre compte reste sécurisé.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
            <p style="color:#aaa;font-size:12px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:<br/>
              <a href="${url}" style="color:#d4af37;word-break:break-all;">${url}</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f7;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#bbb;font-size:12px;margin:0;">© ${new Date().getFullYear()} Chronique de France · Tous droits réservés</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "founder"],
      roles: {
        user:    { permissions: [] },
        admin:   { permissions: [] },
        founder: { permissions: [] },
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
