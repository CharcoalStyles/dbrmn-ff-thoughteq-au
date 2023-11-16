export const getElementSize = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    scrollHeight: el.scrollHeight,
    scrollWidth: el.scrollWidth,
  };
};
