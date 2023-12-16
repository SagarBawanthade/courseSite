import DataUriParser from "datauri/parser.js";
import path from "path";


const getDataUri = (file) => {
    const parser = new DataUriParser();
    //const extName = path.extname(file.originalName);
    const extName = file.originalName ? path.extname(file.originalName) : '';
    console.log(extName);

    return parser.format(extName, file.buffer);
};



export default getDataUri;