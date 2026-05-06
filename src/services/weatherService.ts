export interface WeatherData {
  name: string;
  timezone: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    uv_index?: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  trend?: Array<{ day: string; temp: number }>;
  coord?: {
    lat: number;
    lon: number;
  };
  clouds?: {
    all: number;
  };
}

const mapWmoToOwm = (code: number): { main: string; description: string } => {
  if (code === 0) return { main: 'Clear', description: 'clear sky' };
  if (code === 1) return { main: 'Clouds', description: 'mainly clear' };
  if (code === 2) return { main: 'Clouds', description: 'partly cloudy' };
  if (code === 3) return { main: 'Clouds', description: 'overcast' };
  if (code === 45 || code === 48) return { main: 'Mist', description: 'fog' };
  if (code >= 51 && code <= 57) return { main: 'Drizzle', description: 'drizzle' };
  if (code >= 61 && code <= 67) return { main: 'Rain', description: 'rain' };
  if (code >= 71 && code <= 77) return { main: 'Snow', description: 'snow' };
  if (code >= 80 && code <= 82) return { main: 'Rain', description: 'rain showers' };
  if (code >= 85 && code <= 86) return { main: 'Snow', description: 'snow showers' };
  if (code >= 95 && code <= 99) return { main: 'Thunderstorm', description: 'thunderstorm' };
  return { main: 'Clear', description: 'clear sky' };
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  try {
    // 1. Open-Meteo Geocoding API ile koordinatları al
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found globally');
    }
    
    const location = geoData.results[0];
    const { latitude, longitude, name, country } = location;

    // 2. Weather API (API Key gerekmez)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&wind_speed_unit=ms&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;
    const daily = weatherData.daily;
    const mappedWeather = mapWmoToOwm(current.weather_code);

    const trend = daily.time.map((timeStr: string, index: number) => {
      const date = new Date(timeStr);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        temp: Math.round(daily.temperature_2m_max[index]),
      };
    });

    return {
      name: name,
      timezone: weatherData.utc_offset_seconds,
      coord: {
        lat: latitude,
        lon: longitude
      },
      sys: {
        country: country || '',
        sunrise: new Date(daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(daily.sunset[0]).getTime() / 1000,
      },
      weather: [{
        id: current.weather_code,
        main: mappedWeather.main,
        description: mappedWeather.description,
        icon: '01d',
      }],
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        temp_min: daily.temperature_2m_min[0],
        temp_max: daily.temperature_2m_max[0],
        pressure: current.pressure_msl,
        humidity: current.relative_humidity_2m,
        uv_index: daily.uv_index_max ? daily.uv_index_max[0] : 0,
      },
      wind: {
        speed: current.wind_speed_10m,
        deg: current.wind_direction_10m,
      },
      clouds: {
        all: current.weather_code === 3 ? 90 : current.weather_code === 2 ? 50 : current.weather_code === 1 ? 25 : 0,
      },
      trend: trend,
    };
  } catch (error) {
    throw error;
  }
};