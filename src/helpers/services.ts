import httpClient from "./httpClient";

export const uploadCloudImages = async (images: File[], path?: string) => {
    const formData = new FormData();

    console.log(images[0] instanceof File); // should be true

    images.forEach(image => {
        if (!(image instanceof File)) {
            throw new Error('Invalid file type — not a File');
        }
        formData.append('files', image, image.name);
    });

    if (path) formData.append('path', path);

    const { data } = await httpClient.post(`http://localhost:3000/cloudinary/upload-multiple-files`, formData);
    return data;
};


// export const deleteCloudImage = async (publicId) => {
//     console.log("publicId", publicId)
//     const { data } = await httpClient.delete(`cloudinary/delete-file`, {
//         data: {
//             publicId
//         }
//     })
//     return data
// }
