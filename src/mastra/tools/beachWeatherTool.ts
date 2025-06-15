import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Beach coordinates database
const beachCoordinates: Record<string, { lat: number; lon: number; name: string }> = {
  'coney island': { lat: 40.5755, lon: -73.9707, name: 'Coney Island Beach' },
  'brighton beach': { lat: 40.5776, lon: -73.9614, name: 'Brighton Beach' },
  'manhattan beach': { lat: 40.5888, lon: -73.9378, name: 'Manhattan Beach' },
  'rockaway beach': { lat: 40.5892, lon: -73.8131, name: 'Rockaway Beach' },
  'orchard beach': { lat: 40.8670, lon: -73.7854, name: 'Orchard Beach' },
  'south beach': { lat: 40.5886, lon: -74.0776, name: 'South Beach' },
  'midland beach': { lat: 40.5653, lon: -74.0845, name: 'Midland Beach' },
  'cedar grove beach': { lat: 40.5434, lon: -74.1045, name: 'Cedar Grove Beach' },
  'wolfes pond beach': { lat: 40.5234, lon: -74.1987, name: "Wolfe's Pond Beach" }
};

interface OpenWeatherResponse {
  weather: Array<{
    main: string;
    description: string;
    id: number;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export const beachWeatherTool = createTool({
  id: 'beachWeatherTool',
  description: 'Get current weather conditions for specific NYC beaches using exact coordinates and OpenWeather API',
  inputSchema: z.object({
    beachName: z.string().describe('Name of the NYC beach (e.g., "coney island", "rockaway beach", "orchard beach")')
  }),
  outputSchema: z.object({
    beach: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    weather: z.object({
      temperature: z.number(),
      feelsLike: z.number(),
      humidity: z.number(),
      windSpeed: z.number(),
      windDirection: z.number(),
      windGust: z.number().optional(),
      conditions: z.string(),
      description: z.string(),
      visibility: z.number(),
      pressure: z.number(),
      cloudCover: z.number()
    }),
    safety: z.object({
      swimmingConditions: z.string(),
      recommendations: z.array(z.string()),
      uvWarning: z.string().optional()
    }),
    timestamp: z.string()
  }),
  execute: async ({ context }) => {
    return await getBeachWeather(context.beachName);
  },
});

const getBeachWeather = async (beachName: string) => {
  try {
    const normalizedName = beachName.toLowerCase().trim();
    const beach = beachCoordinates[normalizedName];
    
    if (!beach) {
      throw new Error(`Beach "${beachName}" not found. Available beaches: ${Object.keys(beachCoordinates).join(', ')}`);
    }

    // Get API key from environment
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured in environment variables');
    }

    // OpenWeather Current Weather API call
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${beach.lat}&lon=${beach.lon}&appid=${apiKey}&units=imperial`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }
    
    const weatherData = (await response.json()) as OpenWeatherResponse;

    // Format the response for beach safety
    const result = {
      beach: beach.name,
      coordinates: { 
        latitude: beach.lat, 
        longitude: beach.lon 
      },
      weather: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed),
        windDirection: weatherData.wind.deg,
        windGust: weatherData.wind.gust ? Math.round(weatherData.wind.gust) : undefined,
        conditions: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        visibility: Math.round(weatherData.visibility / 1609.34 * 10) / 10, // Convert meters to miles
        pressure: weatherData.main.pressure,
        cloudCover: weatherData.clouds.all
      },
      safety: {
        swimmingConditions: getSafetyAssessment(weatherData),
        recommendations: getRecommendations(weatherData),
        uvWarning: getUVWarning(weatherData)
      },
      timestamp: new Date().toISOString()
    };

    return result;

  } catch (error) {
    throw new Error(`Failed to fetch beach weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Enhanced safety assessment using OpenWeather data
function getSafetyAssessment(weatherData: OpenWeatherResponse): string {
  const temp = weatherData.main.temp;
  const windSpeed = weatherData.wind.speed;
  const conditions = weatherData.weather[0].main.toLowerCase();
  const visibility = weatherData.visibility;
  
  // Dangerous conditions
  if (conditions.includes('thunderstorm') || conditions.includes('storm')) {
    return 'DANGEROUS - DO NOT SWIM';
  }
  
  // Poor conditions
  if (windSpeed > 15 || temp < 60 || conditions.includes('rain') || visibility < 1000) {
    return 'POOR - Swimming not recommended';
  }
  
  // Caution conditions
  if (windSpeed > 10 || temp < 70 || conditions.includes('drizzle') || weatherData.clouds.all > 80) {
    return 'CAUTION - Be careful, check with lifeguards';
  }
  
  // Good conditions
  return 'GOOD - Safe for swimming';
}

// Enhanced recommendations using OpenWeather data
function getRecommendations(weatherData: OpenWeatherResponse): string[] {
  const recommendations: string[] = [];
  const temp = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const windSpeed = weatherData.wind.speed;
  const windGust = weatherData.wind.gust;
  const conditions = weatherData.weather[0].main.toLowerCase();
  const humidity = weatherData.main.humidity;
  const visibility = weatherData.visibility;
  
  // Always include lifeguard reminder
  recommendations.push('🏊 Swim only when lifeguards are on duty (10 AM - 6 PM during beach season)');
  
  // Weather-specific warnings
  if (conditions.includes('thunderstorm')) {
    recommendations.push('⚠️ DANGER: Exit water immediately - lightning and severe weather risk');
  }
  
  if (conditions.includes('rain')) {
    recommendations.push('🌧️ Rainy conditions - poor visibility and potential water quality issues');
  }
  
  // Wind conditions
  if (windGust && windGust > 20) {
    recommendations.push('💨 Very strong wind gusts - dangerous wave conditions likely');
  } else if (windSpeed > 15) {
    recommendations.push('🌊 High winds create dangerous rip currents - extreme caution advised');
  } else if (windSpeed > 10) {
    recommendations.push('🌬️ Moderate winds may create strong currents - stay alert');
  }
  
  // Temperature guidance
  if (temp < 65) {
    recommendations.push('🧥 Cold air temperature - water will be very cold, hypothermia risk');
  } else if (temp < 75) {
    recommendations.push('🌡️ Cool conditions - water may feel cold, consider wetsuit');
  }
  
  if (feelsLike > 90) {
    recommendations.push('🔥 Very hot conditions - frequent water breaks and shade essential');
  } else if (feelsLike > 85) {
    recommendations.push('☀️ Hot day - apply sunscreen frequently, stay hydrated');
  }
  
  // Visibility and other conditions
  if (visibility < 1000) {
    recommendations.push('👁️ Poor visibility - difficulty seeing hazards in water');
  }
  
  if (humidity > 80 && temp > 80) {
    recommendations.push('💧 High humidity - heat exhaustion risk, take frequent breaks');
  }
  
  // General beach safety
  if (conditions.includes('clear') && temp > 75 && windSpeed < 10) {
    recommendations.push('✅ Excellent beach conditions - perfect for swimming and beach activities');
  }
  
  return recommendations;
}

// UV warning based on conditions
function getUVWarning(weatherData: OpenWeatherResponse): string | undefined {
  const temp = weatherData.main.temp;
  const cloudCover = weatherData.clouds.all;
  const now = new Date();
  const hour = now.getHours();
  
  // Peak UV hours with clear skies
  if (hour >= 10 && hour <= 16 && cloudCover < 30 && temp > 70) {
    return 'High UV exposure risk - use SPF 30+ sunscreen and reapply every 2 hours';
  }
  
  // Moderate UV conditions
  if (hour >= 9 && hour <= 17 && cloudCover < 70) {
    return 'Moderate UV exposure - sunscreen recommended';
  }
  
  return undefined;
}