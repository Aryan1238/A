/**
 * PrepPilot - PDF Export Utility
 * Uses html2pdf.js to capture DOM elements into an ATS report PDF document.
 */

import html2pdf from 'html2pdf.js';

export const exportElementToPdf = async (elementId, fileName = 'PrepPilot-ATS-Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    window.print();
    return;
  }

  const opt = {
    margin: [10, 10, 10, 10],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.warn('html2pdf export failed, falling back to window.print():', error);
    window.print();
  }
};
