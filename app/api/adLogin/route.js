// app/api/adminLogin/route.js
import sql from '../../../config/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
    }

    // Fetch the admin user by email
    const adminResult = await sql`
      SELECT admin_id, email, password
      FROM admin
      WHERE email = ${email}
      LIMIT 1
    `;

    // If no admin found with the email, return a generic error
    if (adminResult.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401 });
    }

    const admin = adminResult[0];

    // Directly compare the provided password with the password in the database
    if (password !== admin.password) {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401 });
    }

    // If login is successful, return the admin_id
    return new Response(JSON.stringify({ admin_id: admin.admin_id }), { status: 200 });

  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "An error occurred during login." }), { status: 500 });
  }
}
