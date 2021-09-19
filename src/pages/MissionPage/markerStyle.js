const K_WIDTH = 40;
const K_HEIGHT = 40;

const greatPlaceStyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
};


const K_WIDTH_DRONE = 40;
const K_HEIGHT_DRONE = 40;

const greatPlaceStyle_DRONE = {
  position: 'absolute',
  width: K_WIDTH_DRONE,
  height: K_HEIGHT_DRONE,
  left: -K_WIDTH_DRONE / 2,
  top: -K_HEIGHT_DRONE / 2,

  border: '4px solid #3f51b5',
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
};

export {greatPlaceStyle,greatPlaceStyle_DRONE};
