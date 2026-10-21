/**
 * PrepPilot - PDF Text Extraction Service
 * Uses pdf-parse to extract raw textual content from uploaded PDF buffers.
 */

const pdfParseModule = require('pdf-parse');

/**
 * Extracts plain text from an in-memory PDF buffer.
 * Defensively handles both pdf-parse v1 (function) and v2 (PDFParse class)
 *
 * @param {Buffer} pdfBuffer - Binary buffer of the uploaded PDF
 * @returns {Promise<string>} - Extracted plain text
 */
async function extractTextFromPDF(pdfBuffer) {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error('A valid PDF buffer is required for text extraction');
  }

  let extractedText = '';

  try {
    // Check if pdf-parse is v2 (PDFParse class exported)
    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: pdfBuffer });
      const result = await parser.getText();
      extractedText = (result && typeof result.text === 'string') ? result.text : String(result || '');
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    } else if (typeof pdfParseModule === 'function') {
      // Classic pdf-parse v1
      const data = await pdfParseModule(pdfBuffer);
      extractedText = data.text || '';
    } else if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
      const data = await pdfParseModule.default(pdfBuffer);
      extractedText = data.text || '';
    } else {
      throw new Error('Unsupported pdf-parse export structure');
    }

    // Clean up excessive whitespace and null characters
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\u0000/g, '')
      .replace(/[ \t]+/g, ' ')
      .trim();

    if (!cleanedText || cleanedText.length < 20) {
      throw new Error(
        'The uploaded PDF contains little or no extractable text. Please ensure it is not an image-only/scanned PDF.'
      );
    }

    return cleanedText;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

module.exports = {
  extractTextFromPDF
};
