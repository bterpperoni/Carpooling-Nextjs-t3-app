/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Autocomplete  from 'react-google-autocomplete';
import DateTimeSelect from './DateTimeSelect';
import Button from '$/lib/components/button/Button';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { api } from '$/utils/api';
import { useEffect, useState } from 'react';
import { useApiKey } from '$/context/google';
import MuiStyle from '$/styles/MuiStyle.module.css';
import type { Ride } from '@prisma/client';


export default function RideForm({ ride, isForGroup, groupId }: 
    {
        ride?: Ride,
        isForGroup?: boolean,
        groupId?: number
    }) {
        
    const { data: sessionData } = useSession();
    const apiKey = useApiKey();
    // Address of departure and destination from google autocomplete
    const address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    const [departure, setDeparture] = useState<string>();
    const [destination, setDestination] = useState<string>();

    // Date of departure and destination
    const [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    const [dateReturn, setDateReturn] = useState<Dayjs | null>(null);
    
    // Time of departure and destination
    const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
    const [timeReturn, setTimeReturn] = useState<Dayjs | null>(null);

    // Latitude and longitude of departure and destination
    const [departureLatitude, setDepartureLatitude] = useState<number>();
    const [departureLongitude, setDepartureLongitude] = useState<number>();
    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
    };

    // Create a new ride
    const { data: rideCreated, mutate: createride } = api.ride.create.useMutation();
    // Used to update ride
    const { data: updatedride, mutate: updateride } = api.ride.update.useMutation();

    useEffect(() => {

        if(dateDeparture) {
            // if the user has selected a time for the departure date
            if(timeDeparture) {
                // set the date of departure with the time selected
                setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));
            }else{
                // else set the date of departure with the time of the ride
                setDateDeparture(   
                                dayjs(dateDeparture)
                                .set('hour', ride?.departureDateTime?.getHours() ?? 0)
                                .set('minute', ride?.departureDateTime?.getMinutes() ?? 0)
                            );
            }
        }

        if(dateReturn) {
            // if the user has selected a time for the return date
            if (timeReturn) {
                // set the date of return with the time selected
                setDateReturn(dayjs(dateReturn).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
            }else {
                // else set the date of return with the time of the ride
                setDateReturn(   
                                dayjs(dateReturn)
                                .set('hour', ride?.returnDateTime?.getHours() ?? 0)
                                .set('minute', ride?.returnDateTime?.getMinutes() ?? 0)
                            );
            }
        }
    
        if(rideCreated)  {
            window.location.href = `/rides/${rideCreated.id}`;
        }
            
        if(updatedride) {
            window.location.href = `/rides/${updatedride.id}`;
        }
        
    }, [rideCreated, updatedride, dateDeparture, timeDeparture, dateReturn, timeReturn, ride, departure, departureLatitude, departureLongitude]);

    // Submit a new ride or update an existing ride
    function handleClick() { 
        if(sessionData) {
            // ------------------- Create ride -------------------
            if(!ride){
                if(departure && destination) {
                    // Check if the date of return is after the date of departure
                    if(dateDeparture && dateReturn) {
                        if(dateReturn?.isBefore(dateDeparture)) {
                            alert('Return date must be after departure date'); 
                            return;
                        }else{
                                createride({
                                    driverId: sessionData.user.name,
                                    departure: departure,
                                    departureLatitude: departureLatitude ?? 0,
                                    departureLongitude: departureLongitude ?? 0,
                                    departureDateTime: dateDeparture.toDate(),
                                    destination: destination,
                                    destinationLatitude: destinationLatitude ?? 0,
                                    destinationLongitude: destinationLongitude ?? 0,
                                    returnDateTime: dateReturn.toDate(),
                                    isForGroup: isForGroup ?? false,
                                    groupId: groupId ?? null,
                                    status:0
                                });  
                            } 
                    }else{
                        alert("Please select a date for departure and return");
                        return;
                    }
                }else{
                    alert('Please select a departure and destination');
                    return;
                }
            }
            // ------------------- Update ride -------------------
            if(ride){
                    if(dateReturn?.isBefore(dateDeparture)) {
                        alert('Return date must be after departure date'); 
                        return;
                    }else{
                        updateride({
                            id : ride.id,
                            driverId: ride.driverId,
                            departure: departure ?? ride.departure,
                            departureLatitude: departureLatitude ?? ride.departureLatitude,
                            departureLongitude: departureLongitude ?? ride.departureLongitude,
                            departureDateTime: dateDeparture?.toDate() ?? ride.departureDateTime,
                            destination: destination ?? ride.destination,
                            destinationLatitude: destinationLatitude ?? ride.destinationLatitude,
                            destinationLongitude: destinationLongitude ?? ride.destinationLongitude,
                            returnDateTime: dateReturn?.toDate() ?? ride.returnDateTime,
                            status: 0
                        });
                    }  
                }
        }
    }

        return (
                <>
                    <form className="flex flex-col w-auto m-auto justify-center items-center bg-[var(--purple-g3)]">
                        {/* Departure */}
                        <div className='my-16'>
                            <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                <label htmlFor="departure" className='text-xl md:text-3xl text-[var(--pink-g1)] mb-1 mr-4'>Departure </label>
                                    <Autocomplete
                                    defaultValue={ride?.departure ?? ''}
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
                                    className=" w-[75%] 
                                                my-2 
                                                md:w-[75%]
                                                text-xl md:text-2xl
                                                text-white
                                                bg-[var(--purple-g3)]
                                                p-2 "
                                    id="departure"
                                    />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect
                                    defaultDate={ride?.departureDateTime?.toDateString() ? 
                                                dayjs(ride.departureDateTime?.toDateString()) 
                                                : 
                                                dateReturn ?? null
                                            }
                                    defaultTime={ride?.departureDateTime?.toDateString() ? 
                                                dayjs(ride?.departureDateTime)
                                                .set('hour' , ride?.departureDateTime?.getHours())
                                                .set('minute', ride?.departureDateTime?.getMinutes()) 
                                                : 
                                                timeReturn ?? null
                                            }
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
                                <label htmlFor="destination" className='text-xl md:text-3xl text-[var(--pink-g1)] mb-1 mr-4'>Destination </label>
                                    <Autocomplete
                                    defaultValue={ride?.destination ?? ''}
                                    disabled = {false}
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
                                    className=" w-[75%] 
                                                my-2 
                                                md:w-[75%]
                                                text-xl md:text-2xl
                                                text-white
                                                bg-[var(--purple-g3)] 
                                                p-2 "
                                    id="destination"
                                    />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect
                                    defaultDate={ride?.returnDateTime?.toDateString() ? 
                                        dayjs(ride.returnDateTime?.toDateString()) 
                                        : 
                                        dateReturn ?? null
                                    }
                                    defaultTime={ride?.returnDateTime?.toDateString() ? 
                                                dayjs(ride?.returnDateTime)
                                                .set('hour' , ride?.returnDateTime?.getHours())
                                                .set('minute', ride?.returnDateTime?.getMinutes()) 
                                                : 
                                                timeReturn ?? null
                                            }
                                    labelexpTime="Time Return "
                                    labelexp="Date Return"
                                    disableDate={false}
                                    disableTime={false}
                                    handleChangeDate={(date) => {
                                        setDateReturn(date)
                                    }}    
                                    handleChangeTime={(time) => {
                                        setTimeReturn(time)
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                        <div className="flex flex-col items-center">
                            {/* Submit */}
                            {ride ? (
                            <Button className={`${MuiStyle.MuiButtonText} w-max`} onClick={handleClick}> Modifier </Button>
                            ) : (
                            <Button className={`${MuiStyle.MuiButtonText} w-max`} onClick={handleClick}> Submit </Button>
                            )}
                            <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md w-max"
                                onClick={() => ride ? location.assign(`/rides/${ride?.id}`) : location.assign('/rides/')}> 
                                Annuler 
                            </Button>
                        </div>
                </>
        );
    }

