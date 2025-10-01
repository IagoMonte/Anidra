import { neon } from "@netlify/neon";
import jwt from "jsonwebtoken";

export async function handler(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader) return { statusCode: 401, body: "Não autorizado" };

  const token = authHeader.replace("Bearer ", "");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sql = neon();

    // Verifica o método HTTP
    if (event.httpMethod === "GET") {
      // GET - Buscar rolls_count
      const [rolls] = await sql`
        SELECT rolls_count
        FROM "Usuarios"."users"
        WHERE id = ${decoded.id}
      `;

      if (!rolls) return { statusCode: 404, body: "Usuário não encontrado" };

      return {
        statusCode: 200,
        body: JSON.stringify(rolls),
      };
    } 
    
    else if (event.httpMethod === "POST") {
      // POST - Atualizar rolls_count
      const { newRollsCount } = JSON.parse(event.body);
   

      if (!newRollsCount) {
        return { statusCode: 400, body: "rolls_count é obrigatório" };
      }

      const [updated] = await sql`
        UPDATE "Usuarios".users
        SET rolls_count = ${JSON.stringify(newRollsCount)}::jsonb
        WHERE id = ${decoded.id}
        RETURNING rolls_count
      `;

      if (!updated) return { statusCode: 404, body: "Usuário não encontrado" };

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }
    
    else {
      return { statusCode: 405, body: "Método não permitido" };
    }
    
  } catch (err) {
    return { statusCode: 401, body: "Token inválido" };
  }
}
