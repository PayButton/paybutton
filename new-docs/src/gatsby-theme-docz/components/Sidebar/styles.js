import * as base from 'gatsby-theme-docz/src/components/Sidebar/styles';

export const global = base.global;
export const overlay = base.overlay;

export const wrapper = (...props) => {
  const baseResult = base.wrapper(...props);
  baseResult.px = 3;
  baseResult.py = 2;
  return baseResult;
}