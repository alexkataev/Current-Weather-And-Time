import { Observable } from 'rxjs';

// Our main model for city
export interface City {
    id: number,
    locationId: string,
    city_name: string,
    state: string,
    country_name: string,
    coord: {
        lat: number,
        lon: number
    },
    cur_time: string,
    timezone: number,
    cur_date: string,
    w_icon: string,
    w_description: string,
    w_temp_kelvin: string
}

// For http requests
export interface Pending<t> {
    data: Observable<t[]>;
    status: Observable<Status>;
}
export enum Status {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    EMPTY = 'EMPTY',
    ERROR = 'ERROR'
}

// For autocomplete suggestions (from HERE API)
export interface AutocompletedCity {
    suggestions: [
        {
            label: string,
            language: string,
            countryCode: string,
            locationId: string,
            address: {
                country: string,
                state: string,
                county: string,
                city: string,
                postalCode: string
            },
            matchLevel: string
        }
    ]
}

// For location data of  (from HERE API)
export interface GeocodeCity {

    items: [
        {
            title: string,
            id: string,
            resultType: string,
            localityType: string,
            address: {
                label: string,
                countryCode: string,
                countryName: string,
                county: string,
                city: string
            },
            position: {
                lat: number,
                lng: number
            },
            mapView: {
                west: number,
                south: number,
                east: number,
                north: number
            },
            scoring: {
                queryScore: number,
                fieldScore: {
                    country: number,
                    city: number
                }
            }
        }
    ]
}
export interface CityCoords {
    lat: number,
    lng: number
}

// For weather and timezone data (from openweathermap.org)
export interface CityWeather {

    coord: {
        lon: number,
        lat: number
    },
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ],
    base: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number
    },
    visibility: number,
    wind: {
        speed: number,
        deg: number
    },
    clouds: {
        all: number
    },
    dt: number,
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number

}