import React, { useState } from 'react';
import { ButtonProps } from '../../../../utils/interface';

const SlideButton: React.FC<{ check: () => void; checked: boolean; classSlider: string }> = ({ check, checked, classSlider }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    setIsChecked(!isChecked);
    check();
  };

  return (
    <>
    <label className={`switch ${classSlider}`}>
      <input
        type="checkbox"
        id="slider"
        checked={isChecked}
        onChange={handleChange}/>
    <span className="slider round" />
    </label>
    </>
    
  );
};

export default SlideButton;
