
// Dropdown.tsx
import type { DropdownProps } from "$/lib/types/interfaces";
import React, { useState } from "react";

/* ------------------------------------------------------------------------------------------------------------------------
------------------------- Dropdown to select school -----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------ */
const Dropdown: React.FC<DropdownProps> = ({ data, styleDropdown, colorLabel, onChange }) => {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

  const handleSchoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSchoolReference = event.target.value;
    setSelectedSchool(selectedSchoolReference);
    setSelectedCampus(null); // Reset selected campus when school changes
    onChange(
        { target: { value: selectedSchoolReference } } as React.ChangeEvent<HTMLSelectElement>,
        { target: { value: selectedCampus } } as React.ChangeEvent<HTMLSelectElement>
    );
  };

  const handleCampusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCampusRef = event.target.value;
    setSelectedCampus(selectedCampusRef);
    onChange(
        { target: { value: selectedSchool } } as React.ChangeEvent<HTMLSelectElement>,
        { target: { value: selectedCampusRef } } as React.ChangeEvent<HTMLSelectElement>
    );
  };

  return (
    <div className={`${styleDropdown}`}>
      <label className={`block text-xl mb-2 ${colorLabel}`}>Ecole :</label>
      <select
        className="border p-2 w-full rounded-md"
        onChange={handleSchoolChange}
        value={selectedSchool ?? ""}
      >
        <option value="" disabled className="text-[1.25rem]">
          Sélectionner un établissement
        </option>
        {data.school.map((school) => (
          <option key={school.name} value={school.reference} className="text-[1.25rem]">
            {school.name}
          </option>
        ))}
      </select>
{/* block text-xl font-medium text-gray-600 mt-4 mb-2 */}
      {selectedSchool && (
        <>
          <label className={`block text-xl font-medium mt-4 mb-2 ${colorLabel}`}>Campus :</label>
          <select
            className="border p-2 w-full rounded-md"
            onChange={handleCampusChange}
            value={selectedCampus ?? ""}
          >
            <option value="" disabled className="text-[1.25rem]">
              Sélectionner un campus
            </option>
            {data.school
              .find((school) => school.reference === selectedSchool)
              ?.campus.map((campus) => (
                <option key={campus.campus_ref} value={campus.campus_ref} className="text-[1.25rem]">
                  {campus.campus_name}
                </option>
              ))}
          </select>
        </>
      )}
    </div>
  );
};

export default Dropdown;
