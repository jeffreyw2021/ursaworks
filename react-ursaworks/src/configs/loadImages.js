// utils/loadImages.js
const images = require.context('../assets', true, /\.(png|jpe?g|svg)$/);

const loadImage = (folder, imageName) => {
    try {
        // Construct the path using the folder and image name
        return images(`./${folder}/${imageName}.png`);
    } catch (err) {
        console.error(`Image ${imageName} not found in folder ${folder}`);
        return null;
    }
};

export default loadImage;

