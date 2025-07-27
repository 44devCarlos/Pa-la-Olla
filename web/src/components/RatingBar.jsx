import React from "react";
import { FaStar } from "react-icons/fa";

export default function RatingBar({ stars, count, maxCount }) {
  const percentage = (count / maxCount) * 100;

  return (
    <div className="flex items-center">
      <div className="flex w-full items-center justify-between">
        <span className="w-9 pr-2">
          {stars}
          <FaStar className="inline-block text-yellow-500"></FaStar>
        </span>
        <div className="relative w-[2rem] md:w-[15rem] lg:w-[25rem] xl:w-[35rem]">
          <div
            style={{
              width: `${percentage}%`,
            }}
            className="absolute z-10 h-2 rounded-full bg-yellow-500"
          />
          <div className="absolute h-2 w-full rounded-full bg-red-800/20"></div>
        </div>
        <span className="pl-2">{count}</span>
      </div>
    </div>
  );
}
