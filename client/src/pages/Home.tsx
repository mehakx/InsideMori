import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Info, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import WifiVisualization from "@/components/WifiVisualization";
import { moriiData } from "@/data/moriiData";

export default function Home() {
  const [mode, setMode] = useState<'interactive' | 'cinematic'>('interactive');
  const [currentDay, setCurrentDay] = useState(0);
  
  const handlePrevDay = () => {
    if (currentDay > 0) setCurrentDay(currentDay - 1);
  };
  
  const handleNextDay = () => {
    if (currentDay < moriiData.length - 1) setCurrentDay(currentDay + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Visualization */}
      <WifiVisualization mode={mode} dayIndex={currentDay} key={currentDay} />
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-start">
          {/* Title */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <h1 className="text-2xl font-bold text-foreground">Inside Morii</h1>
            <p className="text-sm text-muted-foreground">A Cup of Connection</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === 'interactive' ? 'cinematic' : 'interactive')}
              className="bg-card/80 backdrop-blur-sm border-border/50"
            >
              {mode === 'interactive' ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Cinematic Mode
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Interactive Mode
                </>
              )}
            </Button>
            
            <Link href="/about">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-card/80 backdrop-blur-sm border-border/50"
              >
                <Info className="mr-2 h-4 w-4" />
                About
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      {mode === 'interactive' && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-4">
          <Button
            variant="default"
            size="icon"
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            className="bg-gray-900/90 hover:bg-gray-800 text-white border-2 border-gray-700 shadow-lg disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-gray-700 shadow-lg">
            <p className="text-sm font-medium text-white">
              Day {currentDay + 1} of {moriiData.length}
            </p>
          </div>
          
          <Button
            variant="default"
            size="icon"
            onClick={handleNextDay}
            disabled={currentDay === moriiData.length - 1}
            className="bg-gray-900/90 hover:bg-gray-800 text-white border-2 border-gray-700 shadow-lg disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {/* Instructions - only show in cinematic mode */}
      {mode === 'cinematic' && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              Watching the cinematic journey • Each collision plays a unique sound
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
