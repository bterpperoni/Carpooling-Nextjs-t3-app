import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';
import DateTimeSelect from '../../lib/components/form/DateTimeSelection/DateTimeSelect';
import { Button } from '@mui/material';
import MuiStyle from '../../lib/styles/MuiNewTrip.module.css';
import { log } from 'console';

export default function NewTravel() {

    // Get date
    const maxDate = new Date();

    // Set the date to just allow the user to select a date in the next 7 days in DatePicker component
    maxDate.setDate(maxDate.getDate() + 7);


    // Address of departure and destination from google autocomplete
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    let departure: string| undefined;
    let destination: string| undefined;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };

    function handleClick(): void {
       console.log(departure, destination);
    }

    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]  h-screen">
                    <h1 className="text-6xl text-white mt-6">New Travel</h1>
                    <form className="flex flex-col w-auto m-auto justify-center items-center">
                        {/* Departure */}
                        <div className='my-16'>
                            <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                <label htmlFor="departure" className='text-xl md:text-3xl text-white mb-1'>Departure : </label>
                                <Autocomplete
                                    apiKey={apiKey}
                                    options={options}
                                    onPlaceSelected={(place) => {
                                            address.departure = place;
                                            departure = address.departure.formatted_address;
                                        }
                                    }
                                    className="w-auto my-2"
                                    id="departure"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect labelexpTime='Time Departure' labelexp="Date Departure" />
                            </div>
                        </div>
                    
                        {/* Destination */}
                        <div>
                            <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                <label htmlFor="destination" className='text-xl md:text-3xl text-white mb-1'>Destination : </label>
                                <Autocomplete
                                    apiKey={apiKey}
                                    options={options}
                                    onPlaceSelected={(place) => {
                                            address.destination = place;
                                            destination = address.destination.formatted_address;
                                        }
                                    }
                                    className="max-w-[90vw] my-2"
                                    id="destination"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect labelexpTime="Time Return " labelexp="Date Return" />
                            </div>
                        </div>
                        {/* Submit */}
                        <Button className={MuiStyle.MuiButtonText} onClick={handleClick}> Submit </Button>
                    </form>
                </div>
            </LayoutMain>
        </>
       );
}