import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling to sections
 * Provides consistent scroll behavior and error handling
 */
export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string, offset = 0) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.warn(`Failed to scroll to section ${sectionId}:`, error);
    }
  }, []);

  return { scrollToSection };
};
