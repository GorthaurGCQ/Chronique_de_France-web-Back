import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`SELECT id, account_id, provider_id, LEFT(password, 30) as pwd_start FROM auth_account`;
console.log(JSON.stringify(rows, null, 2));

const users = await sql`SELECT id, email, name, role FROM auth_user`;
console.log("USERS:", JSON.stringify(users, null, 2));

await sql.end();
process.exit(0);
