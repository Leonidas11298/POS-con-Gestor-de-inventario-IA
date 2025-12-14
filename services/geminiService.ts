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
