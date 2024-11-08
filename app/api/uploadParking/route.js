// api/uploadFile.js
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../config/supabaseClient';
import sql from '../../../config/db'; // Import SQL client

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const storageBucket = formData.get('storageBucket');
  const parkingLotId = formData.get('parkingLotId'); // ID to link the file to a specific parking lot
  const oldImagePath = formData.get('oldImagePath'); // Path of the old image to be deleted

  if (!file || !storageBucket || !parkingLotId) {
    return new Response(JSON.stringify({ error: 'File, storage bucket, and parking lot ID are required' }), { status: 400 });
  }

  try {
    // Delete old image if oldImagePath is provided
    if (oldImagePath) {
      const { error: deleteError } = await supabase
        .storage
        .from(storageBucket)
        .remove([oldImagePath]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError);
        return new Response(JSON.stringify({ error: 'Error deleting old image' }), { status: 500 });
      }
    }

    // Upload the new file
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const { data, error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return new Response(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
    }

    // Generate public URL for the new file
    const { publicURL } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(fileName);

    if (!publicURL) {
      throw new Error('Failed to generate public URL');
    }

    // Update file information in the database with an SQL query
    const updateResult = await sql`
      UPDATE parking_lot
      SET location_image = ${publicURL}
      WHERE parking_lot_id = ${parkingLotId}
      RETURNING parking_lot_id
    `;

    if (updateResult.length === 0) {
      throw new Error('Failed to update file metadata in the database');
    }

    return new Response(JSON.stringify({ publicUrl: publicURL, parkingLotId: updateResult[0].parking_lot_id }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error uploading file or saving metadata' }), { status: 500 });
  }
}
