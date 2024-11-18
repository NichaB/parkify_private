// app/api/lessorVerifyPassword/route.js
import sql from '../../../config/db';

export async function POST(req) {
    try {
        const { lessor_id, currentPassword } = await req.json();

        if (!lessor_id || !currentPassword) {
            return new Response(
                JSON.stringify({ error: "Lessor ID and current password are required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Query to get the stored password for the lessor
        const passwordVerification = await sql`
            SELECT lessor_password FROM lessor WHERE lessor_id = ${lessor_id}
        `;

        if (passwordVerification.length === 0) {
            return new Response(
                JSON.stringify({ error: "Lessor not found" }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const storedPassword = passwordVerification[0].lessor_password;

        // Compare the stored password with the current password
        if (storedPassword !== currentPassword) {
            return new Response(
                JSON.stringify({ error: "Current password is incorrect" }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Password verified successfully
        return new Response(
            JSON.stringify({ message: "Password verified successfully" }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Password Verification Error:", error);
        return new Response(
            JSON.stringify({ error: "Error verifying password" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
