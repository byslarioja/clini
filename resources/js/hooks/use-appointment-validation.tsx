export function useAppointmentValidation(selectedDate: Date | undefined, time: string) {
    const now = new Date();

    const getFormattedDate = () => {
        if (!selectedDate) return '';
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isTimeValid = () => {
        if (!selectedDate || !time) return true;

        const [hour, minute] = time.split(':').map(Number);
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(hour);
        selectedTime.setMinutes(minute);

        return selectedDate.toDateString() !== now.toDateString() || selectedTime > now;
    };

    return { getFormattedDate, isTimeValid };
}
