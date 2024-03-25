/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useApiKey } from '$/context/google';
import MuiStyle from '$/styles/MuiStyle.module.css';
import { RideStatus, type Ride } from '@prisma/client';
import Slider from '$/lib/components/button/Slider';
import Dropdown from '../dropdown/Dropdown';
import { data } from '$/utils/data/school';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


export default function RideForm({ ride, isForGroup, groupId }: 
    {
        ride?: Ride,
        isForGroup?: boolean,
        groupId?: number
    }) {
        
    const { data: sessionData } = useSession();
    const apiKey = useApiKey();
    // Address of departure and destination from google autocomplete
    const address: {  
        departure: google.maps.places.PlaceResult | null, 
        destination: google.maps.places.PlaceResult | null 
    } = { 
        departure: null, 
        destination: null 
    };
    const [departure, setDeparture] = useState<string>();
    const [destination, setDestination] = useState<string>();

    // Date of ride
    const [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    const [dateReturn, setDateReturn] = useState<Dayjs | null>(null);
    
    // Time of departure and destination
    const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
    // If ALLER-RETOUR
    const [timeReturn, setTimeReturn] = useState<Dayjs | null>(null);

    // Latitude and longitude of departure and destination
    const [departureLatitude, setDepartureLatitude] = useState<number>();
    const [departureLongitude, setDepartureLongitude] = useState<number>();
    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();

    // School & campus state
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

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

        if(selectedSchool && selectedCampus) {
            console.log(selectedSchool, selectedCampus);
        }

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

        if(checked) {
            // if the user has selected ALLER-RETOUR
            // Get the time
            if (timeReturn) {
                // Set dateReturn with (dateDeparture & timeReturn) because application is school based
                setDateReturn(dayjs(dateDeparture).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
            }else {
                // else set the date of return with the time of the ride
                alert('Please select a time for the return');
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
                                    returnTime: dateReturn.toDate(),
                                    isForGroup: isForGroup ?? false,
                                    groupId: groupId ?? null
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
                            returnTime: dateReturn?.toDate() ?? ride.returnTime,
                            status: dateDeparture?.isSame(dayjs()) ? RideStatus.IN_PROGRESS : ride.status
                        });
                    }  
                }
        }
    }

    // Used to defines the type of the ride (ALLER or ALLER-RETOUR)
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setChecked(!checked);
        // console.log(checked);
      };

        return (
                <>
                    <form className="flex flex-col w-auto m-auto justify-center items-center bg-[var(--purple-g3)]">
                        
                        {/* Departure */}
                        <div className='my-16 mb-8 border-2 border-[var(--purple-g1)]'>
                            <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                <label htmlFor="departure" className='text-xl md:text-3xl text-[var(--pink-g1)] mb-1 mr-4'>
                                    (1) Departure : 
                                </label>
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
                                                    p-2 
                                                    border-2 border-[var(--purple-g1)]"
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
                        <div className='border-2 border-[var(--purple-g1)]'>
                            <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                <label htmlFor="destination" className='text-xl md:text-3xl text-[var(--pink-g1)] mb-1 mr-4'>
                                    (2) Destination 
                                </label>
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
                                                p-2 
                                                border-2 border-[var(--purple-g1)]"
                                    id="destination"
                                    />
                            </div>
                            {/* Time of return if ALLER-RETOUR */}
                            <div className='p-4'>
                                <DateTimeSelect
                                    defaultDate={ride?.departureDateTime?.toDateString() ? 
                                        dayjs(ride.departureDateTime?.toDateString()) 
                                        : 
                                        dateReturn ?? null
                                    }
                                    defaultTime={ride?.returnTime?.toDateString() ? 
                                                dayjs(ride?.returnTime)
                                                .set('hour' , ride?.returnTime?.getHours())
                                                .set('minute', ride?.returnTime?.getMinutes()) 
                                                : 
                                                timeReturn ?? null
                                            }
                                    labelexpTime="Time Return "
                                    labelexp="Date Return"
                                    disableDate={true}
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
                        <TimePicker
                            defaultValue={ride?.returnTime?.toDateString() ? 
                                dayjs(ride?.returnTime)
                                .set('hour' , ride?.returnTime?.getHours())
                                .set('minute', ride?.returnTime?.getMinutes()) 
                                : 
                                timeReturn ?? null
                            }
                            label="Time Return "
                            className={`mt-4 ml-0 md:ml-2 md:mt-0 ${MuiStyle.MuiInputBaseRoot} ${MuiStyle.MuiInputBaseInput} ${MuiStyle.MuiFormLabelRoot}`}
                            ampm={false}
                            ampmInClock={true}
                            value={timeReturn}
                            onChange={(time) => {
                                setTimeReturn(time);
                            }}
                        />
                            <Dropdown 
                            data={data} 
                            onChange={(sc: ChangeEvent<HTMLSelectElement>, ca: ChangeEvent<HTMLSelectElement> ) => {
                            setSelectedSchool(sc.target.value);
                            setSelectedCampus(ca.target.value);
                            }}/>

                        <div className="col-span-1 mb-4 flex justify-center items-center">
                            <p className="text-white text-base mb-2 mt-2!important border-2 border-white px-4 py-2 rounded-full">
                                <label htmlFor="SliderDsiplay" className="mx-2 relative top-1">
                                    (3) Type du trajet : {checked ? 'ALLER-RETOUR' : 'ALLER SIMPLE'}
                                </label>
                                <Slider check={handleCheck} checked={checked} />
                            </p>
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

