import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';
import DateTimeSelect from '../../lib/components/form/DateTimeSelection/DateTimeSelect';
import { Button } from '@mui/material';
import MuiStyle from '../../lib/styles/MuiStyle.module.css';
import { useState } from 'react';
import { env } from 'next.config';
import { Dayjs } from 'dayjs';

export default function NewTravel() {

    // Address of departure and destination from google autocomplete
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    let [departure, setDeparture] = useState<string>();
    let [destination, setDestination] = useState<string>();

    // Date of departure and destination
    let [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    let [dateReturn, setDateReturn] = useState<Dayjs | null>(null);

    const apiKey = env.GOOGLE_MAPS_API_KEY as string;

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };

    function handleClick(): void {
       console.log(departure + ':' + dateDeparture, destination + ':' + dateReturn);
    }

    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]  h-screen">
                    <h1 className="text-6xl text-white mt-6">New Trip</h1>
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
                                            setDeparture(address.departure.formatted_address) ;
                                        }
                                    }
                                    className="w-auto my-2"
                                    id="departure"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect 
                                    labelexpTime='Time Departure' 
                                    labelexp="Date Departure"
                                    // value={dateDeparture}
                                    handleChange={(date) => {
                                        setDateDeparture(date)
                                    }}    
                                />
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
                                            setDestination(address.destination.formatted_address);
                                        }
                                    }
                                    className="max-w-[90vw] my-2"
                                    id="destination"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect 
                                    labelexpTime="Time Return "
                                    labelexp="Date Return"
                                    handleChange={(date) => {
                                        setDateReturn(date)
                                    }}    
                                />
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