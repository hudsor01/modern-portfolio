import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import type { Project } from '@/types/project';

interface ReactSlickCarouselProps {
  projects: Project[];
}

const ReactSlickCarousel: React.FC<ReactSlickCarouselProps> = ({ projects }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // Additional settings as needed
  };

  return (
    <Slider {...settings}>
      {projects.map((project) => (
        <div key={project.id}>
          {project.image && (
            <div className="w-full aspect-[16/9] relative"> {/* Added a wrapper for aspect ratio */}
              <Image 
                src={project.image} 
                alt={project.title} 
                layout="fill" // Changed to fill to respect aspect ratio wrapper
                objectFit="cover" // Or "contain" depending on desired behavior
                className="rounded-md" // Optional: if images should be rounded
              />
            </div>
          )}
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </Slider>
  );
};

export default ReactSlickCarousel;
