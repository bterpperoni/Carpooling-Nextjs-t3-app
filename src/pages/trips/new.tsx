import Autocomplete  from 'react-google-autocomplete';
import LayoutMain from '../../lib/components/layout/LayoutMain';
import DateSelect from '../../lib/components/form/DateTimeSelection/DateSelect';

export default function NewTravel() {

    // Get date
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);


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
                                    className="w-auto my-4"
                                    id="departure"
                                />
                            </div>
                            <div className='p-4'>
                                <DateSelect labelexp="Destination Date" />
                            </div>
                        </div>
                    
                        {/* Destination */}
                        <div>
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
                            <div className='p-4'>
                                <DateSelect labelexp="Destination Date" />
                            </div>
                        </div>
                    </form>
                    
                </div>
            </LayoutMain>
        </>
       );
}