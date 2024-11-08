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
      SELECT lessor_firstname, lessor_lastname, lessor_phone_number, lessor_line_url, lessor_image
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
    const { lessorId, first_name, last_name, phone_number, line_url, profile_image } = await req.json();

    if (!lessorId || !first_name || !last_name || !phone_number || !line_url || !profile_image) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }
    
    
    const updateResult = await sql`
      UPDATE lessor
      SET
        lessor_firstname = ${first_name},
        lessor_lastname = ${last_name},
        lessor_phone_number = ${phone_number},
        total_slots = ${total_slots},
        line_url = ${line_url},
        lessor_image = ${profile_image}
      WHERE lessor_id = ${lessorId}
    `;

    return new Response(JSON.stringify({ message: 'Lessor updated successfully', lessorId: updateResult[0].lessor_id }), { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Error updating data' }), { status: 500 });
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
