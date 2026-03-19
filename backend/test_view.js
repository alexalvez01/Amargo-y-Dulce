import { sql } from "./src/config/db.js";

async function testQuery() {
  try {
    const res = await sql`SELECT * FROM vw_envios_activos LIMIT 1`;
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
testQuery();
