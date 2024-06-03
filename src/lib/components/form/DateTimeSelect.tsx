import { DatePicker} from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {  useState } from 'react';
import MuiStyle from '$/styles/MuiStyle.module.css';


export default function DateSelect({labelexp, labelexpTime, disableDate, disableTime, handleChangeDate, handleChangeTime, defaultDate, defaultTime, justTime}: {
    labelexp: string, 
    labelexpTime: string,
    disableDate: boolean,
    disableTime: boolean,
    handleChangeDate: (date: Dayjs | null) => void,
    handleChangeTime: (time: Dayjs | null) => void,
    defaultDate?: Dayjs | null,
    defaultTime?: Dayjs | null,
    justTime: boolean
}) {
    
    // Get actual date & Set the date to just allow the user to select a date in the next 7 days in DatePicker component
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    const [date] = useState<Dayjs | null>();
    const [time] = useState<Dayjs | null>();


    return (
        // LocalizationProvider allows to change the locale of the DatePicker
        // AdapterDayjs allows to use dayjs instead of the default date-fns
        // DatePicker is the component itself from @mui/x-date-pickers
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {!justTime &&
                    <DatePicker
                    defaultValue={defaultDate}
                    label={labelexp}
                    disablePast
                    disabled={disableDate}
                    maxDate={dayjs(maxDate)}
                    value={date}
                    onChange={(date) => {
                        handleChangeDate(date)
                    }}
                    className={`${MuiStyle.MuiInputBaseRoot} ${MuiStyle.MuiInputBaseInput} ${MuiStyle.MuiFormLabelRoot}`}/>
                }
                <TimePicker
                    defaultValue={defaultTime}
                    label={labelexpTime}
                    className={`mt-4 ml-0 md:ml-2 md:mt-0 ${MuiStyle.MuiInputBaseRoot} ${MuiStyle.MuiInputBaseInput} ${MuiStyle.MuiFormLabelRoot}`}
                    disabled={disableTime}
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