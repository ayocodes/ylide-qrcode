// From a medium article Responsive Pixel- An alternative to Media Query for Responsive Resizing by Qi Chen.
function responsivePixel(pixel: number) {
  return `calc(0.8px + 0.05335vmin * ${pixel})`;
}

export default responsivePixel;
