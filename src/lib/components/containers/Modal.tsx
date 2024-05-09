/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getCampusNameWithAddress } from "$/utils/data/school";
import type { Ride } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { formatStrAddress } from "../../../utils/data/school";
import Button from "$/lib/components/button/Button";

interface ModalProps {
  ride: Ride & {
    driver: {
      name: string;
      email: string | null;
      image: string | null;
    };
  };
  isOpen: boolean;
  children: React.ReactNode;
  childrenToday?: React.ReactNode;
  onClose: () => void;
  isToday?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  ride,
  isOpen,
  children,
  isToday,
  onClose,
  childrenToday
}: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="rounded-lg bg-white p-6 shadow-lg"
            // Get the event and stop the relation with the parent element
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4 text-xl font-semibold">
              {formatStrAddress(ride.departure)} →{" "}
              {getCampusNameWithAddress(ride.destination) !== null
                ? getCampusNameWithAddress(ride.destination)
                : ride.destination}
            </h4>
            <p>Conducteur: {ride.driver.name}</p>
            <p>Email: {ride.driver.email}</p>
            <img
              width={50}
              height={50}
              src={ride.driver.image ?? ""}
              alt="Image du conducteur"
              className="mt-4 rounded-full"
            />
            <div className="flex justify-between flex-col w-full">
              <div className="flex flex-row">
                {isToday && (
                childrenToday
                )}
                {children}
              </div>
              <Button
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 mr-4 w-full h-max"
                onClick={onClose}
              >
                Fermer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
