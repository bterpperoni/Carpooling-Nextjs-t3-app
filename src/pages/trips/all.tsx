
import LayoutMain from '../../lib/components/layout/LayoutMain';
import  Map  from '$/lib/components/map/Map'; 
import Slider from '$/lib/components/button/slider/Slider';
import { useState } from 'react';
import Button from '$/lib/components/button/Button';
import { useSession } from 'next-auth/react';
import { api } from '$/utils/api';
import { Marker } from '@react-google-maps/api';
import TravelCard from '$/lib/components/travel/TravelCard';
import { useRouter } from 'next/router';

const All: React.FC = () => {
        const center: google.maps.LatLngLiteral =  { lat: 50.463727, lng: 3.938247 };
        const zoom = 12;

        const { data : sessionData } = useSession();

        const router = useRouter();

        const handleMarkerClick = (id: number) => {
            void router.push(`/trips/${id}`);
        }


        const { data: travelList } = api.travel.travelList.useQuery(undefined,
            { enabled: sessionData?.user !== undefined }  
        );

        const customMarker = {
            // Refer to https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-custom
            path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
            fillOpacity: 1,
            scale: 2,
            strokeWeight: 2
        };
    
        // Used to display the list of trips or the map
        const [checked, setChecked] = useState(false);
        
        const handleCheck = () => {
          setChecked(!checked);
        };
    
        return (
            <>
                <LayoutMain>
                    <div className="bg-[var(--purple-g3)]">
                        <div className=" flex flex-row items-center justify-between mt-4 mx-4">
                            <Slider check={handleCheck} checked={checked} classSlider='' />
                            <h1 className="md:text-6xl text-3xl font-bold mb-4 mt-4  w-[50%] text-center text-fuchsia-700">Trips</h1>
                            <Button 
                                href="/trips/new" 
                                className="bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-md">
                                    New Trip
                            </Button>
                        </div>
                        <div className='flex flex-col items-center'>  
                                <div className='border-b-t-2 border-0 border-white'>   
                                    <div className='md:text-4xl text-2xl mx-12 bg-[var(--purple-g3)] text-center 
                                                    rounded-[10%] p-4 mb-4 text-fuchsia-700 border-fuchsia-700 border-2 '>                    
                                        <p>Find the best trip</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center ml-4 my-4">
                            <span className="text-fuchsia-700 text-xl text-sm mr-2">Filter</span>
                            <select className="border rounded-md px-3 py-2">
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        {/* ------------------------------------- display list --------------------------------------------- */}
                        {checked && (
                            <>   
                                <div className='m-6 h-box w-auto bg-white border-fuchsia-700 text-fuchsia-700'>
                                    {travelList?.map((travel) => (
                                        <TravelCard  key={travel.id} travel={travel} driver={travel.driverId} goToTravel={() => handleMarkerClick(travel.id)} />
                                    ))}            
                                </div>
                            </>
                        )}
                        {/* -------------------------------------- display map ---------------------------------------------- */}
                        {!checked &&
                        <> 
                        <Map center={center} zoom={zoom}>
                            {travelList?.map((travel) => (
                                <Marker 
                                    key={travel.id} 
                                    position={{ lat: travel.departureLatitude, lng: travel.departureLongitude }}
                                    onClick={() => handleMarkerClick(travel.id)}
                                    icon={customMarker}
                                />
                            ))}
                        </Map>
                        </>
                        }
                    </div>
                </LayoutMain>
            </>
        );
    };
    
export default All;