import { useState, useEffect, useCallback } from "react";

export function useTypewriter(text: string, speed: number = 30, startDelay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startTyping = useCallback(() => {
    setHasStarted(true);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const delayTimer = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay, hasStarted]);

  return { displayedText, isComplete, hasStarted, startTyping };
}
