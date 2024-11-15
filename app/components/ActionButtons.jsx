import React, { useState, useEffect } from 'react';
import PaymentSuccess from './PaymentSuccess';
import supabase from '../../config/supabaseClient';

const ActionButtons = ({ reservationDate, startTime, endTime }) => {
    const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
    const [isPaymentSuccessVisible, setIsPaymentSuccessVisible] = useState(false);
    const [location, setLocation] = useState(null);
    const [contact, setContact] = useState(null);
    const [pricePerHour, setPricePerHour] = useState(0); // Define pricePerHour state
    const [totalPrice, setTotalPrice] = useState(0); // Define totalPrice state
    const parkingLotId = 1;
    const carId = 4;
    const userId = 33;

    // Helper function to format date from dd/mm/yyyy to yyyy-mm-dd
    const formatReservationDate = (date) => {
        if (!date || date.indexOf('/') === -1) return null;
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };

    const [startDate, endDate] = reservationDate
        ? reservationDate.split(" - ").map(date => formatReservationDate(date.trim()))
        : [null, null];

    useEffect(() => {
        const fetchData = async () => {
            // Fetch contact info
            const { data: userData, error: userError } = await supabase
                .from('user_info')
                .select('phone_number')
                .eq('user_id', userId)
                .single();

            if (userError) {
                console.error('Error fetching data:', userError);
            } else {
                setContact(userData.phone_number);
            }

            // Fetch location and pricePerHour
            const { data: locationData, error: locationError } = await supabase
                .from('parking_lot')
                .select('location_name, price_per_hour') // Fetch price per hour here
                .eq('parking_lot_id', parkingLotId)
                .single();

            if (locationError) {
                console.error('Error fetching location data:', locationError);
            } else {
                setLocation(locationData.location_name);
                setPricePerHour(locationData.price_per_hour); // Set pricePerHour state
            }
        };

        fetchData();
    }, []);

    const allInputsFilled = reservationDate && startTime && endTime;

    const handlePaymentClick = () => {
        if (allInputsFilled) {
            sessionStorage.setItem('reservationDate', reservationDate);
            sessionStorage.setItem('startTime', startTime);
            sessionStorage.setItem('endTime', endTime);
            setIsConfirmPopupVisible(true);
        }
    };

    const closePopup = () => {
        setIsConfirmPopupVisible(false);
    };

    const handleConfirmClick = async () => {
        setIsConfirmPopupVisible(false);

        const currentDate = new Date();
        const offsetDate = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);

        const formattedReservationDate = `${offsetDate.getFullYear()}-${String(offsetDate.getMonth() + 1).padStart(2, '0')}-${String(offsetDate.getDate()).padStart(2, '0')} ${String(offsetDate.getHours()).padStart(2, '0')}:${String(offsetDate.getMinutes()).padStart(2, '0')}:${String(offsetDate.getSeconds()).padStart(2, '0')} +07`;

        if (!startDate || !endDate || !startTime || !endTime) {
            console.error("Invalid date or time values:", { startDate, endDate, startTime, endTime });
            return;
        }

        const start = new Date(`${startDate}T${startTime}:00+07:00`);
        const end = new Date(`${endDate}T${endTime}:00+07:00`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error("Error creating date objects:", { start, end });
            return;
        }

        const totalHours = Math.abs((end - start) / (1000 * 60 * 60));
        const calculatedTotalPrice = totalHours * pricePerHour;
        setTotalPrice(calculatedTotalPrice); // Update totalPrice state

        const startTimestamp = start.toISOString();
        const endTimestamp = end.toISOString();

        const { data, error } = await supabase
            .from('reservation')
            .insert([
                {
                    parking_lot_id: parkingLotId,
                    user_id: userId,
                    reservation_date: formattedReservationDate,
                    start_time: startTimestamp,
                    end_time: endTimestamp,
                    total_price: calculatedTotalPrice,
                    duration_hour: totalHours,
                    duration_day: Math.floor(totalHours / 24),
                    car_id: carId,
                },
            ]);

        if (error) {
            console.error("Error inserting reservation:", error.message);
        } else {
            console.log("Reservation successfully added:", data);
            setIsPaymentSuccessVisible(true);
        }
    };

    return (
        <div className="flex justify-around mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
                <img src="google-maps.png" alt="Google Maps" className="bg-white rounded-full p-1 w-5 h-5 mr-2" />
                Directions
            </button>
            <button
                onClick={handlePaymentClick}
                disabled={!allInputsFilled}
                className={`py-2 px-4 rounded-lg ${allInputsFilled ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'} text-white`}
            >
                Payment
            </button>

            {isConfirmPopupVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-black">Confirm Reservation</h2>
                        <p><span className="font-semibold text-black">Location:</span> <span className='text-black'>{location || 'Loading...'}</span></p>
                        <p><span className="font-semibold text-black">Date:</span> <span className='text-black'>{reservationDate}</span></p>
                        <p><span className="font-semibold text-black">Time:</span> <span className='text-black'>{startTime} - {endTime}</span></p>
                        <p><span className="font-semibold text-black">Contact:</span> <span className='text-black'>{"+66 " + contact || 'Loading...'}</span></p>
                        <p className="text-gray-500 text-sm mt-2">Please note that this information will be shared with the parking lot owner.</p>

                        <div className="flex justify-between mt-4">
                            <button onClick={closePopup} className="bg-red-500 text-white py-2 px-4 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleConfirmClick} className="bg-green-500 text-white py-2 px-4 rounded-lg">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPaymentSuccessVisible && (
                <PaymentSuccess
                    onClose={() => setIsPaymentSuccessVisible(false)}
                    reservationDate={reservationDate}
                    startTime={startTime}
                    endTime={endTime}
                    pricePerHour={pricePerHour}
                    totalPrice={totalPrice} // Pass totalPrice to PaymentSuccess
                />
            )}
        </div>
    );
};

export default ActionButtons;
