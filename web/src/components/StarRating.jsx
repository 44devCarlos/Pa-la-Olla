import { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ maxStars = 5, onChange, value = 0, readOnly = false, tamaño}) => {
  const [rating, setRating] = useState(value);

    useEffect(() => {
      setRating(value);
    }, [value]);

  const handleClick = (e, index) => {
    if (readOnly) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const isHalf = clickX < width / 2;
    const value = isHalf ? index + 0.5 : index + 1;
    setRating(value);
    onChange?.(value);
  };

  const renderStar = (index) => {
    const size = tamaño ?? 32;
    if (rating >= index + 1) {
      return <FaStar className="text-yellow-400" size={size} />;
    } else if (rating >= index + 0.5) {
      return <FaStarHalfAlt className="text-yellow-400" size={size} />;
    } else {
      return <FaRegStar className="text-gray-300" size={size} />;
    }
  };

  return (
    <div className="flex mb-4">
      {Array.from({ length: maxStars }, (_, index) => (
        <div
          key={index}
          onClick={(e) => handleClick(e, index)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {renderStar(index)}
        </div>
      ))}
    </div>
  );
};

export default StarRating;
