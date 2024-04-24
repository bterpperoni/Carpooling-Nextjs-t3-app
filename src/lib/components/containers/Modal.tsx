/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCampusNameWithAddress } from "$/utils/data/school";
import type { Ride } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { formatStrAddress } from '../../../utils/data/school';
import { useSession } from "next-auth/react";

interface ModalProps {
    ride: Ride;
    isOpen: boolean;
    driverName?: string;
    driverEmail?: string;
    driverImage?: string;
    onClose: () => void;
  }
  
const Modal: React.FC<ModalProps> = ({ ride, isOpen, driverName, driverEmail, driverImage, onClose }: ModalProps) => {

    const { data: sessionData } = useSession();

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 m-4"
            onClick={onClose}
          >
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                // Get the event and stop the relation with the parent element   
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-xl font-semibold mb-4">
                  {formatStrAddress(ride.departure)} → {getCampusNameWithAddress(ride.destination) !== null ? 
                    getCampusNameWithAddress(ride.destination) 
                      : 
                    ride.destination}
                </h4>
                <p>Conducteur: {driverName ?? sessionData?.user?.name}</p>
                <p>Email: {driverEmail ?? sessionData?.user?.email}</p>
                    <Image width={50} height={50} src={driverImage ?? ""} alt="Image du conducteur" className="mt-4 rounded-full" />
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={onClose}>Fermer</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

export default Modal;