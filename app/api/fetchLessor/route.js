// app/api/fetchLessor/route.js
import sql from '../../../config/db';
import supabase from '../../../config/supabaseClient';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get('lessorId');

  if (!lessorId) {
    return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
  }

  try {
    const lessorResult = await sql`
      SELECT lessor_id, lessor_firstname, lessor_lastname, lessor_phone_number, lessor_line_url, lessor_image
      FROM lessor
      WHERE lessor_id = ${lessorId}
    `;
    const lessorDetails = lessorResult[0];

    if (!lessorDetails) {
      return new Response(JSON.stringify({ error: 'Lessor not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ lessorDetails }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const {
      lessor_id,
      lessor_firstname,
      lessor_lastname,
      lessor_phone_number,
      lessor_line_url,
      lessor_image,
    } = await req.json();

    if (!lessor_id) {
      return new Response(
        JSON.stringify({ error: "Lessor ID is required" }),
        { status: 400 }
      );
    }

    const updateData = {};
    if (lessor_firstname) updateData.lessor_firstname = lessor_firstname;
    if (lessor_lastname) updateData.lessor_lastname = lessor_lastname;
    if (lessor_phone_number) updateData.lessor_phone_number = lessor_phone_number;
    if (lessor_line_url) updateData.lessor_line_url = lessor_line_url;
    if (lessor_image) updateData.lessor_image = lessor_image;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one field must be updated" }),
        { status: 400 }
      );
    }

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
    console.error("Update Error:", error);
    return new Response(
      JSON.stringify({ error: "Error updating data" }),
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get('lessorId');

  if (!lessorId) {
    return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
  }

  try {
    const imageResult = await sql`
      SELECT lessor_image FROM lessor WHERE lessor_id = ${lessorId}
    `;
    const imagePath = imageResult[0]?.lessor_image;

     // If imagePath exists, attempt to delete from Supabase storage
     if (imagePath) {
      console.log('Attempting to delete image from storage:', imagePath);
      const { error: deleteError } = await supabase
        .storage
        .from('lessor_image') // Ensure this matches your actual storage bucket name
        .remove([imagePath]);

      if (deleteError) {
        console.error('Error deleting image from storage:', deleteError.message);
        return new Response(
          JSON.stringify({
            error: 'Error deleting image from storage',
            details: deleteError.message,
          }),
          { status: 500 }
        );
      }
    } else {
      console.log('No image path to delete from storage');
    }

    const deleteResult = await sql`
      DELETE FROM lessor WHERE lessor_id = ${lessorId}
      RETURNING lessor_id
    `;

    if (deleteResult.length === 0) {
      return new Response(JSON.stringify({ error: 'Lessor not found or could not be deleted' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Parking lot and associated image deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Error deleting parking lot and image',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
