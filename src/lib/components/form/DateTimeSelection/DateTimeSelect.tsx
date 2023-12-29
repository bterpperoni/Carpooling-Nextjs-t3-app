import { DatePicker, PickersActionBar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';



export default function DateSelect({labelexp, labelexpTime, handleChangeDate, handleChangeTime}: {
    labelexp: string, 
    labelexpTime: string, 
    handleChangeDate: (date: Dayjs | null) => void
    handleChangeTime: (time: Dayjs | null) => void;
}) {
    
    // Get actual date & Set the date to just allow the user to select a date in the next 7 days in DatePicker component
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    const [date, setDate] = useState<Dayjs | null>();
    const [time, setTime] = useState<Dayjs | null>();

    return (
        // LocalizationProvider allows to change the locale of the DatePicker
        // AdapterDayjs allows to use dayjs instead of the default date-fns
        // DatePicker is the component itself from @mui/x-date-pickers
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={labelexp}
                    disablePast
                    maxDate={dayjs(maxDate)}
                    value={date}
                    onChange={(date) => {
                        handleChangeDate(date)
                    }}
                />
                <TimePicker
                    label={labelexpTime}
                    className="mt-4 ml-0 md:ml-2 md:mt-0"
                    ampm={false}
                    ampmInClock={true}
                    value={time}
                    onChange={(time) => {
                        handleChangeTime(time)
                    }}
                />
            </LocalizationProvider>
    );
}