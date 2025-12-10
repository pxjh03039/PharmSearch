"use client";

type Guide = {
  name: string;
  x: number;
  y: number;
  distance: number;
  duration: number;
  type: number;
  guidance: string;
  road_index: number;
};

type Props = {
  guides: Guide[];
};

export default function DirectionGuide({ guides }: Props) {
  if (!guides || guides.length === 0) return null;

  return (
    <div className="direction-steps">
      {guides.map((guide: any, index: number) => (
        <div key={index} className="direction-step">
          <div className={`step-icon step-type-${guide.type}`}></div>
          <div className="step-content">
            <div className="step-guidance">{guide.guidance}</div>
            {guide.name && <div className="step-road-name">{guide.name}</div>}
            {guide.distance > 0 && (
              <div className="step-meta">
                약 {(guide.distance / 1000).toFixed(1)}km ·{" "}
                {Math.round(guide.duration / 60)}분
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
