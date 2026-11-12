import createMulter from "../configs/upload.multer.js";

const uploadImage = createMulter({
    pasta: 'images',
    tiposPermitidos: ['image/png', 'image/jpeg'],
    tamanhoArquivo: 10 * 1024 * 1024 //10 MB
}).single('image');

export default uploadImage;