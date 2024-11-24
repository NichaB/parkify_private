import sql from '../../../config/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Update status to 'Complete' and increment available slots if necessary
    await sql`
      WITH updated_reservations AS (
        UPDATE reservation
        SET status = 'Complete'
        WHERE (duration_hour <= 0 AND duration_day <= 0) AND status != 'Complete'
        RETURNING parking_lot_id
      )
      UPDATE parking_lot
      SET available_slots = available_slots + 1
      WHERE parking_lot_id IN (SELECT parking_lot_id FROM updated_reservations)
    `;

    // Base query
    let query = sql`
      SELECT 
        r.reservation_id, 
        r.user_id, 
        r.start_time, 
        r.end_time, 
        r.total_price, 
        r.parking_lot_id, 
        r.duration_day, 
        r.duration_hour, 
        r.status, 
        COALESCE(c.car_model, 'No car available, please insert') AS car_model,
        p.location_name,
        p.address AS location_address
      FROM reservation r
      LEFT JOIN car c ON r.car_id = c.car_id
      LEFT JOIN parking_lot p ON r.parking_lot_id = p.parking_lot_id
      WHERE r.status != 'Complete'
    `;

    // Add userId condition if provided
    if (userId) {
      query = sql`
        ${query} AND r.user_id = ${userId}
      `;
    }

    const reservationResult = await sql`${query}`; // Execute the final query

    // Return an empty array if no reservations are found
    if (reservationResult.length === 0) {
      return new Response(JSON.stringify({ reservationDetails: [] }), { status: 200 });
    }

    return new Response(JSON.stringify({ reservationDetails: reservationResult }), { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error.message);
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

    // Use a transaction to safely delete the reservation and update available_slots
    await sql.begin(async (tx) => {
      // Step 1: Retrieve the parking_lot_id of the reservation being deleted
      const reservationData = await tx`
        SELECT parking_lot_id 
        FROM reservation
        WHERE reservation_id = ${reservationId}
      `;

      if (reservationData.length === 0) {
        throw new Error('Reservation not found.');
      }

      const parkingLotId = reservationData[0].parking_lot_id;

      // Step 2: Delete the reservation
      const deleteResult = await tx`
        DELETE FROM reservation
        WHERE reservation_id = ${reservationId}
        RETURNING reservation_id
      `;

      if (deleteResult.length === 0) {
        throw new Error('Reservation could not be deleted.');
      }

      // Step 3: Update available_slots in parking_lot
      await tx`
        UPDATE parking_lot
        SET available_slots = available_slots + 1
        WHERE parking_lot_id = ${parkingLotId}
      `;
    });

    return new Response(JSON.stringify({ message: 'Reservation deleted and available_slots updated successfully.' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return new Response(JSON.stringify({ error: 'Error deleting data', details: error.message }), { status: 500 });
  }
}
