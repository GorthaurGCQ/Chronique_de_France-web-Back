import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`SELECT password FROM auth_account WHERE provider_id = 'credential' LIMIT 1`;
const hash = rows[0].password;
console.log("Hash stocké:", hash);

const ok = await bcrypt.compare("12345678", hash);
console.log("Hash valide pour '12345678':", ok);

// Vérifie aussi la colonne banned sur auth_user
const users = await sql`SELECT id, email, banned, ban_reason FROM auth_user`;
console.log("Statut banned:", JSON.stringify(users, null, 2));

await sql.end();
process.exit(0);
