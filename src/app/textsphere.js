import { useEffect } from 'react';
import "./textsphere.css";

// Importing TagCloud package
import TagCloud from "TagCloud";

const TextShpere = () => {
  // Animation settings for Text Cloud
  useEffect(() => {
    return () => {
      const container = ".tagcloud";
      const texts = [
        "Stronger Together",
        "Reps",
        "Sets",
        "Spotter",
        "Warm-up",
        "Cool-down",
        "Cardio",
        "Training",
        "Flexibility",
        "Cooldown",
        "Workout",
        "Weights",
        "Basketball",
        "Core Strength",
        "HIIT",
        "Tabata",
        "Plyometrics",
        "Muscle hypertrophy",
        "Rest Day",
        "Form",
        "Compound exercises",
        
      ];

      const options = {
        radius: 700,
        maxSpeed: "fast",
        initSpeed: "fast",
        keep: true,
      };

      TagCloud(container, texts, options);
    };
  }, []);

  return (
    <>
      <div className="text-shpere">
        <span className="tagcloud"></span>
      </div>
    </>
  );
};

export default TextShpere;