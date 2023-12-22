import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';


export default function NewTravel() {

    // Address
    let address: {  departure: google.maps.places.PlaceResult | null, destination: google.maps.places.PlaceResult | null } = { departure: null, destination: null };

    const apiKey = process.env.GOOGLE_MAPS_API_KEY as string;

    // Options for autocomplete
    const options = {
        componentRestrictions: { country: 'be' },
        strictBounds: false,
        types: ['address']
        };

    

    return (
         <>
            <LayoutMain>
                <div className="bg-[var(--purple-g3)]">
                    <h1 className="text-6xl text-white">New Travel</h1>
                    <form className="flex flex-col w-[75%] m-auto justify-center items-center">
                         {/* Departure */}
                        <div>
                            <label htmlFor="departure">Departure : </label>
                            <Autocomplete
                                apiKey={apiKey}
                                options={options}
                                onPlaceSelected={(place) => {
                                    address.departure = place;
                                    console.log(address.departure.formatted_address);
                                    }
                                }
                                className="w-[50%] my-4"
                                id="departure"
                            />
                        </div>
                        
                        {/* Destination */}
                        <div>
                            <label htmlFor="destination">Destination : </label>
                            <Autocomplete
                                apiKey={apiKey}
                                options={options}
                                onPlaceSelected={(place) => {
                                    address.destination = place;
                                    console.log(address.destination.formatted_address);
                                    }
                                }
                                className="w-[50%] my-4"
                                id="destination"
                            />
                        </div>
                        
                    </form>
                   
                </div>
            </LayoutMain>
        </>
       );
}