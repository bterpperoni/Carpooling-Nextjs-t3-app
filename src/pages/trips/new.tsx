import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';
import DateTimeSelect from '../../lib/components/form/DateTimeSelection/DateTimeSelect';
import { Button } from '@mui/material';
import MuiStyle from '$/lib/styles/MuiStyle.module.css';
import { useEffect, useState } from 'react';
import { env } from 'next.config';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import { api } from '$/utils/api';
import { useRouter } from 'next/dist/client/router';

export default function NewTravel() {

    /* ------------ States ------------------ */

    // Session recovery
    const { data: sessionData } = useSession();

    // Address of departure and destination from google autocomplete
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    const [departure, setDeparture] = useState<string>();
    const [destination, setDestination] = useState<string>();

    // Date of departure and destination
    const [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    const [dateReturn, setDateReturn] = useState<Dayjs | null>(null);
    
    // Time of departure and destination
    const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
    const [timeReturn, setTimeReturn] = useState<Dayjs | null>(null);

    // Latitude and longitude of departure and destination
    const [departureLatitude, setDepartureLatitude] = useState<number>(0);
    const [departureLongitude, setDepartureLongitude] = useState<number>(0);
    const [destinationLatitude, setDestinationLatitude] = useState<number>(0);
    const [destinationLongitude, setDestinationLongitude] = useState<number>(0);

    const apiKey = env.GOOGLE_MAPS_API_KEY as string;

    const r = useRouter();

    // Create a new travel
    const { data: travelCreated, isSuccess, mutate: createTravel } = api.travel.create.useMutation();

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };

    /* ------------ Behaviors ------------------ */
    // Merge the date of [departure | return] with the time of [departure | return] to juste keep one field
    useEffect(() => {
        if (dateDeparture && timeDeparture) {
            setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));    
        }
        if (dateReturn && timeReturn) {
            setDateReturn(dayjs(dateReturn).set('hour', timeReturn.hour()).set('minute', timeReturn.minute())); 
        }
        
    }, [dateDeparture, timeDeparture, dateReturn, timeReturn]);

    // Redirect to the travels page when the travel is created
    useEffect(() => {
        if(isSuccess) {
            r.reload();
        }
    }, [isSuccess, r]);


    // Submit a new travel
    function handleClick() { 
        if(sessionData) {
            // Check if the departure and destination are selected
            if(departure && destination) {
                // Check if the date of return is after the date of departure
                if(dateDeparture && dateReturn) {
                    if(dateReturn?.isBefore(dateDeparture)) {
                        alert('Return date must be after departure date'); 
                    }
                    createTravel({
                        driverId: sessionData.user.id,
                        departure: departure,
                        departureLatitude: departureLatitude,
                        departureLongitude: departureLongitude,
                        departureDateTime: dateDeparture.toDate(),
                        destination: destination,
                        destinationLatitude: destinationLatitude,
                        destinationLongitude: destinationLongitude,
                        returnDateTime: dateReturn.toDate(),
                        status:0
                    });
                    console.log('Travel created');
                }else{
                    alert('Please select a date of return and departure');
                }
            }else{
                alert('Please select a departure and destination');
            }
            
        }
    }



    /* ------------ Render ------------------ */
    if(sessionData) {
    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]  h-screen">
                    <h1 className="text-6xl text-white mt-6">New Trip</h1>
                    <form className="flex flex-col w-auto m-auto justify-center items-center bg-[var(--purple-g3)]">
                        
                        <h1 className='mt-6 text-3xl text-white'>
                            Ajouter nombre de passager maximum +
                            <p className='mt-6'> Choix d'école pour destination</p>
                            <p> + Faire en sorte de rendre le fomulaire dynamique qui s'affichera étape par étape</p>
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
                                            setDeparture(address.departure.formatted_address);
                                            if(address.departure.geometry?.location?.lat() && address.departure.geometry?.location?.lng()) {
                                                setDepartureLatitude(address.departure.geometry.location.lat());
                                                setDepartureLongitude(address.departure.geometry.location.lng()); 
                                            }
                                        }
                                    }
                                    className="w-[75%] my-2 md:w-[75%]"
                                    id="departure"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect 
                                    labelexpTime='Time Departure' 
                                    labelexp="Date Departure"
                                    disableDate={false}
                                    disableTime={false}
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
                                            if(address.destination.geometry?.location?.lat() && address.destination.geometry?.location?.lng()) {
                                            setDestinationLatitude(address.destination.geometry.location.lat());
                                            setDestinationLongitude(address.destination.geometry.location.lng()); 
                                            }
                                        }
                                    }
                                    className="w-[75%] my-2 md:w-[75%]"
                                    id="destination"
                                />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect 
                                    labelexpTime="Time Return "
                                    labelexp="Date Return"
                                    // Disable the date and time of return when the date and time of departure are not selected
                                    disableDate={true}
                                    disableTime={true}
                                    // Enable the date and time of return
                                    {...(dateDeparture && timeDeparture && {disableDate: false})}
                                    {...(dateDeparture && timeDeparture && {disableTime: false})}
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
    return (
        <>     
            <LayoutMain>
                <h1>Not Connected, <p>Please Sign in</p></h1> 
            </LayoutMain> 
        </>
    );
}
