import type { ButtonProps } from "$/lib/types/types";
import Button from "./Button";

function ButtonGroup({ onClick, children }: ButtonProps) {


  return (
    <Button
        onClick={onClick}
        className=" ease-in  
                    m-4
                    transform 
                    border-2
                    border-white 
                    bg-red-700 px-4 py-2
                    leading-none text-white transition duration-100
                    hover:-translate-y-1
                    hover:scale-110
                    hover:border-red-200
                    hover:bg-white
                    hover:shadow-[0_0.5em_0.5em_-0.4em_/#ffa260]
                    hover:text-red-400"
    >
      {children}
    </Button>
  );
}

export default ButtonGroup;