/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { data, getCampusAddress, getCampusLatLng } from '$/utils/data/school';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Infos from '$/lib/components/button/Infos';


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
    
    // Time of departure and destination
    const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>(null);
    // Is a return ride ? 
    const [isRideReturn, setIsRideReturn] = useState<boolean>(true);
    // If return
    const [timeReturn, setTimeReturn] = useState<Dayjs | null>(null);

    // Latitude and longitude of departure and destination
    const [departureLatitude, setDepartureLatitude] = useState<number>();
    const [departureLongitude, setDepartureLongitude] = useState<number>();
    const [destinationLatitude, setDestinationLatitude] = useState<number>();
    const [destinationLongitude, setDestinationLongitude] = useState<number>();

    // School & campus state
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
    // Verify if the school is in dropdown
    const [ schoolInDropdown, setSchoolInDropdown ] = useState<boolean>(true);

    // Maximum number of booking
    const [maxBooking, setMaxBooking] = useState<number>(2);

    // Maximum distance to pick up a passenger
    const [maxDistance, setMaxDistance] = useState<number>(10);

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




    /* _______________ USEFFECT FOR SET UP DATE & TIME DEPARTURE WHEN CREATING OR UPDATING A RIDE _______________ */
    useEffect(() => {
        /*
        * [TODO]: Remove the console.log & the var shouldUpdateDateDeparture (not necessary)
        */
        let shouldUpdateDateDeparture = false;
        if (dateDeparture) {
            // if the user has selected a time for the departure date
            if (timeDeparture) {
                if(!shouldUpdateDateDeparture) {
                    shouldUpdateDateDeparture = true;
                    // CREATING A RIDE: set the date of departure with the time selected
                    setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));
                }
                // console.log("Date of departure: ", dateDeparture.toDate().toLocaleDateString(), "\n",
                //         "Time of departure: ", dateDeparture.toDate().toLocaleTimeString());
            } else {
                if(shouldUpdateDateDeparture){
                    shouldUpdateDateDeparture = false;
                    // UPDATING A RIDE: else set the date of departure with the time of the ride
                    setDateDeparture(
                        dayjs(dateDeparture)
                        .set('hour', ride?.departureDateTime?.getHours() ?? 0)
                        .set('minute', ride?.departureDateTime?.getMinutes() ?? 0)
                    );
                }
                // console.log("Date of departure: ", dateDeparture.toDate().toLocaleDateString(), "\n",
                //         "Time of departure: ", dateDeparture.toDate().toLocaleTimeString());
            }
        }
    },[dateDeparture, timeDeparture, ride]);

    /* _______________________ USEFFECT FOR CHECK THE TIME IF THE TYPE OF RIDE IS ALLER-RETOUR _________________________ */
    useEffect(() => {
        if(checked) {
            // if the user has selected ALLER-RETOUR
            // Get the time
            if (timeReturn) {
                // Set dateReturn with (dateDeparture & timeReturn) because application is school based
                setTimeReturn(dayjs(dateDeparture).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
            }else {
                // else set the date of return with the time of the ride
                // alert('Please select a time for the return');
                throw new Error('An error occurred while setting the time of return');
                return;
            }
        }
    }, [timeReturn, dateDeparture]);

    /* _______________________ USEFFECT FOR TEST & REDIRECT WHEN CREATING/UPDATING A RIDE _________________________ */
    useEffect(() => {
    
        // if (destination) {
        //     console.log(
        //          "Destination: ", selectedSchool, selectedCampus + '\n' +
        //          "Address: ", destination + '\n' +
        //          "Latitude: ", destinationLatitude + '\n' +
        //          "Longitude: ", destinationLongitude);
        //  }

        if(rideCreated && updatedride !== undefined)  {
            window.location.href = `/rides/${rideCreated.id}`;
        }     
        
    }, [rideCreated, updatedride]);

    // Submit a new ride or update an existing ride
    function handleClick() { 
        if(sessionData) {
            // ------------------- Create ride -------------------
            if(!ride){
                if(departure && destination) {
                    // Check if the date of return is after the date of departure
                    if(dateDeparture) {
                        // Check if the time of return is after the time of departure and at least 2 hours after
                        if(timeReturn?.isBefore(timeDeparture) && (timeReturn?.diff(timeDeparture, 'hour') ?? 0) < 2) {
                            setTimeReturn(dayjs(timeDeparture).add(2, 'hour'));
                            alert("L'heure de retour doit au moins 2h après l'heure de départ, celle-ci ont été automatiquement modifiées"); 
                        } 
                        else{
                            if(timeReturn){
                                createride({
                                    driverId: sessionData.user.name,
                                    departure: departure,
                                    departureLatitude: departureLatitude ?? 0,
                                    departureLongitude: departureLongitude ?? 0,
                                    departureDateTime: dateDeparture.toDate(),
                                    destination: destination,
                                    destinationLatitude: destinationLatitude ?? 0,
                                    destinationLongitude: destinationLongitude ?? 0,
                                    returnTime: timeReturn?.toDate(),
                                    isForGroup: isForGroup ?? false,
                                    groupId: groupId ?? null
                                }); 
                            }
                             
                        }
                    } 
                }else{
                   alert("An error occurred while creating the ride, please check the form and try again.");
                    return;
                }
            }
            // ------------------- Update ride -------------------
            if(ride){
                    if(timeReturn?.isBefore(timeDeparture) && (timeReturn?.diff(timeDeparture, 'hour') ?? 0) < 2) {
                        setTimeReturn(dayjs(timeDeparture).add(2, 'hour'));
                        alert("L'heure de retour doit au moins 2h après l'heure de départ, celle-ci ont été automatiquement modifiées"); 
                    }else{
                        const tmpTimeReturn = timeReturn ? timeReturn.toDate() : null;
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
                            returnTime: timeReturn?.toDate() ?? ride.returnTime,
                            status: dateDeparture?.isSame(dayjs()) ? RideStatus.IN_PROGRESS : ride.status
                        });
                    }  
                }
        }
    }

    // Used to defines the type of the ride (ALLER or ALLER-RETOUR)
    const [checked, setChecked] = useState(false);

    // Used to defines is the ride is simple or return
    const handleCheck = () => {
        setChecked(!checked);
        if(!isRideReturn){
            setIsRideReturn(true);
        }else{
            setIsRideReturn(false);
        }
      };
        

        return (
                <>
                    <div className="flex flex-col w-auto m-auto justify-center items-center bg-[var(--purple-g3)]">
                        {/* First step of the form -> Departure & Destination */}
                        <div className='my-8 border-2 border-[var(--purple-g1)]'>
                            {/* Set up departure */}
                            {/*  */}
                            <div className=' flex flex-col border-b-2 border-[var(--pink-g1)] sm:items-center sm:flex-row m-2 p-2'>
                                <label htmlFor="departure" className='text-xl md:text-2xl text-[var(--pink-g1)] mb-1 mr-4'>
                                    D'où partez-vous ?
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
                            {/* Set up destination */}
                            <div className='m-1 p-2 flex flex-col border-b-2 border-[var(--pink-g1)]'>
                                {/* Input & Dropdown to select school */}
                                <div className="p-2 m-0 ">
                                    <p className="text-[var(--pink-g1)] text-[1.25rem]"> 
                                        A quel établissement vous rendez-vous ?
                                    </p>
                                    { schoolInDropdown ? (
                                        <Dropdown 
                                        data={data}
                                        styleDropdown='w-full my-2 text-[1.25rem] md:text-2xl 
                                                       text-white bg-[var(--purple-g3)] p-2'
                                        colorLabel='text-[var(--pink-g1)]'
                                        onChange={(sc: ChangeEvent<HTMLSelectElement>, ca: ChangeEvent<HTMLSelectElement>) => {
                                            setSelectedSchool(sc.target.value);
                                            setSelectedCampus(ca.target.value);
                                            if(ca.target.value){
                                                setDestination(getCampusAddress(ca.target.value));
                                                setDestinationLatitude(getCampusLatLng(ca.target.value).lat);
                                                setDestinationLongitude(getCampusLatLng(ca.target.value).lng);
                                            }
                                        }}/>
                                    ) : (
                                        <>
                                            <div className='p-2 mt-2'>
                                                <p className='md:text-2xl text-gray-400'></p>
                                                <label htmlFor="destination" 
                                                       className='text-[1.25rem] 
                                                                  md:text-2xl 
                                                                  text-[var(--pink-g1)] 
                                                                  mb-1 mr-2'>
                                                    Entrez l'adresse
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
                                        </>
                                       )}
                                    {/* border-2 border-[var(--pink-g1)] */}
                                    {schoolInDropdown ? (
                                        <>
                                            <Button className="cursor-pointer hover:border-b-2 border-gray-600" 
                                                onClick={() => setSchoolInDropdown(false)}>
                                                    Vous ne trouvez pas le vôtre ?
                                            </Button>
                                        </>
                                    ):(
                                        <>
                                            <Button className="cursor-pointer hover:border-b-2 border-gray-600" 
                                                onClick={() => setSchoolInDropdown(true)}>
                                                    Retourner à la liste
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Set up date & time */}
                            <div className='p-2 m-2 flex flex-col border-b-2 border-[var(--pink-g1)]'>
                                <div className='flex flex-row cursor-pointer mb-2 items-center'>
                                    <label htmlFor="destination" 
                                        className='text-xl md:text-2xl text-[var(--pink-g1)] mb-1 mr-4'>
                                        Quand partez-vous ?
                                    </label>
                                    {/* ---------------------------------------------- Icon infos -------------------------------------------- */}
                                        <Infos wIcon={25} hIcon={25} handleInfos={() => 
                                            alert("Attention : L'heure que vous entrez correspondra à l'heure où vous devrez avoir ramassé le dernier passager \n"+
                                            "L'heure réelle de démarrage sera calculée en fonction des passagers et de la distance à parcourir jusque l'établissement.")} />
                                    {/* ------------------------------------------------------------------------------------------------- */}
                                </div>
                                <DateTimeSelect
                                    defaultDate={ride?.departureDateTime?.toDateString() ? 
                                                dayjs(ride.departureDateTime?.toDateString()) 
                                                : null
                                            }
                                    defaultTime={ride?.departureDateTime?.toDateString() ? 
                                                dayjs(ride?.departureDateTime)
                                                .set('hour' , ride?.departureDateTime?.getHours())
                                                .set('minute', ride?.departureDateTime?.getMinutes()) 
                                                : null
                                            }
                                    labelexpTime='H. DE DEPART' 
                                    labelexp="DATE DE DEPART"
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
                            {/* Defines maximum number of booking */}
                            <div className="ml-4 w-[90%] my-4 border-b-2 border-[var(--pink-g1)] pb-4">
                                <div className="text-[var(--pink-g1)] text-[1.25rem] mb-3 flex flex-row items-center">
                                    Combien avez-vous de places disponibles ?
                                    <p className="ml-4 border-2 bg-white rounded-full p-1 text-gray-600">{maxBooking}</p>
                                </div>
                                <input 
                                    type="range" 
                                    min={1} max={4} 
                                    value={maxBooking}
                                    className="ds-range ds-range-primary"
                                    onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                                        setMaxBooking(e.target.valueAsNumber)
                                    }} 
                                />
                                
                            </div>
                            <div className="ml-4 w-[90%] my-4 border-b-2 border-[var(--pink-g1)] pb-4">
                                <div className="text-[var(--pink-g1)] text-[1.25rem] mb-3 flex flex-row items-center">
                                    Quel distance êtes-vous prêt à parcourir pour aller chercher un passager ?
                                     {/* ---------------------------------------------- Icon infos -------------------------------------------- */}
                                     <Infos wIcon={25} hIcon={25} handleInfos={() => 
                                            alert("Attention : La distance affichée correspond à la distance que vous acceptez de parcourir pour UN passager. \n"+
                                            "Il est primordial que vous puissiez respecter votre engagement auprès de vos passagers. Veillez donc à sélectionner \n"+
                                            "une distance qui vous convient ! Noter que la distance est en 'kilomètres (Kms)' \n"+
                                            "Les utilisateurs qui rentrent dans les conditions pourront souscrire directement à votre trajet.")} />
                                    {/* ------------------------------------------------------------------------------------------------- */}
                                    <p className="ml-4 text-center border-2 text-[1.25rem] bg-white rounded-full p-1 text-gray-600">{maxDistance}</p>
                                </div>
                                <input 
                                    type="range" 
                                    min={1} max={70} 
                                    value={maxDistance}
                                    className="ds-range ds-range-accent"
                                    onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                                        setMaxDistance(e.target.valueAsNumber)
                                    }} 
                                />
                            </div>
                        </div>
                        {/* Defines if the ride is a simple or return */}
                        <div className="col-span-1 mb-4 ">
                            <div className="text-white text-base mb-2 mt-2!important px-4 py-2 flex flex-col justify-center items-center">
                                <label htmlFor="SliderDsiplay" className="mx-2 relative top-1 md:text-2xl text-[1.25rem]">
                                    Voulez-vous planifier le retour ?
                                </label>
                                <div className="flex flex-col items-center mt-5">
                                    <Slider check={handleCheck} checked={checked} />
                                    <p className="mt-2">{checked ? 'Oui je le souhaite !' : 'Non merci, peut-être plus tard'}</p>
                                </div>
                            </div>
                        </div>
                        {!isRideReturn ? (
                            <>
                                {/* Set up the return Time if ALLER-RETOUR (normally the last step of the form) */}
                                <div className='p-2 mx-2 w-[90%] border-2 border-[var(--pink-g1)]'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <p className="text-white m-2 text-[20px]">
                                            A quelle heure démarrez-vous pour rentrez à votre domicile ?
                                        </p>
                                        <TimePicker
                                            defaultValue={ride?.returnTime?.toDateString() ? 
                                                dayjs(ride?.returnTime)
                                                .set('hour' , ride?.returnTime?.getHours())
                                                .set('minute', ride?.returnTime?.getMinutes()) 
                                                : 
                                                timeReturn ?? null
                                            }
                                            label="HEURE DE RETOUR"
                                            className={`mt-4 ml-0 md:ml-2 md:mt-0 ${MuiStyle.MuiInputBaseRoot} ${MuiStyle.MuiInputBaseInput} ${MuiStyle.MuiFormLabelRoot}`}
                                            ampm={false}
                                            ampmInClock={true}
                                            value={timeReturn}
                                            onChange={(time) => {
                                                setTimeReturn(time);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </>
                        ): null}
                    </div>
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

