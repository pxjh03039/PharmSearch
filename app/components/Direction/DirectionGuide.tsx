"use client";

import UpArrowImg from "@/app/common/assets/images/up-arrow.png";
import DownArrowImg from "@/app/common/assets/images/down-arrow.png";
import LeftArrowImg from "@/app/common/assets/images/left-arrow.png";
import RightArrowImg from "@/app/common/assets/images/right-arrow.png";
import UpLeftArrowImg from "@/app/common/assets/images/up-left.png";
import UpRightArrowImg from "@/app/common/assets/images/up-right-arrow.png";
import DownLeftArrowImg from "@/app/common/assets/images/down-left-arrow.png";
import DownRightArrowImg from "@/app/common/assets/images/down-right-arrow.png";
import LeftTurnImg from "@/app/common/assets/images/left-turn.png";
import RightTurnImg from "@/app/common/assets/images/right-turn.png";
import UTurnImg from "@/app/common/assets/images/u-turn.png";
import Image, { type StaticImageData } from "next/image";

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

const leftTurn = new Set([1, 5]);
const rightTurn = new Set([2, 6]);
const uTurn = new Set([3]);
const north = new Set([12, 29, 41, 81]);
const south = new Set([23, 35, 75]);
const east = new Set([20, 32, 72, 83]);
const west = new Set([26, 38, 78, 82]);
const northEast = new Set([18, 19, 30, 31, 70, 71]);
const southEast = new Set([21, 22, 33, 34, 73, 74]);
const southWest = new Set([24, 25, 36, 37, 76, 77]);
const northWest = new Set([27, 28, 39, 40, 79, 80]);

const getDirectionArrow = (type?: number): StaticImageData | null => {
  if (type !== undefined) {
    if (uTurn.has(type)) return UTurnImg; // u-turn
    if (leftTurn.has(type)) return LeftTurnImg; // left turn
    if (rightTurn.has(type)) return RightTurnImg; // right turn
    if (north.has(type)) return UpArrowImg; // up
    if (south.has(type)) return DownArrowImg; // down
    if (east.has(type)) return RightArrowImg; // right
    if (west.has(type)) return LeftArrowImg; // left
    if (northEast.has(type)) return UpRightArrowImg; // up-right
    if (southEast.has(type)) return DownRightArrowImg; // down-right
    if (southWest.has(type)) return DownLeftArrowImg; // down-left
    if (northWest.has(type)) return UpLeftArrowImg; // up-left
  }
  return null;
};

export default function DirectionGuide({ guides }: Props) {
  if (!guides || guides.length === 0) return null;

  return (
    <div className="direction-steps">
      {guides.map((guide: any, index: number) => {
        const arrow = getDirectionArrow(guide.type);
        const showRoadIndex = guide.type !== 100 && guide.type !== 101;
        return (
          <div key={index} className="direction-step">
            <div className={`step-icon step-type-${guide.type}`}>
              {arrow ? (
                <Image
                  src={arrow}
                  alt="direction"
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              ) : (
                <span className="step-icon-empty" aria-hidden="true" />
              )}
            </div>
            <div className="step-content">
              <div className="step-guidance">
                {showRoadIndex && (
                  <span className="step-road-index">{guide.road_index}.</span>
                )}
                {guide.guidance}
              </div>
              {guide.name && <div className="step-road-name">{guide.name}</div>}
              {guide.distance > 0 && (
                <div className="step-meta">
                  {(guide.distance / 1000).toFixed(1)}km
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
