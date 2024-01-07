
// Dropdown.tsx
import { DropdownProps } from "$/utils/interface";
import React, { useState } from "react";


const Dropdown: React.FC<DropdownProps> = ({ data, onChange }) => {
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
    const selectedCampusName = event.target.value;
    setSelectedCampus(selectedCampusName);
    onChange(
        { target: { value: selectedSchool } } as React.ChangeEvent<HTMLSelectElement>,
        { target: { value: selectedCampusName } } as React.ChangeEvent<HTMLSelectElement>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded-md shadow-md bg-white">
      <label className="block text-sm font-medium text-gray-600 mb-2">Ecole :</label>
      <select
        className="border p-2 w-full rounded-md"
        onChange={handleSchoolChange}
        value={selectedSchool || ""}
      >
        <option value="" disabled>
          Select a school
        </option>
        {data.school.map((school) => (
          <option key={school.name} value={school.reference}>
            {school.name}
          </option>
        ))}
      </select>

      {selectedSchool && (
        <>
          <label className="block text-sm font-medium text-gray-600 mt-4 mb-2">Campus :</label>
          <select
            className="border p-2 w-full rounded-md"
            onChange={handleCampusChange}
            value={selectedCampus || ""}
          >
            <option value="" disabled>
              Select a campus
            </option>
            {data.school
              .find((school) => school.reference === selectedSchool)
              ?.campus.map((campus) => (
                <option key={campus.campus_ref} value={campus.campus_ref}>
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
