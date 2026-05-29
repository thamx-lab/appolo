// ====================================================================
// ROLEX GYM - CUSTOM 3D MOUSE TILT HOOK
// This hook measures the position of the cursor over a card, and calculates
// rotation numbers to tilt the card towards the mouse. It creates a stunning
// high-end 3D effect!
// ====================================================================

import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate 3D tilt coordinates based on mouse hover.
 * @param {React.RefObject} ref - The React ref pointing to the DOM card container.
 * @param {Object} options - Customization parameters.
 * @param {number} options.maxAngle - Maximum tilt angle in degrees.
 * @returns {Object} { rotateX, rotateY, isHovered }
 */
export function useMouseTilt(ref, options = {}) {
  const { maxAngle = 12 } = options;

  // 1. Keep track of current angles and whether the mouse is over the card
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 2. Handle Mouse Move: Calculate the angle
    const handleMouseMove = (event) => {
      // Get the boundary dimensions of the card
      const rect = element.getBoundingClientRect();

      // Find the mouse's coordinate relative to the top-left of the card
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find the center point of the card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate how far the cursor is from the center, as a percentage
      const percentX = (x - centerX) / centerX; // value between -1 and 1
      const percentY = (y - centerY) / centerY; // value between -1 and 1

      // Calculate tilt angles!
      // Moving mouse right (positive percentX) tilts it horizontally to the right (positive rotateY)
      // Moving mouse down (positive percentY) tilts it vertically down (negative rotateX)
      const rotateX = -(percentY * maxAngle);
      const rotateY = percentX * maxAngle;

      setTilt({ rotateX, rotateY });
    };

    // 3. Handle Mouse Enter and Leave
    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Reset the card back to normal (perfectly flat)
      setTilt({ rotateX: 0, rotateY: 0 });
    };

    // 4. Register the event listeners on the card
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // 5. Clean up when this component gets unmounted
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, maxAngle]);

  return {
    rotateX: tilt.rotateX,
    rotateY: tilt.rotateY,
    isHovered
  };
}
