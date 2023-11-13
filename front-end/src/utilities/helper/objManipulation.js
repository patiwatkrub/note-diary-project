// This is variable to check object is empty or undefined or null
export const isObjectEmpty = (objectName) => {
    return (
        objectName &&
        Object.keys(objectName).length === 0 &&
        objectName.constructor === Object
    );
};