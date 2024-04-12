import { useCallback, useEffect, useRef } from "react";

const useFixedNavigationBar = () => {
  const navigationBarRef = useRef<HTMLDivElement>();
  const pageRef = useRef<HTMLDivElement>();

  /**
   * Change size on resize
   */
  const onResize = useCallback(() => {
    const { current: navElement } = navigationBarRef,
      { current: pageElement } = pageRef;

    if (navElement && pageElement) {
      const { offsetHeight } = navElement;

      if (pageRef.current) {
        pageRef.current.style.paddingTop = `${offsetHeight}px`;
      }
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return [navigationBarRef, pageRef];
};

export default useFixedNavigationBar;
