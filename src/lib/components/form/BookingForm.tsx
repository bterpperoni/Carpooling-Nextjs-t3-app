

// export default function BookingForm({ booking, cancelButtonHandler }:
//     {
//         booking?: Booking,
//         cancelButtonHandler: () => void
//     }) {

//     // School & campus state
//     const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
//     const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
//     // Group name state
//     const [groupName, setGroupName] = useState<string>(booking?.name ?? '');
//     // Slider state (public/private group)
//     const [isPrivate, setisPrivate] = useState<boolean>(booking?.visibility ?? false);
//     // Session recovery
//     const { data: sessionData } = useSession();
//     // Create group
//     const { data: createdGroup, mutate: createGroup } = api.group.create.useMutation();
//     // Update group
//     const { data: updatedGroup, mutate: updateGroup } = api.group.update.useMutation();
//     // Join group
//     const { mutate: createMemberGroup } = api.groupMember.create.useMutation();
//     // Check if the group is public or private
//     const handleCheck = () => {
//         setisPrivate(!isPrivate);
//     }
//     // Save group
//     function handleSaveGroup() {
//         if (sessionData) {
//             if (selectedSchool && selectedCampus && groupName) {
//                 const tmpDivCampus = selectedSchool + '-' + selectedCampus;
//                 if (booking) {
//                     updateGroup({
//                         id: booking.id,
//                         name: groupName,
//                         campus: tmpDivCampus,
//                         createdBy: sessionData.user.name,
//                         visibility: isPrivate
//                     });
//                 } else {
//                     createGroup({
//                         name: groupName,
//                         campus: tmpDivCampus,
//                         createdBy: sessionData.user.name,
//                         visibility: isPrivate
//                     });
//                 }

//             }
//         }
//     }

//     useEffect(() => {
//         if (createdGroup) {
//             if (sessionData) {
//                 const groupMember = {
//                     userName: sessionData.user.name,
//                     groupId: createdGroup.id,
//                     role: userRole.ADMIN
//                 }
//                 createMemberGroup(groupMember);
//             }
//         }
//     }, [createdGroup]);

//     return (
//         <div>
//             <div className="form-group">
//                 <label htmlFor="groupName">Group name</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     id="groupName"
//                     value={groupName}
//                     onChange={(e) => setGroupName(e.target.value)}
//                 />
//             </div>
//         </div>
//     );}
        