export const getNthParent = (element, n) => {
    try {
        let currentElement = element;
        for (let i = 0; i < n; i++) {
            if (!currentElement.parentElement) {
                throw new Error('Parent element does not exist');
            }
            currentElement = currentElement.parentElement;
        }
        return currentElement;
    } catch (error) {
        console.error(error);
        return null;
    }
};
