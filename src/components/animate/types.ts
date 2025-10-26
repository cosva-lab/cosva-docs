// ----------------------------------------------------------------------

import { Easing } from 'framer-motion';

type EaseType = Easing;

export type VariantsType = {
  distance?: number;
  durationIn?: number;
  durationOut?: number;
  easeIn?: EaseType;
  easeOut?: EaseType;
};

export type TranHoverType = {
  duration?: number;
  ease?: EaseType;
};

export type TranEnterType = {
  durationIn?: number;
  easeIn?: EaseType;
};

export type TranExitType = {
  durationOut?: number;
  easeOut?: EaseType;
};

export type BackgroundType = {
  colors?: string[];
  duration?: number;
  ease?: EaseType;
};
