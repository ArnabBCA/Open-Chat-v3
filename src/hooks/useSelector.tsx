import {
  useSelector as reduxUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { RootState } from '../main';

export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;
