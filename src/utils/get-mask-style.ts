/**
 * 获取遮罩样式
 *
 * @author yuzhanglong
 * @date 2021-09-14 18:07:12
 * @param element 遮罩的焦点元素，在视觉上体现为这个元素所在的部分可见，其它的部分都会被遮罩遮挡
 * @param container 遮罩的容器，即遮罩的作用范围
 */
export const getMaskStyle = (element: HTMLElement, container: HTMLElement) => {
  if (!element) {
    return {};
  }

  const {
    scrollHeight: containerScrollHeight,
    scrollWidth: containerScrollWidth,
    scrollTop: containerScrollTop,
    scrollLeft: containerScrollLeft
  } = container;

  const {
    height: elementHeight,
    width: elementWidth,
    left: elementLeft,
    top: elementTop
  } = element.getBoundingClientRect();

  const elementTopWithScroll = containerScrollTop + elementTop;
  const elementLeftWithScroll = containerScrollLeft + elementLeft;

  return {
    width: containerScrollWidth,
    height: containerScrollHeight,
    borderTopWidth: Math.max(elementTopWithScroll, 0),
    borderLeftWidth: Math.max(elementLeftWithScroll, 0),
    borderBottomWidth: Math.max(containerScrollHeight - elementHeight - elementTopWithScroll, 0),
    borderRightWidth: Math.max(containerScrollWidth - elementWidth - elementLeftWithScroll, 0)
  };
};
