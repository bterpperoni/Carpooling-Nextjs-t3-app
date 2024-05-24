// Import from old Svelte project
import React, { useState } from 'react';

const SlideButton: React.FC<{ check: () => void, checked: boolean, textLbl: string }> = ({ check, checked, textLbl }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    setIsChecked(!isChecked);
    check();
  };

  return (
    <>
      <div className="ds-form-control">
          <label className="ds-label cursor-pointer">
            <span className="ds-label-text mr-2">{textLbl}</span> 
            <input type="checkbox" checked={isChecked} onChange={handleChange} className="ds-toggle" />
          </label>
      </div>
    </>
  );
};

export default SlideButton;
