import { useState, useEffect } from 'react';

export function useViewportMode() {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1024, height: 768 };
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = dimensions;

  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1023;
  const isDesktop = width >= 1024;
  const isTiny = width <= 400;
  const isWidescreen = width >= 1440;
  const isLandscapeMobile = height <= 520 && width > height && width <= 950;
  const isOptimal800 = Math.abs(width - 800) <= 60 && Math.abs(height - 600) <= 60;

  let resolutionBadge = `${width}x${height}`;
  let resolutionTitle = 'Early Web CRT Viewport';
  let chaosTag = 'DESKTOP 1998';
  let chaosMessage = 'PIPOS OPERATIONAL — MAGICAL NURSERY DESKTOP ACTIVE';

  if (isLandscapeMobile) {
    resolutionBadge = `${width}x${height} [WIDE POCKET]`;
    resolutionTitle = 'Landscape Mode Detected: Extra Dreamspace Available';
    chaosTag = 'LANDSCAPE DREAM';
    chaosMessage = 'LANDSCAPE MODE DETECTED — EXTRA DREAMSPACE AVAILABLE.';
  } else if (isTiny) {
    resolutionBadge = `${width}x${height} [TINY DISPLAY]`;
    resolutionTitle = 'Display Area Tiny: Pip is Squeezing the Nursery';
    chaosTag = 'TINY NURSERY';
    chaosMessage = 'DISPLAY AREA: TINY — PIP IS SQUEEZING THE NURSERY.';
  } else if (isOptimal800) {
    resolutionBadge = `${width}x${height} [OPTIMAL 800x600]`;
    resolutionTitle = 'Optimal Dream Resolution: Best Viewed at 800x600';
    chaosTag = 'OPTIMAL RES';
    chaosMessage = 'OPTIMAL DREAM RESOLUTION: BEST VIEWED AT 800x600 ACHIEVED.';
  } else if (isMobile) {
    resolutionBadge = `${width}x${height} [POCKET DREAM]`;
    resolutionTitle = 'Pocket Dream Mode: 1998 Computer in Your Pocket';
    chaosTag = 'POCKET PIPOS';
    chaosMessage = 'MOBILE DREAM MODE — PIPOS HAS ENTERED POCKET SIZE.';
  } else if (isTablet) {
    resolutionBadge = `${width}x${height} [TABLET ADAPTER]`;
    resolutionTitle = 'Tablet Adaptive Mode: Balanced Desktop Window';
    chaosTag = 'TABLET PIPOS';
    chaosMessage = 'TABLET MODE: ADAPTING DREAM WORKSPACE INTELLIGENTLY.';
  } else if (isWidescreen) {
    resolutionBadge = `${width}x${height} [WIDESCREEN]`;
    resolutionTitle = 'Nursery Widescreen Mode: Panoramic Dreamspace';
    chaosTag = 'WIDESCREEN';
    chaosMessage = 'NURSERY WIDESCREEN MODE — LUXURY DREAMING ROOM ACTIVE.';
  }

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isTiny,
    isWidescreen,
    isLandscapeMobile,
    isOptimal800,
    resolutionBadge,
    resolutionTitle,
    chaosTag,
    chaosMessage,
  };
}
