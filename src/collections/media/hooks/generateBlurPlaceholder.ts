import { CollectionAfterChangeHook } from "payload";
import sharp from "sharp";

export const generateBlurPlaceholder: CollectionAfterChangeHook = async ({
    doc,
    req,
    operation,
}) => {
    // Skip non-images and if blur already exists
    if (
        !doc.filename ||
        !doc.mimeType?.startsWith('image/') ||
        doc.blurDataURL
    ) {
        return doc;
    }

    try {
        req.payload.logger.info(`Generating blur placeholder for: ${doc.filename}`);

        if (!doc.url) {
            req.payload.logger.warn(`Skipping ${doc.filename} - no URL found`);
            return doc;
        }

        // Ensure we have a full URL for fetching
        const fullUrl = doc.url.startsWith('http')
            ? doc.url
            : `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.url}`;

        // Fetch the uploaded image
        const imageBuffer = await fetchImageBuffer(fullUrl);

        // Generate 10x10 blur placeholder
        const blurBuffer = await sharp(imageBuffer)
            .resize(10, 10, { fit: 'inside' })
            .blur(1)
            .png({ quality: 20 })
            .toBuffer();

        // Convert to base64 data URL
        const base64 = `data:image/png;base64,${blurBuffer.toString('base64')}`;

        // Use setTimeout to avoid recursion (explained below)
        setTimeout(async () => {
            try {
                await req.payload.update({
                    collection: 'media',
                    id: doc.id,
                    data: { blurDataURL: base64 } as any,
                });
                req.payload.logger.info(`✅ Blur placeholder saved for: ${doc.filename}`);
            } catch (delayedUpdateError) {
                req.payload.logger.error(`❌ Failed to save blur placeholder: ${(delayedUpdateError as Error).message}`);
            }
        }, 100);

        return doc;

    } catch (error) {
        req.payload.logger.error(`Failed to generate blur placeholder: ${(error as Error).message}`);
        return doc;
    }
};

async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
}