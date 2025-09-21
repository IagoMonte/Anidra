import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405};
  }

  try {
    const { username, name, password } = JSON.parse(event.body);
    if (!username || !name || !password) {
      return { statusCode: 400};
    }

    const sql = neon(); // já usa NETLIFY_DATABASE_URL
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO "Usuarios"."users" (username, name, password)
      VALUES (${username}, ${name}, ${hashedPassword})
      RETURNING id, username, name
    `;

    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500};
  }
}