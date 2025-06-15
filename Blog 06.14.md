# Building My First AI Agent: From Zero to Beach Safety Expert in One Evening

*How I learned Mastra, TypeScript schemas, and AI tool integration while building a real-world NYC beach safety application*

---

## The Journey: From AI Hackathon to Multi-Agent Architecture

This project started at an AI hackathon where my team and I built a Streamlit dashboard displaying enterococcus levels across NYC beaches. We leveraged the NYC Department of Health's Beach Surveillance and Monitoring Program data—a dataset containing enterococcus measurements from beach water samples collected from April through September each year, all available through NYC Open Data.

Our goal was straightforward: see how AI can speed up data analysis workflows. After placing 2nd and walking away with a copy of "Principles of Building AI Agents" by Mastra CEO Sam Bhabhwat, I was inspired to take this project to the next level—outlining a comprehensive multi-agent system.

Here's what I learned evolving **Safe-Swim NYC** from a simple dashboard into an intelligent AI agent ecosystem using Mastra.

## From Dashboard to Intelligence: Why AI Agents?

Our hackathon dashboard successfully visualized enterococcus data, but it was static. Users had to interpret charts and correlate multiple data sources manually. I realized that what beach-goers really needed was:

- Real-time analysis that combines weather AND water quality
- Intelligent recommendations based on multiple safety factors  
- Conversational interface that answers specific questions like "Is it safe to swim at Coney Island right now?"
- Predictive capabilities for planning beach visits

This vision required moving beyond dashboards to **intelligent agents** that could reason about data, not just display it.

## Discovery #1: Mastra Makes AI Development Feel Like Magic

I'd never heard of [Mastra](https://mastra.ai) before starting this project. The promise was intriguing: "build AI applications and features quickly" with TypeScript. Setting it up was surprisingly smooth:

```bash
npx create-mastra@latest
```

The CLI walked me through:
- Choosing OpenAI as my provider
- Setting up project structure
- Configuring the development environment

Within minutes, I had a playground running at `localhost:4111` with a working weather agent. The seamless integration between the browser playground and my Cursor IDE was immediately apparent—I could write code in Cursor and see it live in the playground instantly.

## Discovery #2: Zod Schemas Are a Game-Changer

Coming from a non-TypeScript background, I was skeptical about schemas. But Zod's TypeScript-first approach clicked immediately when I started working with GPS coordinates:

```typescript
const beachCoordinates: Record<string, { lat: number; lon: number; name: string }> = {
  'coney island': { lat: 40.5755, lon: -73.9707, name: 'Coney Island Beach' },
  'brighton beach': { lat: 40.5776, lon: -73.9614, name: 'Brighton Beach' },
  'manhattan beach': { lat: 40.5888, lon: -73.9378, name: 'Manhattan Beach' },
  // ... all 9 NYC beaches
};
```

The beauty was in the output schema definition:

```typescript
outputSchema: z.object({
  beach: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  weather: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    windSpeed: z.number(),
    conditions: z.string()
  }),
  safety: z.object({
    swimmingConditions: z.string(),
    recommendations: z.array(z.string())
  })
})
```

This wasn't just type safety—it was **contract-driven development**. The schema became the source of truth for what my tool would return, making the API predictable and the code self-documenting.

## Discovery #3: Tool Integration Is Surprisingly Simple

The most satisfying moment was watching my custom beach weather tool come to life. In Mastra, creating a tool follows a beautiful pattern:

```typescript
export const beachWeatherTool = createTool({
  id: 'beachWeatherTool',
  description: 'Get current weather conditions for specific NYC beaches using exact coordinates',
  inputSchema: z.object({
    beachName: z.string().describe('Name of the NYC beach')
  }),
  outputSchema: /* our schema from above */,
  execute: async ({ context }) => {
    return await getBeachWeather(context.beachName);
  },
});
```

But the real magic happened in the agent configuration. Adding my custom tool was literally one line:

```typescript
// Before: only had generic weather tool
tools: { weatherTool }

// After: added beach-specific intelligence  
tools: { weatherTool, beachWeatherTool }
```

That's it. The agent immediately understood it had two tools available and started choosing the appropriate one based on context.

## Problem-Solving in Real Time

### The Location Challenge

Initially, the generic weather tool struggled with beach names. "Orchard Beach, Bronx" returned "Location not found" errors. This led me to realize I needed exact coordinates rather than hoping weather APIs would understand NYC beach geography.

### The API Key Discovery

When I first created my custom tool, I used OpenWeather API but forgot environment variables don't automatically propagate. The error message was clear: `"OpenWeather API key not configured"`. 

Rather than debug environment setup, I discovered Mastra already had a working weather tool using Open-Meteo (free, no API key needed). But since I'd already set up OpenWeather, I decided to leverage its superior data quality for beach safety analysis.

### The Tool Selection Problem

My agent kept using the wrong tool. The fix was embarrassingly simple—being more explicit in the agent instructions:

```typescript
instructions: `
  **TOOL USAGE RULES:**
  - For NYC beaches: ALWAYS use beachWeatherTool
  - For other locations: use weatherTool
  - When users ask about beach conditions: use beachWeatherTool
`
```

## The Satisfying Result

After debugging, the system worked beautifully:

**User Query:** *"Tomorrow, I am planning to go to Orchard Beach or Rockaway Beach. Could you please provide the differences in conditions?"*

**Agent Response:** 
- Automatically called `beachWeatherTool` for both beaches
- Fetched real weather data using exact GPS coordinates
- Provided safety assessments: "POOR - Swimming not recommended"
- Gave specific recommendations about cold temperatures and wind conditions
- Compared conditions between locations

## What I Learned About Modern AI Development

### 1. **Frameworks Matter**
Mastra handled the complexity of agent orchestration, tool management, and conversation flow. I could focus on domain logic rather than infrastructure.

### 2. **Type Safety Enables Confidence**
Zod schemas made my tools predictable. When the agent called my tool, I knew exactly what shape the data would be.

### 3. **The Playground-to-Production Pipeline**
Testing in the browser playground while developing in Cursor created an incredibly tight feedback loop. Changes appeared instantly.

### 4. **Tool Composability Is Powerful**
Having both a generic weather tool and a specialized beach tool gave my agent flexibility. It could handle "weather in Paris" and "is Coney Island safe for swimming" with equal competence.

## Next Steps: From Hackathon MVP to Production System

This evening's work proved the core concept, building on our hackathon foundation. The roadmap includes:

- **Water Quality Integration**: Connecting the enterococcus data from our original hackathon project
- **Multi-Agent Architecture**: Implementing the vision inspired by Sam Bhabhwat's principles
- **Predictive Analytics**: Moving beyond current conditions to forecasting
- **Mobile Dashboard**: Evolving our Streamlit prototype into a real-time public health tool

## The Evolution: From Data Visualization to AI Orchestration

Building this taught me the difference between displaying data and orchestrating intelligence. Our hackathon project showed *what* the data looked like. This AI agent system explains *what it means* and *what to do about it*. 

With the right tools (Mastra), schemas (Zod), and APIs (OpenWeather + NYC Open Data), you can evolve from hackathon prototype to production-ready AI system in a matter of hours.

The code is [available on GitHub](https://github.com/alessandra-s/safe-swim-nyc), documenting the evolution from hackathon dashboard to intelligent agent system.



---

*Built with: Mastra, TypeScript, Zod, OpenWeather API, NYC Open Data, and inspiration from winning an AI hackathon and Sam Bhabhwat's agent principles.*