import { useState, useCallback } from 'react';

export function useDreamMission() {
  const [dreamMemoryComplete, setDreamMemoryComplete] = useState(false);
  const [lullabyComplete, setLullabyComplete] = useState(false);
  const [routeComplete, setRouteComplete] = useState(false);
  const [nightlightComplete, setNightlightComplete] = useState(false);
  const [dreamDelivered, setDreamDelivered] = useState(false);

  const completeDreamMemory = useCallback(() => {
    setDreamMemoryComplete(true);
  }, []);

  const completeLullaby = useCallback(() => {
    setLullabyComplete(true);
  }, []);

  const completeRoute = useCallback(() => {
    setRouteComplete(true);
  }, []);

  const completeNightlight = useCallback(() => {
    setNightlightComplete(true);
  }, []);

  const deliverDream = useCallback(() => {
    setDreamDelivered(true);
  }, []);

  // Determine linear magical flow stage
  // DREAM WAITING → DREAM MEMORY → LULLABY → DREAM ROUTER → NIGHTLIGHT → DREAM DELIVERED
  let currentStage = 'DREAM WAITING';
  if (dreamDelivered) {
    currentStage = 'DREAM DELIVERED (01:03)';
  } else if (nightlightComplete) {
    currentStage = 'NIGHTLIGHT ACTIVE';
  } else if (routeComplete) {
    currentStage = 'ROUTE DISPATCHED';
  } else if (lullabyComplete) {
    currentStage = 'LULLABY HARMONIZED';
  } else if (dreamMemoryComplete) {
    currentStage = 'DREAM RECONSTRUCTED';
  }

  const completedCount = [dreamMemoryComplete, lullabyComplete, routeComplete, nightlightComplete].filter(Boolean).length;

  return {
    dreamMemoryComplete,
    lullabyComplete,
    routeComplete,
    nightlightComplete,
    dreamDelivered,
    completedCount,
    currentStage,
    completeDreamMemory,
    completeLullaby,
    completeRoute,
    completeNightlight,
    deliverDream,
  };
}
