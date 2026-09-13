import { calculateAge } from "../../shared/age";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const dob = new URL(request.url).searchParams.get("dob");
  if (!dob) return json({ error: "Invalid date of birth" }, 400);
  const result = calculateAge(dob);
  if (!result) return json({ error: "Invalid date of birth" }, 400);
  return json(result);
}
