export const sendMessageToN8N = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK;

  if (!webhookUrl) {
    console.error("Falta VITE_N8N_CHAT_WEBHOOK en .env");
    return "Error de configuración: Falta URL del webhook.";
  }

  try {
    // Simplify history for n8n if needed, or send as is
    const payload = {
      message,
      history: history.map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user', // standardizing roles
        content: h.parts[0].text
      }))
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText}`);
    }

    // Expecting n8n to return JSON with { "respuesta": "..." }
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      // Clean parsing for user-facing text
      return json.respuesta || json.output || json.text || json.message || (typeof json === 'string' ? json : JSON.stringify(json));
    } catch {
      return text;
    }

  } catch (error) {
    console.error("Error enviando a n8n:", error);
    return "Lo siento, hubo un error al procesar tu solicitud con el agente principal.";
  }
};

export const getUpsellSuggestion = async (products: string[]): Promise<string> => {
  if (products.length === 0) return "";

  const message = `El cliente tiene estos productos en el carrito: ${products.join(', ')}. 
    Actúa como un vendedor experto y sugiere UN solo producto complementario o accesorio corto que combine bien. 
    Responde solo con la sugerencia y el motivo breve (máximo 15 palabras). Ej: "Cinturón de cuero, combina con los jeans."`;

  // Re-use the existing connection but with empty history context as this is a one-off prompt
  return sendMessageToN8N(message, []);
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  const message = `Genera una descripción comercial, atractiva y breve (máximo 20 palabras) para un producto llamado "${name}" de la categoría "${category}".`;
  return sendMessageToN8N(message, []);
};
