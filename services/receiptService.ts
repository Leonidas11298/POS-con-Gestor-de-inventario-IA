import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, OrderItem } from '../types'; // Assuming these exist, matching OrderDetails structure
import { getStoreSettings } from './settingsService';

export const generateReceipt = async (
    orderId: number,
    date: string,
    customerName: string,
    items: any[], // OrderItem with product details
    total: number
) => {
    // 1. Fetch Settings
    const settings = await getStoreSettings();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    let yPos = 20;

    // Logo (if exists and is valid image)
    if (settings?.logo_url) {
        try {
            // Add image (simplified, requires valid CORS or base64 usually, sticking to layout logic)
            // doc.addImage(settings.logo_url, 'JPEG', 10, 10, 30, 30);
            // For MVP web, remote images in jsPDF can be tricky with CORS. 
            // We'll focus on text header first.
        } catch (e) {
            console.warn("Could not load logo for PDF", e);
        }
    }

    // Store Name
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(settings?.store_name || 'Flup POS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Store Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    if (settings?.address) {
        doc.text(settings.address, pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;
    }
    if (settings?.phone || settings?.email) {
        doc.text(`${settings.phone || ''} | ${settings.email || ''}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
    }

    doc.line(10, yPos, pageWidth - 10, yPos);
    yPos += 10;

    // --- Order Details ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Recibo de Venta #${orderId}`, 14, yPos);

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date(date).toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 7;
    doc.text(`Cliente: ${customerName}`, 14, yPos);
    yPos += 10;

    // --- Items Table ---
    const tableColumn = ["Producto", "Cant.", "Precio Unit.", "Total"];
    const tableRows = items.map(item => {
        // Handle different data structures (Order Details vs Cart vs RLS format)
        const name = item.product_name || item.name || item.variants?.products?.name || 'Item';
        return [
            name,
            item.quantity,
            `$${item.unit_price || item.price}`, // Handle unit_price (DB) or price (Cart)
            `$${((item.quantity) * (item.unit_price || item.price)).toFixed(2)}`
        ];
    });

    autoTable(doc, {
        startY: yPos,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
        styles: { fontSize: 10 },
    });

    // --- Totals ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${total.toLocaleString()}`, pageWidth - 14, finalY, { align: 'right' });

    // --- Footer ---
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text("¡Gracias por su compra!", pageWidth / 2, finalY + 20, { align: 'center' });

    // Save
    doc.save(`Recibo_Orde_${orderId}.pdf`);
};

export const generateEmailLink = (
    orderId: number,
    customerEmail: string | undefined,
    customerName: string
) => {
    const subject = encodeURIComponent(`Recibo de Compra - Orden #${orderId}`);
    const body = encodeURIComponent(`Hola ${customerName},\n\nGracias por tu compra. Adjunto encontrarás el recibo de tu orden #${orderId}.\n\nSaludos,\nEl equipo.`);
    return `mailto:${customerEmail || ''}?subject=${subject}&body=${body}`;
};
