import sql from "../../../config/db";

export async function POST(req) {
  try {
    const {
      parkingLotId,
      userId,
      reservationDate,
      startTime,
      endTime,
      pricePerHour,
      carId,
    } = await req.json();

    console.log("Received API request payload:", {
      parkingLotId,
      userId,
      reservationDate,
      startTime,
      endTime,
      pricePerHour,
      carId,
    });

    if (
      !parkingLotId ||
      !userId ||
      !reservationDate ||
      !startTime ||
      !endTime ||
      !pricePerHour ||
      !carId
    ) {
      console.error("Validation Error: Missing required fields.");
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    const startDateTime = new Date(
      `${reservationDate.split(" - ")[0]}T${startTime}:00+07:00`
    );
    const endDateTime = new Date(
      `${reservationDate.split(" - ")[1]}T${endTime}:00+07:00`
    );

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      console.error("Validation Error: Invalid date or time format.");
      return new Response(
        JSON.stringify({ error: "Invalid date or time format." }),
        { status: 400 }
      );
    }

    const totalHours = Math.abs((endDateTime - startDateTime) / (1000 * 60 * 60));
    const totalPrice = totalHours * pricePerHour;

    // Convert to integers for smallint fields, rounding up
    const totalHoursInt = Math.ceil(totalHours);
    const totalDaysInt = Math.ceil(totalHours / 24);

    console.log("Calculated Values:", {
      startDateTime,
      endDateTime,
      totalHoursInt,
      totalDaysInt,
      totalPrice,
    });

    const result = await sql`
      INSERT INTO reservation (
        parking_lot_id,
        user_id,
        reservation_date,
        start_time,
        end_time,
        total_price,
        duration_hour,
        duration_day,
        car_id
      )
      VALUES (
        ${parkingLotId},
        ${userId},
        ${reservationDate.split(" - ")[0]}, -- Use start date for reservation_date
        ${startDateTime.toISOString()},
        ${endDateTime.toISOString()},
        ${totalPrice},
        ${totalHoursInt},
        ${totalDaysInt},
        ${carId}
      )
      RETURNING reservation_id
    `;

    if (result.length === 0) {
      console.error("SQL Error: Reservation could not be created.");
      return new Response(
        JSON.stringify({ error: "Reservation could not be created." }),
        { status: 500 }
      );
    }

    console.log("Reservation successfully created with ID:", result[0].reservation_id);

    return new Response(
      JSON.stringify({
        message: "Reservation created successfully.",
        reservationId: result[0].reservation_id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error.",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
