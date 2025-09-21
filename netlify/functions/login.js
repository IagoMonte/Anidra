import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    const sql = neon();

    const [user] = await sql`
      SELECT * FROM "Usuarios"."users"
      WHERE username = ${username}
    `;

    if (!user) {
      return { statusCode: 401, body: "Usuário não encontrado" };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { statusCode: 401, body: "Senha inválida" };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Erro interno no login" };
  }
}