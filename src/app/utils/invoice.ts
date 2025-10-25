/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from 'pdfkit';
import AppError from '../errorHelpers/AppError'; // Assuming this path is correct

// --- 1. Constants and Colors ---
const ORGANIZATION_NAME = 'Tourista';
const PRIMARY_COLOR = '#2196F3'; // Blue (Header, Total Line)
const SECONDARY_COLOR = '#333333'; // Dark Gray (Text)
const LIGHT_GRAY = '#f9f9f9'; // Table header background
const SEPARATOR_GRAY = '#dddddd'; // Table border

// --- 2. Helper Functions for Formatting ---

/**
 * Formats a Date object or string into a readable date string.
 * @param {Date | string} dateString
 * @returns {string} Formatted date string
 */
const formatDate = (dateString: Date): string => {
    if (!dateString) return 'N/A';
    try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e: any) {
        console.log(e);
        return String(dateString);
    }
};

/**
 * Formats a number into a currency string (BDT - Bangladeshi Taka).
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number') return 'TK 0.00'; // Changed fallback to TK 0.00
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'BDT', // Changed currency to BDT (Bangladeshi Taka)
        minimumFractionDigits: 2
    });
};

// --- 3. Interface (as provided by the user) ---
export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
    invoiceURL: string;
}

// --- 4. Main PDF Generation Function (Refactored to match provided structure) ---
export const generatePDF = async (invoiceData: IInvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            // DOC Initialization
            const doc = new PDFDocument({ size: "A5", margin: 40 });
            // Using Buffer array for stream output
            const buffer: Buffer[] = []; 

            // Event Handlers for stream processing
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));

            // --- PDF Content Generation ---

            const docWidth = doc.page.width;
            const docHeight = doc.page.height;
            const margin = doc.page.margins.left; // 40
            let y = 0; // Current vertical position

            // --- Header (Branding and Title) ---
            const headerHeight = 70;
            y = 0;
            doc.rect(0, y, docWidth, headerHeight)
               .fill(PRIMARY_COLOR);

            doc.fillColor('#ffffff')
               .fontSize(32)
               .font('Helvetica-Bold')
               .text(ORGANIZATION_NAME, 0, 15, { align: 'center' });

            doc.fontSize(16)
               .font('Helvetica')
               .text('Your Adventure Awaits', 0, 48, { align: 'center' });

            y = headerHeight + 20; // Start content below header

            // --- Invoice Details (Transaction ID and Date) ---
            doc.fillColor(SECONDARY_COLOR)
               .fontSize(20)
               .font('Helvetica-Bold')
               .text('Invoice Details', margin, y);

            y += 30;

            // Transaction ID
            doc.fontSize(14).font('Helvetica-Bold').text('Transaction ID:', margin, y);
            doc.font('Helvetica').text(invoiceData.transactionId, margin + 160, y);

            // Booking Date
            y += 20;
            doc.font('Helvetica-Bold').text('Booking Date:', margin, y);
            doc.font('Helvetica').text(formatDate(invoiceData.bookingDate), margin + 160, y);

            y += 40;

            // --- Billed To ---
            doc.fillColor(SECONDARY_COLOR)
               .fontSize(18)
               .font('Helvetica-Bold')
               .text('Billed To:', margin, y);

            y += 25;
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .text(invoiceData.userName, margin, y);

            y += 40;

            // --- Line Item Table Header ---
            const tableTop = y;
            const tableLeft = margin;
            const tableWidth = docWidth - 2 * margin; 
            const cellPadding = 10;
            const descriptionWidth = tableWidth * 0.6;
            const guestsWidth = tableWidth * 0.2;
            const amountWidth = tableWidth * 0.2;
            const rowHeight = 30;

            // Draw header background
            doc.rect(tableLeft, tableTop, tableWidth, rowHeight)
               .fill(LIGHT_GRAY);

            // Header Text
            doc.fillColor(SECONDARY_COLOR)
               .fontSize(12)
               .font('Helvetica-Bold')
               .text('Description', tableLeft + cellPadding, tableTop + 10, { width: descriptionWidth });
            
            doc.text('Guests', tableLeft + descriptionWidth, tableTop + 10, { width: guestsWidth, align: 'center' });
            
            doc.text('Amount', tableLeft + descriptionWidth + guestsWidth, tableTop + 10, { width: amountWidth - cellPadding, align: 'right' });

            // Draw separator line
            doc.strokeColor(SEPARATOR_GRAY).lineWidth(1).moveTo(tableLeft, tableTop + rowHeight).lineTo(tableLeft + tableWidth, tableTop + rowHeight).stroke();
            
            y = tableTop + rowHeight;

            // --- Line Item Content ---
            doc.fillColor(SECONDARY_COLOR)
               .font('Helvetica');

            doc.text(`Tour: ${invoiceData.tourTitle}`, tableLeft + cellPadding, y + cellPadding, { width: descriptionWidth });

            doc.text(String(invoiceData.guestCount), tableLeft + descriptionWidth, y + cellPadding, { width: guestsWidth, align: 'center' });

            doc.text(formatCurrency(invoiceData.totalAmount), tableLeft + descriptionWidth + guestsWidth, y + cellPadding, { width: amountWidth - cellPadding, align: 'right' });

            y += 4; // Move down after the line item


            // --- Footer ---
            const footerY = docHeight - 130;
            const footerHeight = 80;

            doc.rect(0, footerY, docWidth, footerHeight)
               .fill(SECONDARY_COLOR);

            doc.fillColor('#bbbbbb')
               .fontSize(12)
               .font('Helvetica')
               .text(`Thank you for booking your adventure with ${ORGANIZATION_NAME}.`, 0, footerY + 20, { align: 'center' });

            doc.text('Contact us at support@tourista.com or call 1-800-TOUR-ADV', 0, footerY + 40, { align: 'center' });

            // Finalize PDF
            doc.end();
        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(400, `PDF creation error ${error.message}`);
    }
}
