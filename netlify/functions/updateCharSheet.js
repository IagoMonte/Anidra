import { neon } from "@netlify/neon";
import jwt from "jsonwebtoken"; // para decodificar/verificar o token

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function handler(event) {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const token = event.headers.authorization?.split(" ")[1];
    if (!token) {
      return { statusCode: 401, body: "Token ausente" };
    }

    // 🔑 valida token (usa a mesma SECRET usada no login)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return { statusCode: 401, body: "Token inválido" };
    }

    const { char_sheet } = JSON.parse(event.body);

    if (!char_sheet) {
      return { statusCode: 400, body: "char_sheet ausente" };
    }

    // ✅ atualiza no banco
    await sql`
      UPDATE users
      SET char_sheet = ${JSON.stringify(char_sheet)}::jsonb
      WHERE id = ${decoded.id};
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Ficha atualizada com sucesso" })
    };
  } catch (err) {
    console.error("Erro no update:", err.message, err.stack);
    return { statusCode: 500, body: "Erro interno: " + err.message };
  }
}