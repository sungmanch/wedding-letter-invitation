'use client';

import { useState, useCallback } from 'react';
import type {
  CustomFrame,
  PersonImage,
  PersonType,
  FrameEditorStep,
  FrameEditorState,
} from './types';

function createInitialFrame(): CustomFrame {
  return {
    id: `frame-${Date.now()}`,
    name: '프레임 1',
    groomImage: null,
    brideImage: null,
    backgroundColor: '#ffffff',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function createPersonImage(type: PersonType, originalUrl: string): PersonImage {
  return {
    type,
    originalUrl,
    croppedUrl: null,
    position: {
      x: type === 'groom' ? 50 : 200,
      y: 100,
      width: 150,
      height: 200,
      rotation: 0,
    },
  };
}

const STEP_ORDER: FrameEditorStep[] = [
  'groom-upload',
  'groom-crop',
  'bride-upload',
  'bride-crop',
  'arrange',
  'name',
  'complete',
];

export function useFrameEditor(initialFrame?: CustomFrame) {
  const [state, setState] = useState<FrameEditorState>({
    step: 'groom-upload',
    frame: initialFrame || createInitialFrame(),
    isLoading: false,
    error: null,
  });

  const setStep = useCallback((step: FrameEditorStep) => {
    setState((prev) => ({ ...prev, step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.step);
      const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1);
      return { ...prev, step: STEP_ORDER[nextIndex], error: null };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.step);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return { ...prev, step: STEP_ORDER[prevIndex], error: null };
    });
  }, []);

  const setGroomImage = useCallback((imageUrl: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        groomImage: createPersonImage('groom', imageUrl),
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const setBrideImage = useCallback((imageUrl: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        brideImage: createPersonImage('bride', imageUrl),
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const setGroomCroppedImage = useCallback((croppedUrl: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        groomImage: prev.frame.groomImage
          ? { ...prev.frame.groomImage, croppedUrl }
          : null,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const setBrideCroppedImage = useCallback((croppedUrl: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        brideImage: prev.frame.brideImage
          ? { ...prev.frame.brideImage, croppedUrl }
          : null,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const updateGroomPosition = useCallback(
    (position: Partial<PersonImage['position']>) => {
      setState((prev) => ({
        ...prev,
        frame: {
          ...prev.frame,
          groomImage: prev.frame.groomImage
            ? {
                ...prev.frame.groomImage,
                position: { ...prev.frame.groomImage.position, ...position },
              }
            : null,
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const updateBridePosition = useCallback(
    (position: Partial<PersonImage['position']>) => {
      setState((prev) => ({
        ...prev,
        frame: {
          ...prev.frame,
          brideImage: prev.frame.brideImage
            ? {
                ...prev.frame.brideImage,
                position: { ...prev.frame.brideImage.position, ...position },
              }
            : null,
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const setFrameName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        name,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setState((prev) => ({
      ...prev,
      frame: {
        ...prev.frame,
        backgroundColor,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState({
      step: 'groom-upload',
      frame: createInitialFrame(),
      isLoading: false,
      error: null,
    });
  }, []);

  const canGoNext = useCallback(() => {
    const { step, frame } = state;

    switch (step) {
      case 'groom-upload':
        return !!frame.groomImage?.originalUrl;
      case 'groom-crop':
        return !!frame.groomImage?.croppedUrl;
      case 'bride-upload':
        return !!frame.brideImage?.originalUrl;
      case 'bride-crop':
        return !!frame.brideImage?.croppedUrl;
      case 'arrange':
        return true;
      case 'name':
        return !!frame.name.trim();
      default:
        return false;
    }
  }, [state]);

  const getStepInfo = useCallback(() => {
    const stepInfoMap: Record<
      FrameEditorStep,
      { title: string; description: string; personType?: PersonType }
    > = {
      'groom-upload': {
        title: '신랑 사진 업로드',
        description: '배경이 제거된 신랑 사진을 업로드해주세요',
        personType: 'groom',
      },
      'groom-crop': {
        title: '신랑 사진 위치 지정',
        description: '프레임에 들어갈 영역을 선택해주세요',
        personType: 'groom',
      },
      'bride-upload': {
        title: '신부 사진 업로드',
        description: '배경이 제거된 신부 사진을 업로드해주세요',
        personType: 'bride',
      },
      'bride-crop': {
        title: '신부 사진 위치 지정',
        description: '프레임에 들어갈 영역을 선택해주세요',
        personType: 'bride',
      },
      arrange: {
        title: '위치 조정',
        description: '신랑, 신부 사진의 위치와 크기를 조정해주세요',
      },
      name: {
        title: '프레임 이름',
        description: '프레임 이름을 입력해주세요',
      },
      complete: {
        title: '완료',
        description: '프레임이 저장되었습니다',
      },
    };

    return stepInfoMap[state.step];
  }, [state.step]);

  const getCurrentStepIndex = useCallback(() => {
    return STEP_ORDER.indexOf(state.step);
  }, [state.step]);

  const getTotalSteps = useCallback(() => {
    return STEP_ORDER.length - 1; // Exclude 'complete'
  }, []);

  return {
    state,
    setStep,
    nextStep,
    prevStep,
    setGroomImage,
    setBrideImage,
    setGroomCroppedImage,
    setBrideCroppedImage,
    updateGroomPosition,
    updateBridePosition,
    setFrameName,
    setBackgroundColor,
    setLoading,
    setError,
    reset,
    canGoNext,
    getStepInfo,
    getCurrentStepIndex,
    getTotalSteps,
  };
}
