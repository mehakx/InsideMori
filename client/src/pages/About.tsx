import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-4xl py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Visualization
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-primary">
          Inside Morii: A Cup of Connection
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            "Inside Morii: A Cup of Connection" visualizes how Morii Coffee, a small café in the East Village, 
            mirrors the invisible systems of human connection in New York City. Over four days, I recorded patterns 
            of people entering and leaving, their ages, conversations, and silences — data that became signals in a 
            living network. Each person is represented as a node of light: glowing, fading, drifting — like a heartbeat 
            of the café itself.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            The project translates these temporal rhythms into an evolving visualization where connections form and 
            dissolve over time. The café becomes a metaphor for the modern city: wired yet detached, full yet lonely. 
            Every node that fades reminds us of our shared impermanence — that even in connection, we are fleeting. 
            Through this ephemeral network, the work explores how technology mediates human warmth and how a simple 
            ritual like coffee still anchors us in a world that constantly dissolves into data.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-secondary">Concept</h2>
          <p className="text-base leading-relaxed mb-4">
            Morii Coffee isn't just a café — it's a living system of invisible connections. Each person who enters 
            becomes a signal in the network — some radiant, others fading — transmitting warmth, isolation, and presence. 
            Through data collected across four days, this project visualizes how human connection flickers in a city 
            wired for solitude. Each moment is temporary. Each presence, a signal that disappears.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-secondary">Visual Language</h2>
          <ul className="list-disc list-inside space-y-2 mb-6 text-base">
            <li><strong className="text-primary">Each Person = a Coffee Stain</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Organic, irregular shapes like real coffee rings on paper</li>
                <li>Color represents age group: Students (amber), Middle-aged (light coffee), Older (cold brew blue)</li>
                <li>Size reflects the number of people present at that hour</li>
                <li>Each stain has unique watercolor-like edges and subtle rotation</li>
              </ul>
            </li>
            <li><strong className="text-primary">Physics & Movement</strong>: Stains drift freely with realistic collision physics—when they bump into each other, they bounce and create sound</li>
            <li><strong className="text-primary">Sonic Interactions</strong>: 
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Same-age collisions produce harmonious, resonant tones (community resonance)</li>
                <li>Cross-generational encounters create different, more complex harmonies (intergenerational dialogue)</li>
                <li>The café becomes a living instrument where proximity creates music</li>
              </ul>
            </li>
            <li><strong className="text-primary">Temporal Layer</strong>: The visualization evolves to represent one full day at Morii, with stains fading over time like memories</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-secondary">Data & Methodology</h2>
          <p className="text-base leading-relaxed mb-4">
            Observational data was collected over four days at different times:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-base ml-4">
            <li>Day 1: 12-2pm (37→40 people)</li>
            <li>Day 2: 11am-12pm (15→36 people)</li>
            <li>Day 3: 4-6pm (30→25 people)</li>
            <li>Day 4: 9-10am (37→40 people)</li>
          </ul>
          <p className="text-base leading-relaxed mb-6">
            Each observation captured the number of people, age demographics, popular drinks (strawberry matcha, dalgona latte), 
            and the temporal rhythms of the space. The café's capacity is approximately 47-50 people, with peak times 
            occurring between 8-9am before lunch.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-secondary">Technical Implementation</h2>
          <p className="text-base leading-relaxed mb-6">
            Built with p5.js for generative visualization and physics simulation, React for interactive controls, and Tone.js for 
            collision-triggered sound synthesis. Each coffee stain is procedurally generated with irregular edges using Perlin noise, 
            creating organic shapes that feel hand-drawn. The collision detection system uses real-time physics to calculate impacts 
            and trigger contextual audio responses. The system offers both interactive exploration and cinematic auto-play modes, 
            allowing viewers to experience the data as both observers and participants in the network.
          </p>

          <div className="mt-12 p-6 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground italic">
              "Morii — the desire to capture a fleeting moment that cannot be captured."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
