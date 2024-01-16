
import LayoutMain from '../../lib/components/layout/LayoutMain';
import  Map  from '$/lib/components/map/Map'; 
import Slider from '$/lib/components/button/Slider';
import { useState } from 'react';
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { api } from '$/utils/api';
import { Marker } from '@react-google-maps/api';
import TravelCard from '$/lib/components/travel/TravelCard';
import { useRouter } from 'next/router';
import Button from '$/lib/components/button/Button';

const All: React.FC = () => {
        // Map settings
        const center: google.maps.LatLngLiteral =  { lat: 50.463727, lng: 3.938247 };
        const zoom = 12;

        // Session recovery
        const { data : sessionData } = useSession();
        // Router
        const router = useRouter();

        // Redirect to travel page when clicking on a marker
        const handleMarkerClick = (id: number) => {
            void router.push(`/rides/${id}`);
        }

        // Get all travels
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
    
        // Used to display the list of rides or the map
        const [checked, setChecked] = useState(false);
        
        const handleCheck = () => {
          setChecked(!checked);
        };
    
        return (
            <>
                <LayoutMain>
                    <div className="bg-[var(--purple-g3)]">
                        <div className=" flex flex-row items-center justify-between mt-4 mx-4">
                            
                        </div>
                        <div className='flex flex-col items-center'>  
                                <div className='border-b-t-2 border-0 border-white'>   
                                    <div className='md:text-2xl text-xl mx-12 bg-[var(--purple-g3)] text-center 
                                                    rounded-[5%] p-4 mb-4 text-fuchsia-700 border-fuchsia-700 border-y-2'>                    
                                        <p>Trouves le trajet qui te correspond</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className='block flex-col'>
                        <div className="grid grid-cols-3 grid-flow-col gap-12 items-center m-2 justify-items-center">
                            <div className='col-span-1 relative ml-6'>
                                <span className="text-fuchsia-700 text-xl text-sm mr-2">Filter</span>
                                <select className="border rounded-md px-3 py-2">
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-span-1 text-center space-y-4 > *">
                                <p className="text-white text-base m-4 border-2 border-white px-4 py-2 rounded-full">
                                    <label htmlFor="SliderDsiplay" className="mx-2">
                                        {checked ? 'List' : 'Map'}
                                    </label>
                                    <Slider check={handleCheck} checked={checked} />
                                </p>
                            </div>
                            <Button 
                                onClick={() => window.location.href='/rides/new'} 
                                className="col-span-1 bg-[var(--purple-g3)] hover:bg-[var(--pink-g1)] border-[var(--pink-g1)] 
                                           border-2 text-white px-3 py-2 rounded-full text-base w-max">
                                    Publier
                            </Button>
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