
import React, { useEffect, useRef } from 'react';

const FloatingHearts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const createHeart = () => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.classList.add('text-2xl', 'absolute', 'animate-float', 'opacity-70');
      
      // Random position from bottom
      const startPosX = Math.random() * 100; // 0-100% from left
      heart.style.left = `${startPosX}%`;
      heart.style.bottom = '0';
      
      // Random animation duration
      const animDuration = 3 + Math.random() * 7; // 3-10s
      heart.style.animation = `float ${animDuration}s ease-in-out`;
      
      // Random starting delay
      heart.style.animationDelay = `${Math.random() * 2}s`;
      
      // Add to container
      container.appendChild(heart);
      
      // Remove after animation
      setTimeout(() => {
        if (container.contains(heart)) {
          container.removeChild(heart);
        }
      }, animDuration * 1000);
    };
    
    // Create hearts periodically
    const interval = setInterval(createHeart, 1000);
    
    return () => {
      clearInterval(interval);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    ></div>
  );
};

export default FloatingHearts;
