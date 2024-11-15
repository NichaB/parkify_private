import React, { useState } from 'react';
import ReservationComponent from './Booking_Calculate';
import ConfirmationModal from './ConfirmationModal';

function ParentComponent() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [reservationDetails, setReservationDetails] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        total: '0 Hours'
    });

    const handleReservationSubmit = (startDate, endDate, startTime, endTime, total) => {
        setReservationDetails({ startDate, endDate, startTime, endTime, total });
        setShowConfirmation(true);
    };

    return (
        <div>
            <ReservationComponent onSubmit={handleReservationSubmit} />
            {showConfirmation && (
                <ConfirmationModal
                    location="Location Example"
                    date={`${reservationDetails.startDate} - ${reservationDetails.endDate}`}
                    time={`${reservationDetails.startTime} - ${reservationDetails.endTime}`}
                    total={reservationDetails.total}
                    contact="123-456-7890"
                    onClose={() => setShowConfirmation(false)}
                    userId={1}
                    parkingLotId={2}
                    carId={3}
                />
            )}
        </div>
    );
}

export default ParentComponent;
