import sql from "../../../config/db";

export async function GET(req) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const parkingLotId = searchParams.get("id"); // Get 'id' from query parameters
    console.log("Requested Parking Lot ID:", parkingLotId); // Debugging output

    // Validate the required parameter
    if (!parkingLotId) {
      return new Response(
        JSON.stringify({ error: "Parking lot ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch parking details and lessor details using a JOIN query
    const parkingDetails = await sql`
            SELECT 
                pl.location_name, 
                pl.price_per_hour, 
                pl.address,
                l.lessor_firstname AS lessor_name, 
                l.lessor_email, 
                l.lessor_phone_number AS lessor_phone,
                l.lessor_profile_pic
            FROM parking_lot AS pl
            JOIN lessor AS l
            ON pl.lessor_id = l.lessor_id
            WHERE pl.parking_lot_id = ${parkingLotId}
        `;

    console.log("Query Result:", parkingDetails); // Debugging output

    // Check if parking details are found
    if (parkingDetails.length === 0) {
      return new Response(JSON.stringify({ error: "Parking lot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        parkingCode: parkingDetails[0].location_name,
        price: `${parkingDetails[0].price_per_hour} THB / HOURS`,
        address: parkingDetails[0].address,
        lessorDetails: {
          name: parkingDetails[0].lessor_name,
          email: parkingDetails[0].lessor_email,
          phone: parkingDetails[0].lessor_phone,
          profilePic: parkingDetails[0].lessor_profile_pic,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching parking and lessor details:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
