import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import PropTypes from 'prop-types';
import carouselExciteImageOne from '../assets/images/space-excite-one.png';
import carouselImageTwo from '../assets/images/carousel-two.jpg';
import carouselImageThree from '../assets/images/carousel-three.jpg';

function CarouselPage() {
  const items = [
    {
      image_source: carouselExciteImageOne,
      name: 'Random Name #1',
      description: 'R E D E F I N I N G'
    },
    {
      image_source: carouselImageTwo,
      name: 'Random Name #2',
      description:
        'Encounter a new world of technology A universe where we are the greatest With State of the Art Rockets and Space Ships'
    },
    {
      image_source: carouselImageThree,
      name: 'Random Name #3',
      description: 'Explore the Red Planet and its idiosyncracies '
    }
  ];

  return (
    <Carousel swipe sx={{ width: '100vw', height: '50vw' }}>
      {items.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item({ item }) {
  return (
    <Paper sx={{ position: 'relative' }}>
      <img
        src={item.image_source}
        className="h-full w-full bg-cover bg-center"
        alt="space-carousel"
      />

      <p className="centered text-bold absolute p-4 text-white">
        {item.description}
      </p>
    </Paper>
  );
}
Item.propTypes = {
  item: PropTypes.shape({
    image_source: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })
};
Item.defaultProps = {
  item: 'john'
};
export default CarouselPage;
