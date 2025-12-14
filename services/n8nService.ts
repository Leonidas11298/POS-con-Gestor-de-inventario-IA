export const sendReorderRequest = async (sku: string, quantity: number, reason: string) => {
    const webhookUrl = 'https://n8npanel.iamigo.com.mx/webhook/reorder-request';

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sku,
                quantity,
                reason
            }),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // n8n might return JSON or text
        const text = await response.text();
        return { success: true, message: 'Solicitud enviada correctamente a n8n.', data: text };
    } catch (error) {
        console.error('Error enviando a n8n:', error);
        return { success: false, message: 'Fallo al enviar la solicitud de reabastecimiento.' };
    }
};
