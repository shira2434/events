import { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      ↑
    </button>
  );
}
