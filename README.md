# Safe-Swim NYC 🏖️

A comprehensive multi-agent AI system for NYC beach safety, combining real-time weather analysis, water quality monitoring, and predictive modeling. Currently in Phase 1 with working weather intelligence for all 9 NYC public beaches, building toward a full ecosystem of specialized agents for data scraping, analysis, ML predictions, and real-time public health dashboards.

## 🌊 Current Features (Phase 1)

- **Real-time Weather Analysis**: Current conditions using exact GPS coordinates
- **Swimming Safety Assessment**: GOOD/CAUTION/POOR/DANGEROUS ratings based on multiple factors
- **Beach-Specific Intelligence**: Tailored recommendations for each NYC beach
- **Comprehensive Coverage**: All 9 official NYC public beaches across 4 boroughs
- **Wind & Current Analysis**: Rip current risk assessment based on wind conditions
- **Temperature Safety**: Hypothermia risk evaluation for air/water temperatures
- **Weather Pattern Recognition**: Thunderstorm, visibility, and UV warnings

## 🏖️ Supported Beaches

### Brooklyn (3)
- Coney Island Beach
- Brighton Beach  
- Manhattan Beach

### Queens (1)
- Rockaway Beach

### Bronx (1)
- Orchard Beach

### Staten Island (4)
- South Beach
- Midland Beach
- Cedar Grove Beach
- Wolfe's Pond Beach

## 🚀 Quick Start

### Prerequisites
- Node.js v20.0+
- OpenWeather API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

```bash
# Clone the repository
git clone https://github.com/alessandra-s/safe-swim-nyc.git
cd safe-swim-nyc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenWeather API key to .env
```

### Environment Variables

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4111` to access the Mastra playground.

## 🛠️ Technology Stack

### Core Framework
- **[Mastra](https://mastra.ai)**: AI agent framework and orchestration
- **TypeScript**: Type-safe development with full IntelliSense
- **[Zod](https://zod.dev)**: Schema validation and static type inference
- **Node.js v20+**: Runtime environment

### APIs & Data
- **OpenWeather API**: Real-time weather data with GPS precision
- **NYC Open Data**: Planned integration for water quality datasets
- **MTA APIs**: Future transportation integration

### Development Tools
- **Cursor IDE**: AI-powered development environment
- **Mastra Playground**: Live testing and debugging interface
- **Git**: Version control with GitHub integration

### Architecture Patterns
- **Multi-Agent Systems**: Coordinated AI agents with specialized roles
- **Tool Composition**: Modular tools for specific data sources
- **Schema-First Design**: Zod contracts define agent interactions

## 🏗️ Architecture

### Core Components

```
src/
├── agents/
│   └── weather-agent.ts        # Main beach safety agent
├── tools/
│   ├── weather-tool.ts         # Generic weather tool (Open-Meteo)
│   └── beachWeatherTool.ts     # NYC beach-specific tool (OpenWeather)
└── workflows/
    └── weather-workflow.ts     # Activity planning workflow
```

### Tool Architecture

The system uses two complementary weather tools:

1. **`weatherTool`** (Generic)
   - Uses Open-Meteo API (free, no key required)
   - Handles general location queries
   - Fallback for non-beach locations

2. **`beachWeatherTool`** (Beach-Specific)
   - Uses OpenWeather API with exact GPS coordinates
   - Provides detailed beach safety analysis
   - Includes swimming condition assessments

## 🔧 Key Features

### Precise Location Handling
Each beach has exact GPS coordinates to ensure accurate weather data:

```typescript
const beachCoordinates = {
  'coney island': { lat: 40.5755, lon: -73.9707, name: 'Coney Island Beach' },
  'rockaway beach': { lat: 40.5892, lon: -73.8131, name: 'Rockaway Beach' },
  // ... all 9 beaches
};
```

### Safety Assessment Algorithm
Swimming conditions are evaluated based on:
- Air temperature (hypothermia risk)
- Wind speed and gusts (rip current danger)
- Weather conditions (storms, rain)
- Visibility (safety hazards)
- Cloud cover (UV considerations)

### Structured Output with Zod
Type-safe responses ensure consistent data structure:

```typescript
outputSchema: z.object({
  beach: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  weather: z.object({
    temperature: z.number(),
    windSpeed: z.number(),
    conditions: z.string()
  }),
  safety: z.object({
    swimmingConditions: z.string(),
    recommendations: z.array(z.string())
  })
})
```

## 🧪 Example Usage

### Basic Beach Query
```
User: "What are the conditions at Coney Island?"

Agent: 
🏖️ Coney Island Beach
Temperature: 72°F (Feels like 75°F)
Wind: 8 mph from the southwest
Conditions: Partly cloudy
Swimming Conditions: GOOD - Safe for swimming
```

### Beach Comparison
```
User: "Compare Rockaway Beach and Orchard Beach for tomorrow"

Agent: [Provides detailed comparison with safety assessments for both locations]
```

## 🗺️ Project Roadmap

### 🎯 Phase 1: Foundation (Weeks 1-2) - ✅ **CURRENT PHASE**
**Goal**: Basic weather + beach condition system working

**Completed:**
- ✅ Enhanced Weather Agent covering all NYC beaches specifically
- ✅ Beach-specific weather interpretation and safety assessments
- ✅ Real-time conditions using exact GPS coordinates

**Next Steps:**
- **Data Scraping Agent**: Scrapes NYC Open Data for beach-related datasets
  - Focuses on enterococcus levels (key water quality metric)
  - Pulls transportation data (buses, ferries, trains to beaches)
- **Simple Beach Status Agent**: Combines weather + water quality data
  - Gives simple "Good/Caution/Bad" ratings with emoji system

### 🤖 Phase 2: Multi-Agent System (Weeks 3-6)
**Agent Hierarchy:**
```
Project Manager Agent (Supervisor)
├── Data Scraper Agent
├── Data Analyst Agent  
├── ML Prediction Agent
└── Dashboard Agent
```

**Each Agent's Role:**
- **Project Manager**: Coordinates data flow, decides priorities
- **Data Scraper**: Responsible for scraping NYC Open Data datasets
- **Data Analyst**: Finds patterns, creates the "story in the data"
- **ML Engineer**: Predicts enterococcus levels, seasonal patterns
- **Dashboard Agent**: Creates real-time visualizations

### 🚀 Phase 3: Advanced Features (Weeks 7-12)
- **Predictive Models**: Water quality predictions, seasonal alerts
- **Transportation Integration**: Real-time MTA transit to beaches
- **Social Scoring**: Dynamic agent communication patterns
- **Mobile-Friendly Dashboard**: End goal public health tool

### 🎮 Phase 4: Production (Future)
- **Public API**: Open endpoints for other developers
- **Mobile App**: Native iOS/Android applications
- **Alert System**: Push notifications for beach conditions
- **Multi-City Expansion**: Framework for other coastal cities

## 🤝 Contributing

This project documents learning modern AI development tools. Contributions, suggestions, and learning insights are welcome!

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in the Mastra playground
5. Submit a pull request

## 📖 Learning Resources

This project was built while learning:
- [Mastra Documentation](https://mastra.ai/docs)
- [Zod Schema Validation](https://zod.dev)
- [OpenWeather API](https://openweathermap.org/api)
- TypeScript best practices for AI applications

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- NYC Department of Health for beach safety standards
- OpenWeather for reliable weather data
- Mastra team for an excellent developer experience
- The open-source community for amazing tools and libraries

---

**Stay safe in the water! 🌊**