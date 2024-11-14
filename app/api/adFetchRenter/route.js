// app/api/adFetchRenter/route.js
import sql from '../../../config/db';  // Ensure your database configuration is correct

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    let renterResult;

    // If userId is provided, fetch a single renter; otherwise, fetch all renters
    if (userId) {
      renterResult = await sql`
        SELECT user_id, first_name, last_name, phone_number, email
        FROM user_info
        WHERE user_id = ${userId}
      `;
    } else {
      renterResult = await sql`
        SELECT user_id, first_name, last_name, phone_number, email
        FROM user_info
      `;
    }

    if (renterResult.length === 0) {
      return new Response(JSON.stringify({ error: 'No renters found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ renterDetails: renterResult }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { userId, firstName, lastName, phoneNumber } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phoneNumber) updateData.phone_number = phoneNumber;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'At least one field must be updated' }), { status: 400 });
    }

    await sql`
      UPDATE user_info
      SET ${sql(updateData)}
      WHERE user_id = ${userId}
    `;

    return new Response(JSON.stringify({ message: 'User information updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Error updating data' }), { status: 500 });
  }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
  
    if (!userId) {
      console.error('Delete Error: User ID is required');
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
  
    try {
      console.log(`Attempting to delete user with ID: ${userId}`);
  
      const deleteResult = await sql`
        DELETE FROM user_info WHERE user_id = ${userId}
        RETURNING user_id
      `;
  
      if (deleteResult.length === 0) {
        console.error(`Delete Error: User with ID ${userId} not found`);
        return new Response(JSON.stringify({ error: 'User not found or could not be deleted' }), { status: 404 });
      }
  
      console.log(`User with ID ${userId} deleted successfully`);
      return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Delete Error:', error);
      return new Response(JSON.stringify({ error: 'Error deleting user', details: error.message }), { status: 500 });
    }
  }
  