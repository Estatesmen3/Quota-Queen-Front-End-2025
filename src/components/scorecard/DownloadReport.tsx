import React from 'react';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

const DownloadReportPDF = ({ report }) => {
  const handleDownload = () => {
    const htmlContent = marked.parse(report.content);
  
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          position: relative;
        }
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px 50px; /* Increased side padding */
          color: #333;
          line-height: 1.4;
          margin: 0;
          width: 100%;
          max-width: 100%;
        }
  
        h1, h2, h3 {
          color: #1a237e;
          margin-top: 15px;
          margin-bottom: 8px;
          page-break-after: avoid;
        }
  
        h2, h3 {
          padding-top: 10px; /* Add space above headings */
        }
  
        p {
          margin-bottom: 8px;
        }
  
        strong {
          display: inline-block;
          margin-bottom: 4px;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 11px;
          page-break-inside: avoid;
        }
  
        th, td {
          border: 1px solid #ddd;
          padding: 6px;
          text-align: left;
          page-break-inside: avoid;
        }
  
        th {
          background-color: #f5f5f5;
          font-size: 11px;
        }
  
        hr {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 18px 0;
          page-break-after: avoid;
        }
  
        .metadata {
          font-size: 13px;
          margin-bottom: 15px;
          padding: 0 10px; /* Added side padding */
        }
  
        .report-content {
          margin-top: 15px;
          padding: 0 10px; /* Added side padding */
        }
  
        .score-line {
          margin-bottom: 12px;
          font-weight: bold;
          page-break-after: avoid;
        }
  
        /* Page break handling */
        .section-container {
          page-break-inside: avoid;
          margin-bottom: 20px;
          padding: 5px 0; /* Added vertical padding */
        }
        
        .page-break-avoid {
          page-break-inside: avoid;
        }
        
        /* Final sections styling */
        .final-section {
          page-break-inside: avoid;
          margin-top: 20px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
      </style>
  
      <div class="metadata">
        <h1>Sales Evaluation Report</h1>
        <p><strong>Model:</strong> ${report.model}</p>
        <p><strong>Score:</strong> ${report.final_score}</p>
        <p><strong>Timestamp:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        <hr />
      </div>
  
      <div class="report-content">
        ${htmlContent.replace(
          /(###? [^]+?)(?=###? |<\/div>|$)/gs, 
          (match) => `<div class="section-container page-break-avoid">${match.replace(
            /Score: (\d+\/\d+)/g, 
            '<div class="score-line">Score: $1</div>'
          )}</div>`
        ).replace(
          /## \*\*🏁 FINAL TOTAL:[\s\S]*?$/,
          '<div class="final-section page-break-avoid">$&</div>'
        )}
      </div>
    `;
  
    html2pdf().from(container).set({
      margin: [0.8, 1.5, 0.8, 1.5],
      filename: 'Sales_Evaluation_Report.pdf',
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.final-section', // Ensure final section doesn't break
        avoid: ['table', '.section-container', '.page-break-avoid'] 
      }
    }).save();
  };

  return (
    <button onClick={handleDownload} className="px-4 py-2 dopamine-gradient-1 text-white rounded hover:bg-blue-700">
      Download Report
    </button>
  );
};

export default DownloadReportPDF;
