// app/api/verifyPassword/route.js
import sql from '../../../config/db';

export async function POST(req) {
    try {
        const { user_id, currentPassword } = await req.json();

        if (!user_id || !currentPassword) {
            return new Response(
                JSON.stringify({ error: "User ID and current password are required" }),
                { status: 400 }
            );
        }

        // Query to get the stored password
        const passwordVerification = await sql`
            SELECT password FROM user_info WHERE user_id = ${user_id}
        `;

        if (passwordVerification.length === 0) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        const storedPassword = passwordVerification[0].password;
        if (storedPassword !== currentPassword) {
            return new Response(
                JSON.stringify({ error: "Current password is incorrect" }),
                { status: 401 }
            );
        }

        // Password matches
        return new Response(
            JSON.stringify({ message: "Password verified successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Password Verification Error:", error);
        return new Response(
            JSON.stringify({ error: "Error verifying password" }),
            { status: 500 }
        );
    }
}
