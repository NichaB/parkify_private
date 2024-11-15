// app/api/fetchParking/route.js
import sql from '../../../config/db';

// GET Parking Lot Details
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const locationName = searchParams.get('locationName');
  console.log("Requested Location Name:", locationName); // Debugging output

  if (!locationName) {
    return new Response(JSON.stringify({ error: 'Location name is required' }), { status: 400 });
  }

  try {
    const parkingResult = await sql`
      SELECT parking_lot_id, location_name, price_per_hour, address
      FROM parking_lot
      WHERE LOWER(location_name) LIKE LOWER('%${locationName}%')
    `;
    console.log("Database query result:", parkingResult); // Debugging output

    if (parkingResult.length === 0) {
      return new Response(JSON.stringify({ error: 'No parking lots found for the given location' }), { status: 404 });
    }

    return new Response(JSON.stringify({ parkingLots: parkingResult }), { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return new Response(JSON.stringify({ error: 'Error fetching parking data' }), { status: 500 });
  }
}

// PUT and DELETE functions (if needed) would be similar to your original API structure,
// but specifically for managing parking lot records.
