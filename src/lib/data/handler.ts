import { data } from '$/lib/data/data';

export const getCampus = (str: string) => {
    const ref = str.split('-', 2);
    const school = data.school.find((school) => school.reference === (ref ?? [])[0])?.name ?? (ref?.[0] ?? '');
    const campus = data.school.find((school) => school.reference === (ref ?? [])[0])
                   ?.campus?.find((campus) => campus.campus_ref === ref?.[1])?.campus_name ?? (ref?.[1] ?? '');
    return school + ' - ' + campus;
}