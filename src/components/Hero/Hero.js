import { useEffect, useState } from 'react';
import './Hero.css';
import Recuadro from './Recuadro/Recuadro';
import Titulo from './Titulo/Titulo';

const slides = [
  {
    title: 'Reseñas musicales en vivo',
    image: 'https://imgs.search.brave.com/NzkXBB0p1HH99bxg27rQUBsaNsAAORmWyoObTG3qKQ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L2ZvdG8tZ3JhdGlz/L2dlbnRlLWNvbmNp/ZXJ0by10ZXh0dXJh/LXN1cGVycG9zaWNp/b24taHVtb181Mzg3/Ni0xMjY4NTYuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MCZx/PTgw',
  },
  {
    title: 'Descubre álbumes y críticas',
    image: 'https://imgs.search.brave.com/GRIYiDp4ZKnZM2Br-SqOxz9ZB-JdwpbtIt5aOVxCCoc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aW1naXguaGVhZG91/dC5jb20vbWVkaWEv/aW1hZ2VzL2Y0Nzc1/Y2JjZDIyYTgzMmRi/YzAzYmE2OWNmY2Fk/OTI0LTIwMDQ1LWxv/bmRvbi1hYmJhLXZv/eWFnZS0wMi5qcGc_/YXV0bz1mb3JtYXQm/cT05MCZmaXQ9Y3Jv/cCZjcm9wPWZhY2Vz',
  },
  {
    title: 'Playlists y opiniones reales',
    image: 'https://imgs.search.brave.com/DGiEpnYdWkpRWKbn7ijJTA10FnWuXcL6MEd144UHH7U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjIy/NDcxNTI1Ni9waG90/by9zYW4tanVhbi1w/dWVydG8tcmljby1i/YWQtYnVubnktcGVy/Zm9ybXMtb25zdGFn/ZS1kdXJpbmctbmln/aHQtb25lLW9mLWJh/ZC1idW5ueS1uby1t/ZS1xdWllcm8taXIu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUxtSEszSUc4c2Ro/OW9DVGFUV015bGd0/OGhabXhqWmZvSzNR/UmZLbFdtb009',
  },
  {
    title: 'Comparte tu música favorita',
    image: 'https://imgs.search.brave.com/k3HEnLePwWqfBdghH6tjwogysk_BEt6REmLmOPBrDmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kaXNu/ZXkuaW1hZ2VzLmVk/Z2UuYmFtZ3JpZC5j/b20vcmlwY3V0LWRl/bGl2ZXJ5L3YyL3Zh/cmlhbnQvZGlzbmV5/LzAxOWIxMTJlLWQw/ZjUtNzI1NC1iM2Rm/LWI1ZjJmZTllNTM1/NC9jb21wb3NlP2Zv/cm1hdD13ZWJwJndp/ZHRoPTI1NjA',
  },
];

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${slides[activeIndex].image})` }}
    >
      <div className="hero-overlay" />
      <Recuadro>
        <Titulo />
        <div className="hero-carousel-controls">
          <p className="hero-slide-label">{slides[activeIndex].title}</p>
          <div className="hero-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Recuadro>
    </section>
  );
}

export default Hero;
