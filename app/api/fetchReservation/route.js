import sql from '../../../config/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    console.log('Received userId:', userId);

    const query = userId
      ? sql`
        SELECT 
          r.reservation_id, 
          r.user_id, 
          r.start_time, 
          r.end_time, 
          r.total_price, 
          r.parking_lot_id, 
          c.car_model,
          p.location_name,
          p.address AS location_address
        FROM reservation r
        LEFT JOIN car c ON r.car_id = c.car_id
        LEFT JOIN parking_lot p ON r.parking_lot_id = p.parking_lot_id
        WHERE r.user_id = ${userId}
      `
      : sql`
        SELECT 
          r.reservation_id, 
          r.user_id, 
          r.start_time, 
          r.end_time, 
          r.total_price, 
          r.parking_lot_id, 
          c.car_model,
          p.location_name,
          p.location_address
        FROM reservation r
        LEFT JOIN car c ON r.car_id = c.car_id
        LEFT JOIN parking_lot p ON r.parking_lot_id = p.parking_lot_id
      `;

    const reservationResult = await query;

    if (reservationResult.length === 0) {
      return new Response(JSON.stringify({ error: 'No reservations found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ reservationDetails: reservationResult }), { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data', details: error.message }), { status: 500 });
  }
}
