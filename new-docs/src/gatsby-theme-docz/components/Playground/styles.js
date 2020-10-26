import * as base from 'gatsby-theme-docz/src/components/Playground/styles';

export const { error, previewWrapper, preview, button, link } = base;

export const wrapper = (...props) => {
  const baseResult = base.wrapper(...props);
  baseResult.background = 'none';
  return baseResult;
}

export const wrapperBorder = () => ({});

export const buttons = {
  display: 'none',
};

export const editor = (...props) => {
  const baseResult = base.editor(...props);
  baseResult.fontSize = '14px';
  return baseResult;
}