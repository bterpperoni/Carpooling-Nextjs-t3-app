import Button from '$/lib/components/button/Button';
import LayoutMain from '$/lib/components/layout/LayoutMain';
import { geocode } from '$/utils/geocoding';
import { data } from '$/utils/data';

export default function Calendar() {

    // console.log(encodeURIComponent('Place Warocqué 17, 7000 Mons'));
    // geocode('Place Warocqué 17, 7000 Mons').then((res) => console.log(res));
    let count = 0;
    data.school.forEach((school) => {
        school.campus.forEach((campus) => {
            count++;
            geocode(campus.address).then((res) => console.log(res));
        });
    });

    return (
         <>
            <LayoutMain>
                <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Rides</h1>
                    <div className="flex justify-between items-center mb-4">
                        
                        <Button href="/trips/new" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">New Trip</Button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                <th className="px-3 py-2 bg-gray-100">Name</th>
                                <th className="px-3 py-2 bg-gray-100">Description</th>
                                <th className="px-3 py-2 bg-gray-100">Status</th>
                                <th className="px-3 py-2 bg-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-3 py-2">Ride 1</td>
                                <td className="border px-3 py-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</td>
                                <td className="border px-3 py-2">Active</td>
                                <td className="border px-3 py-2">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md mr-2">Edit</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">Delete</button>
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                </LayoutMain>
        </>
       );
}