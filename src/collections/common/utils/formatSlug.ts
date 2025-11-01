export const formatSlug = (val: string): string => {
    return val
        .toLowerCase()
        .trim()
        .replace(/ /g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
}