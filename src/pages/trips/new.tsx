import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';
import DateTimeSelect from '../../lib/components/form/DateTimeSelection/DateTimeSelect';
import { Button } from '@mui/material';
import MuiStyle from '../../lib/styles/MuiStyle.module.css';
import { use, useEffect, useState } from 'react';
import { env } from 'next.config';
import dayjs, { Dayjs } from 'dayjs';
import { date, set } from 'zod';

export default function NewTravel() {

    // Address of departure and destination from google autocomplete
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    let [departure, setDeparture] = useState<string>();
    let [destination, setDestination] = useState<string>();

    // Date of departure and destination
    let [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    let [dateReturn, setDateReturn] = useState<Dayjs | null>(null);
    
    let [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
    let [timeReturn, setTimeReturn] = useState<Dayjs | null>(null);

    const apiKey = env.GOOGLE_MAPS_API_KEY as string;

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };

    // Merge the date of departure with the time of departure to juste have one date
    useEffect(() => {
        if (dateDeparture && timeDeparture) {
            setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));
        }
    }, [dateDeparture, timeDeparture]);

    // Merge the date of destination with the time of destination to juste have one date
    useEffect(() => {
        if (dateReturn && timeReturn) {
            setDateReturn(dayjs(dateReturn).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
        }
    }, [dateReturn, timeReturn]);

    function handleClick() {
    //     const travel: Travel = {
    //         id: 0,
    //         driverId: driverId,
    //         passengers : passenger,
    //         departure : address.departure.formatted_address,
    //         departureLatitude: address.departure.geometry?.location?.lat(),
    //         departureLongitude: address.departure.geometry?.location?.lng(),
    //         departureDate: parseISODateToMS(selectedDateDeparture.toString()),
    //         destination: address.destination.formatted_address,
    //         destinationLatitude: address.destination.geometry?.location?.lat(),
    //         destinationLongitude: address.destination.geometry?.location?.lng(),
    //         destinationDate: parseISODateToMS(finalDateDestination.toString()),
    //         maxPassengers: maxPassengers,
    //         status : 0
    // };
        if(dateDeparture) console.log(  dateDeparture?.format('DD-MM-YYYY HH:mm') +
                                        ' --> ' + dateReturn?.format('DD-MM-YYYY HH:mm'));

    }

    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]  h-screen">
                    <h1 className="text-6xl text-white mt-6">New Trip</h1>
                    <form className="flex flex-col w-auto m-auto justify-center items-center">
                        
                        <h1 className='mt-6 text-3xl text-white'>
                            Ajouter nombre de passager maximum + <br /> Choix d'école pour destination
                        </h1>

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
                                    handleChangeDate={(date) => {
                                        setDateDeparture(date)
                                    }}    
                                    handleChangeTime={(time) => {
                                        setTimeDeparture(time)
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
                                    handleChangeDate={(date) => {
                                        setDateReturn(date)
                                    }}    
                                    handleChangeTime={(time) => {
                                        setTimeReturn(time)
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