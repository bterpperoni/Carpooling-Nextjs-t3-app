
import LayoutMain from '../../lib/components/layout/LayoutMain';

import  Map  from '$/lib/components/map/Map'; 

const All: React.FC = () => {
        const center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
        const zoom: number = 12;
        const markerPosition: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
    
        return (
            <>
            <LayoutMain>
                    <Map center={center} zoom={zoom} markerPosition={markerPosition} />
            </LayoutMain>
            </>
        );
    };
    
export default All;