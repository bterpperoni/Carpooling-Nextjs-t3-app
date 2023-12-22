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
                <div>
                    {/* Departure */}
                    <Autocomplete
                        apiKey={apiKey}
                        options={options}
                        onPlaceSelected={(place) => {
                            address.departure = place;
                            console.log(address.departure.formatted_address);
                            }
                        }
                    />

                    {/* Destination */}
                    <Autocomplete
                        apiKey={apiKey}
                        options={options}
                        onPlaceSelected={(place) => {
                            address.destination = place;
                            console.log(address.destination);
                            }
                        }
                    />
                </div>
            </LayoutMain>
        </>
       );
}