import { useRouter } from "next/dist/client/router";
import LayoutMain from '../../lib/components/layout/LayoutMain';
import TravelDetail from "$/lib/components/travel/TravelDetail";
import { useSession } from "next-auth/react";
import { api } from "$/utils/api";
import Button from "$/lib/components/button/Button";
import Map from "$/lib/components/map/Map";
import { useEffect, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { env } from "next.config.js";
import MuiStyle from '$/lib/styles/MuiStyle.module.css';
import DateTimeSelect from "$/lib/components/form/DateTimeSelection/DateTimeSelect";
import dayjs, { Dayjs } from "dayjs";

export default function Detail() {
    // Used to switch between display & edit mode
    const [isEditing, setIsEditing] = useState(false);
    // Used to redirect after delete
    const [ travelDeleted, setTravelDeleted ] = useState(false);
    // Google maps api key
    const apiKey = env.GOOGLE_MAPS_API_KEY as string;
    // Get id from url
    const router = useRouter()
    const id = parseInt(router.query.detail as string);  
    // Session recovery
    const { data: sessionData } = useSession();
    // Get travel by id
    const {data: travel} = api.travel.travelById.useQuery({id: id}, {enabled: sessionData?.user !== undefined});
    // Used to delete travel
    const { mutate: deleteTravel } = api.travel.delete.useMutation();
    // Used to update travel
    const { data: updatedTravel, mutate: updateTravel } = api.travel.update.useMutation();
    // Set if travel can be edited
    const canEdit = sessionData?.user?.id === travel?.driverId;
    /* ------------------------------ Form fields to update travel ------------------------------ */
    // Date of departure and destination
    const [dateDeparture, setDateDeparture] = useState<Dayjs | null>(null);
    const [dateReturn, setDateReturn] = useState<Dayjs | null>(null); 
    // Time of departure and destination
    const [timeDeparture, setTimeDeparture] = useState<Dayjs | null>();
    const [timeReturn, setTimeReturn] = useState<Dayjs | null>();

    // Address of departure and destination from google autocomplete
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };
    const [departure, setDeparture] = useState<string>();
    const [destination, setDestination] = useState<string>();
    // Latitude and longitude of departure and destination
    const [departureLatitude, setDepartureLatitude] = useState<number>(travel?.departureLatitude as number);
    const [departureLongitude, setDepartureLongitude] = useState<number>(travel?.departureLongitude as number);
    const [destinationLatitude, setDestinationLatitude] = useState<number>(travel?.destinationLatitude as number);
    const [destinationLongitude, setDestinationLongitude] = useState<number>(travel?.departureLongitude as number);

    /* -------------------------------------------------------------------------------------------- */

    // Get lat & lng of departure & destination
    const departureLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.departureLatitude as number, 
        lng: travel?.departureLongitude as number 
    };
    const destinationLatLng: google.maps.LatLngLiteral = { 
        lat: travel?.destinationLatitude as number, 
        lng: travel?.destinationLongitude as number
    };
    // Map options
    const zoom: number = 12;
    
    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };
    
    // Function to display line between departure & destination
    function calculAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
        directionsService.route(
            {
                origin: departureLatLng,
                destination: destinationLatLng,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
   
    // Display map with line between departure & destination after map is loaded
    function mapLoaded(map: google.maps.Map) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer(
            {map: map}
        );     
        calculAndDisplayRoute(directionsService, directionsRenderer);
    }

    // Enable edit mode & set travel data in form fields
      const handleEditClick = () => {
        setIsEditing(true);
    };

    // Save travel data & disable edit mode
    const handleSaveClick = () => {
        // window.location.href = `/trips/${id}`;
        if(travel && travel.returnDateTime) {
            const newTravel = {id : travel.id,
                driverId: travel.driverId,
                departure: departure ?? travel.departure,
                departureLatitude: departureLatitude ?? travel.departureLatitude,
                departureLongitude: departureLongitude ?? travel.departureLongitude,
                departureDateTime: travel.departureDateTime,
                destination: destination ?? travel.destination,
                destinationLatitude: destinationLatitude ?? travel.destinationLatitude,
                destinationLongitude: destinationLongitude ?? travel.destinationLongitude,
                returnDateTime: travel.returnDateTime,
                status: 0
            };
            updateTravel(newTravel);
        }
        
        
    };

    // Delete travel
    const handleDelete = () => {
        deleteTravel({id});
        setTravelDeleted(true);
        window.location.href = '/trips/all';
    }
 
    useEffect(() => {
        if(travel) {
            if(dateDeparture) {
                // if the user has selected a time for the departure date
                if(timeDeparture) {
                    // set the date of departure with the time selected
                    setDateDeparture(dayjs(dateDeparture).set('hour', timeDeparture.hour()).set('minute', timeDeparture.minute()));
                }else{
                    // else set the date of departure with the time of the travel
                    setDateDeparture(   
                                    dayjs(dateDeparture)
                                    .set('hour', travel?.departureDateTime?.getHours())
                                    .set('minute', travel?.departureDateTime?.getMinutes())
                                );
                }
                // finally set the date of departure in the travel object
                travel.departureDateTime = dateDeparture.toDate();
            }
            
            if(dateReturn) {
                // if the user has selected a time for the return date
                if (timeReturn) {
                    // set the date of return with the time selected
                    setDateReturn(dayjs(dateReturn).set('hour', timeReturn.hour()).set('minute', timeReturn.minute()));
                }else{
                    // else set the date of return with the time of the travel
                    setDateReturn(   
                                    dayjs(dateReturn)
                                    .set('hour', travel?.returnDateTime?.getHours() ?? 0)
                                    .set('minute', travel?.returnDateTime?.getMinutes() ?? 0)
                                );
                }
                // finally set the date of return in the travel object
                travel.returnDateTime = dateReturn.toDate();
            }

            if(departure){
                travel.departure = departure;
                travel.departureLatitude = departureLatitude;
                travel.departureLongitude = departureLongitude;
            }
        }

        if(updatedTravel) {
            window.location.href = `/trips/${id}`;
        }
    }
    , [dateDeparture, timeDeparture, dateReturn, timeReturn, departure, updatedTravel]);
   

  if(!travel) return <div>Travel not found</div>
  return (
    <>
        <LayoutMain>
            {/* ------------------------------------Card with travel details--------------------------------------------------- */}  
                {!isEditing ? (
                    <>
                        <Map zoom={zoom} onLoad={mapLoaded} />
                        <TravelDetail travel={travel}>
                                    {canEdit ? (
                                        <>
                                            <Button 
                                                onClick={handleEditClick}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">
                                                Modifier le trajet
                                            </Button>
                                            <Button
                                                onClick={handleDelete}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">
                                                Supprimer le trajet
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                                                onClick={() => alert('not implemented')}>
                                                Réserver
                                            </Button>
                                        </>
                                    )}
                        </TravelDetail>
                    </>
                ) : (
                    <>
            {/* ------------------------------------Form to update the travel--------------------------------------------------- */}
                        <div className="flex flex-col items-center">
                            <h2 className=" md:text-4xl 
                                            text-2xl 
                                            font-bold 
                                            mb-4 mt-4  
                                            w-[fit-content]
                                            text-center 
                                            text-white
                                            border-2
                                            border-fuchsia-700
                                            p-4
                                            rounded-[12.5%]">
                                Modifier votre trajet
                            </h2>
                            <form className="flex flex-col w-auto m-auto justify-center items-center bg-[var(--purple-g3)]">
                                {/* Departure */}
                                <div className='my-16'>
                                    <div className='ml-4 flex flex-col sm:items-center sm:flex-row'>
                                        <label htmlFor="departure" className='text-xl md:text-3xl text-white mb-1'>Departure : </label>
                                        <Autocomplete
                                            defaultValue={travel.departure}
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
                                            defaultDate={travel.departureDateTime?.toDateString() ? dayjs(travel.departureDateTime?.toDateString()) : null}
                                            defaultTime={travel.departureDateTime?.toDateString() ?
                                                            dayjs(travel?.departureDateTime)
                                                            .set('hour' , travel?.departureDateTime?.getHours())
                                                            .set('minute', travel?.departureDateTime?.getMinutes()) 
                                                            : 
                                                            dayjs(timeDeparture?.hour(travel?.departureDateTime?.getHours()).minute(travel?.departureDateTime?.getMinutes()) )      
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
                                        <label htmlFor="destination" className='text-xl md:text-3xl text-white mb-1'>Destination : </label>

                                        <Autocomplete
                                            defaultValue={travel.destination}
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
                                            disabled
                                        />
                                    </div>
                                    <div className='p-4'>
                                        <DateTimeSelect
                                            defaultDate={travel.returnDateTime?.toDateString() ? dayjs(travel.returnDateTime?.toDateString()) : null}
                                            defaultTime={travel.returnDateTime?.toDateString() ? 
                                                            dayjs(travel?.returnDateTime)
                                                            .set('hour' , travel?.returnDateTime?.getHours())
                                                            .set('minute', travel?.returnDateTime?.getMinutes()) 
                                                            : 
                                                            timeReturn
                                                        }
                                            labelexpTime="Time Return"
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
                                {/* Submit */}
                                <Button className={MuiStyle.MuiButtonText} onClick={handleSaveClick}> Enregistrer les modifications </Button>
                                <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"> Annuler </Button>
                            </form>
                        </div>
                    </>
                )}
        </LayoutMain>
    </>
  )
}