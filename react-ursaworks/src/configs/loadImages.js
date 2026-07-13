// Resolve images from src/assets by folder + filename.
// import.meta.glob is Vite's replacement for webpack's require.context.
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const loadImage = (folder, imageName) => {
  const key = `../assets/${folder}/${imageName}`;
  if (!(key in images)) {
    console.error(`Image ${imageName} not found in folder ${folder}`);
    return null;
  }
  return images[key];
};

export default loadImage;
