"use client";
import { useRef } from "react";

export const useDragScroll = () => {
  const ref = useRef(null);
  const isDragging = useRef(false);

  const onMouseDown = (e) => {
    const slider = ref.current;
    slider.isDown = true;
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
    isDragging.current = false;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.isDown = false;
  };

  const onMouseUp = () => {
    if (ref.current) ref.current.isDown = false;
    setTimeout(() => (isDragging.current = false), 0);
  };

  const onMouseMove = (e) => {
    const slider = ref.current;
    if (!slider?.isDown) return;
    e.preventDefault();
    isDragging.current = true;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 1.5;
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging };
};
