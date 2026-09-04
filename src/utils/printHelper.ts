import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Triggers native browser print dialog for the target element (or whole page print mode).
 */
export function triggerPrint() {
  window.print();
}

/**
 * Generates high-definition PDF from an HTML element using html2canvas and jsPDF.
 */
export async function generateBillPDF(elementId: string, filename: string = 'KMS_Bill.pdf'): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // 3x Ultra-High Resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 800
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create portrait PDF matching the exact aspect ratio of the paper slip
    const slipWidthMm = 80;
    const slipHeightMm = (canvas.height * slipWidthMm) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [slipWidthMm, slipHeightMm]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, slipWidthMm, slipHeightMm);
    
    // Save file
    pdf.save(filename);

    return pdf.output('blob');
  } catch (err) {
    console.error('PDF Generation Failed:', err);
    return null;
  }
}

/**
 * Shares bill via Web Share API if supported.
 */
export async function shareBillPDF(elementId: string, title: string) {
  const pdfBlob = await generateBillPDF(elementId, `${title.replace(/\s+/g, '_')}.pdf`);
  if (!pdfBlob) return;

  if (typeof navigator.share === 'function') {
    const file = new File([pdfBlob], `${title}.pdf`, { type: 'application/pdf' });
    try {
      await navigator.share({
        title,
        text: `K.M.S. SEA FOODS - Bill ${title}`,
        files: [file]
      });
    } catch (err) {
      console.log('Share canceled or failed:', err);
    }
  } else {
    alert('Web Share API not supported on this device/browser. PDF downloaded instead.');
  }
}
