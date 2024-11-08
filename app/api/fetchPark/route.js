// app/api/fetchParkingLot/route.js
import sql from '../../../config/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lessorId = searchParams.get('lessorId');

  if (!lessorId) {
    return new Response(JSON.stringify({ error: 'Lessor ID is required' }), { status: 400 });
  }

  try {
    const lessorResult = await sql`
      SELECT lessor_firstname, lessor_image
      FROM lessor
      WHERE lessor_id = ${lessorId}
    `;
    const lessorData = lessorResult[0];

    if (!lessorData) {
      return new Response(JSON.stringify({ error: 'Lessor not found' }), { status: 404 });
    }

    const parkingLotsResult = await sql`
      SELECT parking_lot_id, location_name, address, location_url, total_slots, price_per_hour, location_image
      FROM parking_lot
      WHERE lessor_id = ${lessorId}
    `;
    
    return new Response(
      JSON.stringify({
        lessorDetails: lessorData,
        parkingLots: parkingLotsResult,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { parkingLotId, location_name, address, location_url, total_slots, price_per_hour, location_image } = await req.json();

    if (!parkingLotId || !location_name || !address || !location_url || !total_slots || !price_per_hour) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const updateResult = await sql`
      UPDATE parking_lot
      SET
        location_name = ${location_name},
        address = ${address},
        location_url = ${location_url},
        total_slots = ${total_slots},
        price_per_hour = ${price_per_hour},
        location_image = ${location_image}
      WHERE parking_lot_id = ${parkingLotId}
    `;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Error updating data' }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const parkingLotId = searchParams.get('parkingLotId');

  if (!parkingLotId) {
    return new Response(JSON.stringify({ error: 'Parking lot ID is required' }), { status: 400 });
  }

  try {
    await sql`
      DELETE FROM parking_lot
      WHERE parking_lot_id = ${parkingLotId}
    `;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(JSON.stringify({ error: 'Error deleting parking lot' }), { status: 500 });
  }
}
