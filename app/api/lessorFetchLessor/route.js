import sql from '../../../config/db';
import supabase from '../../../config/supabaseClient';

// GET: Fetch Lessor Details
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get('lessorId');

  if (!lessorId) {
    return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
  }

  try {
    const lessorResult = await sql`
      SELECT lessor_id, lessor_firstname, lessor_lastname, lessor_email, lessor_password, lessor_phone_number, lessor_line_url, lessor_profile_pic
      FROM lessor
      WHERE lessor_id = ${lessorId}
    `;
    const lessorDetails = lessorResult[0];

    if (!lessorDetails) {
      return new Response(JSON.stringify({ error: 'Lessor not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ lessorDetails }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error.message);
    return new Response(JSON.stringify({ error: 'Error fetching data', details: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const {
      lessor_id,
      lessor_firstname,
      lessor_lastname,
      lessor_email,
      lessor_password,
      lessor_phone_number,
      lessor_line_url,
      lessor_profile_pic,
    } = await req.json();

    if (!lessor_id || !lessor_email) {
      return new Response(
        JSON.stringify({ error: "Lessor ID and email are required" }),
        { status: 400 }
      );
    }

    const updateData = {};
    if (lessor_firstname) updateData.lessor_firstname = lessor_firstname;
    if (lessor_lastname) updateData.lessor_lastname = lessor_lastname;
    if (lessor_password) updateData.lessor_password = lessor_password;
    if (lessor_phone_number) updateData.lessor_phone_number = lessor_phone_number;
    if (lessor_line_url) updateData.lessor_line_url = lessor_line_url;
    if (lessor_profile_pic) updateData.lessor_profile_pic = lessor_profile_pic;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one field must be updated" }),
        { status: 400 }
      );
    }

    // Perform the update
    await sql`
      UPDATE lessor
      SET ${sql(updateData)}
      WHERE lessor_id = ${lessor_id}
    `;

    return new Response(
      JSON.stringify({ message: "Lessor updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Error updating data", details: error.message }),
      { status: 500 }
    );
  }
}



// DELETE: Delete Lessor and Associated Image
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get("lessorId");

  const currentUser = req.headers.get("Current-User"); // Retrieve current user from headers
  if (!lessorId || !currentUser) {
    return new Response(
      JSON.stringify({ error: "Lessor ID and Current User are required" }),
      { status: 400 }
    );
  }

  try {
    const imageResult = await sql`
      SELECT lessor_profile_pic FROM lessor WHERE lessor_id = ${lessorId}
    `;
    const imagePath = imageResult[0]?.lessor_profile_pic;

    if (imagePath) {
      const { error: deleteError } = await supabase
        .storage
        .from("lessor_image") // Ensure this matches your actual storage bucket name
        .remove([imagePath]);

      if (deleteError) {
        console.error("Error deleting image from storage:", deleteError.message);
        return new Response(
          JSON.stringify({
            error: "Error deleting image from storage",
            details: deleteError.message,
          }),
          { status: 500 }
        );
      }
    }

    const deleteResult = await sql`
      DELETE FROM lessor WHERE lessor_id = ${lessorId}
      RETURNING lessor_id
    `;

    if (deleteResult.length === 0) {
      return new Response(
        JSON.stringify({ error: "Lessor not found or could not be deleted" }),
        { status: 404 }
      );
    }

    // Log the deletion action
    await sql`
      INSERT INTO lessor_log (lessor_id, action_type, changed_fields, performed_by)
      VALUES (
        ${lessorId},
        'DELETE',
        NULL, -- No fields to log for DELETE
        ${currentUser}
      )
    `;

    return new Response(
      JSON.stringify({ message: "Lessor and associated image deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error.message);
    return new Response(
      JSON.stringify({
        error: "Error deleting lessor and image",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
