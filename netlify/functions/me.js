import { neon } from "@netlify/neon";
import jwt from "jsonwebtoken";

export async function handler(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader) return { statusCode: 401, body: "Não autorizado" };

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sql = neon();

    const [user] = await sql`
      SELECT id, username, name, char_sheet, rolls_count
      FROM "Usuarios"."users"
      WHERE id = ${decoded.id}
    `;

    if (!user) return { statusCode: 404, body: "Usuário não encontrado" };

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (err) {
    return { statusCode: 401, body: "Token inválido" };
  }
}