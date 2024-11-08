
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../config/supabaseClient';
import sql from '../../../config/db';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const lessorId = formData.get('lessorId');
  const oldImagePath = formData.get('oldImagePath');

  if (!file || !lessorId) {
    return new Response(JSON.stringify({ error: 'File and lessor ID are required' }), { status: 400 });
  }

  try {
    // Delete the old image if it exists
    if (oldImagePath) {
      const { error: deleteError } = await supabase
        .storage
        .from('lessor_image') // Update with the actual bucket name
        .remove([oldImagePath]);

      if (deleteError) {
        console.error('Error deleting old image:', deleteError);
        return new Response(JSON.stringify({ error: 'Error deleting old image' }), { status: 500 });
      }
    }

    // Upload the new file
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const { data, error: uploadError } = await supabase.storage
      .from('lessor_images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return new Response(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
    }

    // Get the public URL for the uploaded file
    const { publicURL, error: urlError } = supabase.storage
      .from('lessor-images')
      .getPublicUrl(fileName);

    if (urlError) {
      console.error('Error generating public URL:', urlError);
      return new Response(JSON.stringify({ error: 'Error generating file URL' }), { status: 500 });
    }

    // Update the database with the new image path
    const updateResult = await sql`
      UPDATE lessor
      SET lessor_image = ${fileName}
      WHERE lessor_id = ${lessorId}
    `;

    if (updateResult.count === 0) {
      throw new Error('Failed to update database with new image path');
    }

    return new Response(JSON.stringify({ publicUrl: publicURL }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error processing upload' }), { status: 500 });
  }
}
