import { number } from "zod";

export const data ={
    "school": [
      {
        "reference": "Condorcet",
        "name": "Haute École Condorcet",
        "city": "Mons",
        "pays": "Belgique",
        "campus": [
          {
            "campus_ref": "Cmps. Arts",
            "campus_name": "Campus des Arts et Métiers",
            "address": "Rue des Soeurs Noires 1, 7000 Mons",
            "location": {
              "lat": 50.4500581, 
              "lng": 3.9508188
            },
            "placeId": "ChIJF4IruwFQwkcRY5dzZ7Q5k8I"
          },
          {
            "campus_ref": "Cmps. Sciences",
            "campus_name": "Campus des Sciences de la Santé",
            "address": "Chemin du Champ de Mars, 13 & 15B-7000 Mons",
            "location": {
              "lat" :50.4636144,
              "lng": 3.9524697
            },
            "placeId": "ChIJ37hOXB5QwkcRS_SXlEZpYYI"
          }
        ]
      },
      {
        "reference": "Umons",
        "name": "Université de Mons (UMons)",
        "city": "Mons",
        "pays": "Belgique",
        "campus": [
          {
            "campus_ref": "Pl. de Nimy",
            "campus_name": "Campus Plaine de Nimy",
            "address": "Chaussée de Binche 159, 7000 Mons",
            "location": {
              "lat": 50.4522652,
              "lng": 3.9858377
            },
            "placeId": "ChIJIzf8o45PwkcRtmxtGLkVJu4"
          },
          {
            "campus_ref": "Polytech",
            "campus_name": "Campus Polytech",
            "address": "Place du Parc 20, 7000 Mons",
            "location": {
              "lat": 50.4587408,
              "lng": 3.952212899999999
            },
            "placeId": "ChIJQekUEB1QwkcRcD19sM8F49g"
          },
          {
            "campus_ref": "Warocqué",
            "campus_name": "Campus Warocqué",
            "address": "Place Warocqué 17, 7000 Mons",
            "location": {
              "lat": 50.4588238,
              "lng": 3.9501664
            },
            "placeId": "ChIJwexj7hxQwkcRKQBAxNiT3Ig"
          }
        ]
      },
      {
        "reference": "HeH",
        "name": "Haute École en Hainaut",
        "city": "Mons",
        "pays": "Belgique",
        "campus": [
          {
            "campus_ref": "Dép. Pédagogique",
            "campus_name": "Département pédagogique",
            "address": "Boulevard Albert-Elisabeth 2, 7000 Mons",
            "location": {
              "lat": 50.4481852,
              "lng": 3.9536186
            },
            "placeId": "ChIJXYmpxP9PwkcRJtDy0EkLoNU"
          },
          {
            "campus_ref": "Dép. Sciences et techn.",
            "campus_name": "Département des sciences et technologies",
            "address": "Avenue Victor Maistriau, 8a, 7000 Mons",
            "location": {
              "lat": 50.4621466,
              "lng": 3.9572177
            },
            "placeId": "ChIJIwkpgeFPwkcRE14Mlo9wgi0"
          },
          {
            "campus_ref": "Dép. Soc.",
            "campus_name": "Département des sciences sociales",
            "address": "Avenue V. Maistriau 13, 7000 Mons",
            "location": {
              "lat": 50.4637089,
              "lng": 3.956881
            },
            "placeId": "ChIJwWT3uOFPwkcRutOZ-EhKick"
          }
        ]
      }
    ]
  }

export const getCampusFullNameWithAbbr = (str: string) => {
    const abbr = str.split('-', 2);
    const school = data.school.find((school) => school.reference === (abbr ?? [])[0])?.name ?? (abbr?.[0] ?? '');
    const campus = data.school.find((school) => school.reference === (abbr ?? [])[0])
                   ?.campus?.find((campus) => campus.campus_ref === abbr?.[1])?.campus_name ?? (abbr?.[1] ?? '');
    return school + ' - ' + campus;
}

export const getCampusAbbrWithFullName = (str: string) => {
    const ref = str.split('-', 2);
    const school = data.school.find((school) => school.reference === (ref ?? [])[0])?.reference ?? (ref?.[0] ?? '');
    const campus = data.school.find((school) => school.reference === (ref ?? [])[0])
                   ?.campus?.find((campus) => campus.campus_ref === ref?.[1])?.campus_ref ?? (ref?.[1] ?? '');
    return school + ' - ' + campus;
}

export const getCampusAddressWithAbbr = (str: string) => {
  for (const school of data.school) {
    for (const campus of school.campus) {
        if (campus.campus_ref === str) {
            // console.log(campus.address);
            const address = campus.address;
            return address;
        }
    }
  }
  return null;
}

export const getCampusNameWithAddress = (str: string) => {
  for (const school of data.school) {
    for (const campus of school.campus) {
        if (campus.address === str) {
            // console.log(campus.campus_name);
            const campusName = school.name + ' - ' + campus.campus_name;
            return campusName;
        }
    }
  }
  return null;
}

export const getCampusAbbrWithAddress = (str: string) => {
  for (const school of data.school) {
    for (const campus of school.campus) {
        if (campus.address === str) {
            // console.log(campus.campus_ref);
            const campusAbbr = school.reference + ' - ' + campus.campus_ref;
            return campusAbbr;
        }
    }
  }
  return null;
}

export const getCampusLatLng = (str: string) => {
  for (const school of data.school) {
    for (const campus of school.campus) {
        if (campus.campus_ref === str) {
            // console.log(campus.location);
            const campusLat = campus.location.lat;
            const campusLng = campus.location.lng;
            return { lat: campusLat, lng: campusLng };
        }
    }
  } return { lat: 0, lng: 0};
}

// Format the address to "street, city"
export const formatAddress = (address: string) => {
  const parts = address.split(',');
  if(parts[0] && parts[1]?.split(' ')[1]){
    // set street
    const streetParts = parts[0];
    // Second part splitted is the city and postal code '7000 Mons'
    const cityParts = parts[1].split(' ');
    // set city
    const city = cityParts[2];
    if(city){
      return `${streetParts}, ${city.trim()}`;
    }
  }
}

