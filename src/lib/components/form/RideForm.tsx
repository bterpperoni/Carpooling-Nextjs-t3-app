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
import { useApiKey } from '$/context/process';
import MuiStyle from '$/styles/MuiStyle.module.css';
import type { Travel } from '@prisma/client';


export default function RideForm({ travel, isForGroup, groupId }: 
    {
        travel?: Travel,
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

    // Create a new travel
    const { data: travelCreated, mutate: createTravel } = api.travel.create.useMutation();
    // Used to update travel
    const { data: updatedTravel, mutate: updateTravel } = api.travel.update.useMutation();

    useEffect(() => {

        if(dateDeparture) {
            // if the user has selected a time for the departure date
            if(timeDeparture) {
                // set the date of departure with the time selected
                setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));
            }else{
                // else set the date of departure with the time of the travel
                setDateDeparture(   
                                dayjs(dateDeparture)
                                .set('hour', travel?.departureDateTime?.getHours() ?? 0)
                                .set('minute', travel?.departureDateTime?.getMinutes() ?? 0)
                            );
            }
        }

        if(dateReturn) {
            // if the user has selected a time for the return date
            if (timeReturn) {
                // set the date of return with the time selected
                setDateReturn(dayjs(dateReturn).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
            }else {
                // else set the date of return with the time of the travel
                setDateReturn(   
                                dayjs(dateReturn)
                                .set('hour', travel?.returnDateTime?.getHours() ?? 0)
                                .set('minute', travel?.returnDateTime?.getMinutes() ?? 0)
                            );
            }
        }
    
        if(travelCreated)  {
            window.location.href = `/rides/${travelCreated.id}`;
        }
            
        if(updatedTravel) {
            window.location.href = `/rides/${updatedTravel.id}`;
        }
        
    }, [travelCreated, updatedTravel, dateDeparture, timeDeparture, dateReturn, timeReturn, travel, departure, departureLatitude, departureLongitude]);

    // Submit a new travel or update an existing travel
    function handleClick() { 
        if(sessionData) {
            // ------------------- Create travel -------------------
            if(!travel){
                if(departure && destination) {
                    // Check if the date of return is after the date of departure
                    if(dateDeparture && dateReturn) {
                        if(dateReturn?.isBefore(dateDeparture)) {
                            alert('Return date must be after departure date'); 
                            return;
                        }else{
                                createTravel({
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
            // ------------------- Update travel -------------------
            if(travel){
                    if(dateReturn?.isBefore(dateDeparture)) {
                        alert('Return date must be after departure date'); 
                        return;
                    }else{
                        updateTravel({
                            id : travel.id,
                            driverId: travel.driverId,
                            departure: departure ?? travel.departure,
                            departureLatitude: departureLatitude ?? travel.departureLatitude,
                            departureLongitude: departureLongitude ?? travel.departureLongitude,
                            departureDateTime: dateDeparture?.toDate() ?? travel.departureDateTime,
                            destination: destination ?? travel.destination,
                            destinationLatitude: destinationLatitude ?? travel.destinationLatitude,
                            destinationLongitude: destinationLongitude ?? travel.destinationLongitude,
                            returnDateTime: dateReturn?.toDate() ?? travel.returnDateTime,
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
                                <label htmlFor="departure" className='text-xl md:text-3xl text-white mb-1 mr-4'>Departure </label>
                                    <Autocomplete
                                    defaultValue={travel?.departure ?? ''}
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
                                                text-[var(--pink-g1)]
                                                bg-[var(--purple-g3)]
                                                p-2 "
                                    id="departure"
                                    />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect
                                    defaultDate={travel?.departureDateTime?.toDateString() ? 
                                                dayjs(travel.departureDateTime?.toDateString()) 
                                                : 
                                                dateReturn ?? null
                                            }
                                    defaultTime={travel?.departureDateTime?.toDateString() ? 
                                                dayjs(travel?.departureDateTime)
                                                .set('hour' , travel?.departureDateTime?.getHours())
                                                .set('minute', travel?.departureDateTime?.getMinutes()) 
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
                                <label htmlFor="destination" className='text-xl md:text-3xl text-white mb-1 mr-4'>Destination </label>
                                    <Autocomplete
                                    defaultValue={travel?.destination ?? ''}
                                    disabled = {travel ? true : false}
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
                                                text-[var(--pink-g1)]
                                                bg-[var(--purple-g3)] 
                                                p-2 "
                                    id="destination"
                                    />
                            </div>
                            <div className='p-4'>
                                <DateTimeSelect
                                    defaultDate={travel?.returnDateTime?.toDateString() ? 
                                        dayjs(travel.returnDateTime?.toDateString()) 
                                        : 
                                        dateReturn ?? null
                                    }
                                    defaultTime={travel?.returnDateTime?.toDateString() ? 
                                                dayjs(travel?.returnDateTime)
                                                .set('hour' , travel?.returnDateTime?.getHours())
                                                .set('minute', travel?.returnDateTime?.getMinutes()) 
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
                            {travel ? (
                            <Button className={`${MuiStyle.MuiButtonText} w-max`} onClick={handleClick}> Modifier </Button>
                            ) : (
                            <Button className={`${MuiStyle.MuiButtonText} w-max`} onClick={handleClick}> Submit </Button>
                            )}
                            <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md w-max"
                                onClick={() => self.location.reload()}> 
                            Annuler 
                            </Button>
                        </div>
                </>
        );
    }

