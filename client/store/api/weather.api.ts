import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    location: string;
}

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://weather.googleapis.com/v1' 
    }),
    endpoints: (builder) => ({
        getWeather: builder.query<WeatherData, { lat: number; lon: number; key: string }>({
            query: ({ lat, lon, key }) => `/currentConditions:lookup?key=${key}&location.latitude=${lat}&location.longitude=${lon}`,
            transformResponse: (response: any) => ({
                temp: Math.round(response.temperature?.degrees || 29),
                humidity: response.humidity?.value || response.humidity || 28,
                windSpeed: response.wind?.speed?.value || response.wind?.speed || 18.12,
                condition: response.condition || 'Sunny',
                location: response.location?.name
            }),
        }),
    }),
});

export const { useGetWeatherQuery } = weatherApi;
