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
          p.address AS location_address
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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get('reservationId');

    if (!reservationId) {
      return new Response(JSON.stringify({ error: 'Reservation ID is required.' }), { status: 400 });
    }

    const deleteResult = await sql`
      DELETE FROM reservation
      WHERE reservation_id = ${reservationId}
      RETURNING reservation_id
    `;

    if (deleteResult.length === 0) {
      return new Response(JSON.stringify({ error: 'Reservation not found or could not be deleted.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Reservation deleted successfully.' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return new Response(JSON.stringify({ error: 'Error deleting data', details: error.message }), { status: 500 });
  }
}
