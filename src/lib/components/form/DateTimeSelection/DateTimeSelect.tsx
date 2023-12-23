import { DatePicker, PickersActionBar, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import MuiStyleButton from '../../../styles/MuiButton.module.css';
import MuiStyleInput from '../../../styles/MuiInput.module.css';



export default function DateSelect({labelexp, labelexpTime}: {labelexp: string, labelexpTime: string}) {
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);


    return (
        // LocalizationProvider allows to change the locale of the DatePicker
        // AdapterDayjs allows to use dayjs instead of the default date-fns
        // DatePicker is the component itself from @mui/x-date-pickers
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={labelexp}
                    disablePast
                    maxDate={dayjs(maxDate)}
                    className={MuiStyleButton.MuiButtonBaseRoot}
                />
                <TimePicker
                    label={labelexpTime}
                    className="mt-4 ml-2 md:ml-2 md:mt-0"
                    ampm={false}
                    ampmInClock={true}
                />
            </LocalizationProvider>
    );
}