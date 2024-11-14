// app/api/adFetchParking/route.js
import sql from '../../../config/db';  // Ensure your database configuration is correct

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const parkingLotId = searchParams.get('parkingLotId');

  try {
    let parkingLotResult;

    // If parkingLotId is provided, fetch a single parking lot; otherwise, fetch all parking lots
    if (parkingLotId) {
      parkingLotResult = await sql`
        SELECT parking_lot_id, lessor_id, location_name, address, location_url, total_slots, price_per_hour, location_image
        FROM parking_lot
        WHERE parking_lot_id = ${parkingLotId}
      `;
    } else {
      parkingLotResult = await sql`
        SELECT parking_lot_id, lessor_id, location_name, address, location_url, total_slots, price_per_hour, location_image
        FROM parking_lot
      `;
    }

    if (parkingLotResult.length === 0) {
      return new Response(JSON.stringify({ error: 'No parking lots found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ parkingLotDetails: parkingLotResult }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { parkingLotId, locationName, address, locationUrl, totalSlots, pricePerHour, locationImage } = await req.json();

    if (!parkingLotId) {
      return new Response(JSON.stringify({ error: 'Parking Lot ID is required' }), { status: 400 });
    }

    const updateData = {};
    if (locationName) updateData.location_name = locationName;
    if (address) updateData.address = address;
    if (locationUrl) updateData.location_url = locationUrl;
    if (totalSlots) updateData.total_slots = totalSlots;
    if (pricePerHour) updateData.price_per_hour = pricePerHour;
    if (locationImage) updateData.location_image = locationImage;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'At least one field must be updated' }), { status: 400 });
    }

    await sql`
      UPDATE parking_lot
      SET ${sql(updateData)}
      WHERE parking_lot_id = ${parkingLotId}
    `;

    return new Response(JSON.stringify({ message: 'Parking lot information updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Error updating data' }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const parkingLotId = searchParams.get('parkingLotId');

  if (!parkingLotId) {
    console.error('Delete Error: Parking Lot ID is required');
    return new Response(JSON.stringify({ error: 'Parking Lot ID is required' }), { status: 400 });
  }

  try {
    console.log(`Attempting to delete parking lot with ID: ${parkingLotId}`);

    const deleteResult = await sql`
      DELETE FROM parking_lot WHERE parking_lot_id = ${parkingLotId}
      RETURNING parking_lot_id
    `;

    if (deleteResult.length === 0) {
      console.error(`Delete Error: Parking lot with ID ${parkingLotId} not found`);
      return new Response(JSON.stringify({ error: 'Parking lot not found or could not be deleted' }), { status: 404 });
    }

    console.log(`Parking lot with ID ${parkingLotId} deleted successfully`);
    return new Response(JSON.stringify({ message: 'Parking lot deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(JSON.stringify({ error: 'Error deleting parking lot', details: error.message }), { status: 500 });
  }
}
