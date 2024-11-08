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
    return new Response(JSON.stringify({ error: 'Error fetching data', details: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { lessorId, first_name, last_name, phone_number, line_url, profile_image } = data;

    if (!lessorId) {
      return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
    }
  }
}
  
  
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get('lessorId');

  if (!lessorId) {
    return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
  }

  try {
    // Retrieve the lessor's image URL for deletion
    const imageResult = await sql`
      SELECT lessor_image FROM lessor WHERE lessor_id = ${lessorId}
    `;
    const imagePath = imageResult[0]?.lessor_image;

    // Delete the lessor record
    const deleteResult = await sql`
      DELETE FROM lessor WHERE lessor_id = ${lessorId}
      RETURNING lessor_id
    `;

    if (deleteResult.length === 0) {
      return new Response(JSON.stringify({ error: 'Lessor not found or could not be deleted' }), { status: 404 });
    }

    // If there is an image, delete it from Supabase storage
    if (imagePath) {
      const { error: deleteError } = await supabase.storage
        .from('lessor_image') // Replace with your actual storage bucket name
        .remove([imagePath]);

      if (deleteError) {
        console.error('Error deleting image from storage:', deleteError.message);
        return new Response(JSON.stringify({ error: 'Error deleting image from storage', details: deleteError.message }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ message: 'Lessor and associated image deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error deleting lessor data', details: error.message }), { status: 500 });
  }
}
