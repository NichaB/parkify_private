// api/uploadFile.js
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../config/supabaseClient';
import sql from '../../../config/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const storageBucket = formData.get('storageBucket');
    const parkingLotId = formData.get('parkingLotId');

    if (!file || !storageBucket || !parkingLotId) {
      return new Response(JSON.stringify({ error: 'File, storage bucket, and parking lot ID are required' }), {
        status: 400
      });
    }

    // Upload file to Supabase storage
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const { data, error: uploadError } = await supabase.storage.from(storageBucket).upload(fileName, file);
    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return new Response(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
    }

    // Generate public URL
    const { publicUrl } = supabase.storage.from(storageBucket).getPublicUrl(fileName).data;

    if (!publicUrl) {
      console.error('Failed to retrieve public URL');
      return new Response(JSON.stringify({ error: 'Failed to generate public URL' }), { status: 500 });
    }

    // Update database with image URL
    await sql`
      UPDATE parking_lot
      SET location_image = ${publicUrl}
      WHERE parking_lot_id = ${parkingLotId}
    `;

    return new Response(JSON.stringify({ publicUrl, parkingLotId }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error uploading file or saving metadata' }), { status: 500 });
  }
}


// // api/uploadFile.js
// import { v4 as uuidv4 } from 'uuid';
// import supabase from '../../../config/supabaseClient';
// import sql from '../../../config/db';

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file');
//     const storageBucket = formData.get('storageBucket');
//     const oldImagePath = formData.get('oldImagePath');
//     const parkingLotId = formData.get('parkingLotId');

//     // Basic validation: Check if required fields are provided
//     if (!storageBucket || !parkingLotId) {
//       return new Response(JSON.stringify({ error: 'Storage bucket and parking lot ID are required' }), {
//         status: 400
//       });
//     }

//     // Check if parkingLotId exists in the database
//     const parkingLotExists = await sql`
//       SELECT parking_lot_id FROM parking_lot WHERE parking_lot_id = ${parkingLotId}
//     `;
//     if (parkingLotExists.length === 0) {
//       return new Response(JSON.stringify({ error: 'Parking lot ID does not exist' }), { status: 400 });
//     }

//     // Step 1: Delete the old image if `oldImagePath` is provided
//     if (oldImagePath) {
//       const { error: deleteError } = await supabase.storage.from(storageBucket).remove([oldImagePath]);
//       if (deleteError) {
//         console.error('Error deleting old image:', deleteError);
//         return new Response(JSON.stringify({ error: 'Error deleting old image' }), { status: 500 });
//       }
//     }

//     // Step 2: Upload the new file if provided
//     let publicUrl = oldImagePath; // Default to the old image if no new file is uploaded
//     if (file) {
//       const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
//       const { data, error: uploadError } = await supabase.storage.from(storageBucket).upload(fileName, file);

//       if (uploadError) {
//         console.error('Upload Error:', uploadError);
//         return new Response(JSON.stringify({ error: 'Error uploading file' }), { status: 500 });
//       }

//       // Step 3: Generate public URL for the uploaded file
//       const { data: urlData, error: urlError } = supabase.storage.from(storageBucket).getPublicUrl(fileName);
//       if (urlError) {
//         console.error('Error generating public URL:', urlError);
//         return new Response(JSON.stringify({ error: 'Failed to generate public URL' }), { status: 500 });
//       }

//       publicUrl = urlData.publicUrl;
//     }

//     // Step 4: Update the database with the new image URL (or the old image URL if no file was provided)
//     const updateResult = await sql`
//       UPDATE parking_lot
//       SET location_image = ${publicUrl}
//       WHERE parking_lot_id = ${parkingLotId}
//       RETURNING parking_lot_id
//     `;

//     if (updateResult.length === 0) {
//       throw new Error('Failed to update file metadata in the database');
//     }

//     return new Response(JSON.stringify({ publicUrl, parkingLotId: updateResult[0].parking_lot_id }), {
//       status: 200
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: 'Error uploading file or saving metadata' }), {
//       status: 500
//     });
//   }
// }
