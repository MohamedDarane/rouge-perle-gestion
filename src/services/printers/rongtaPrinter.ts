
import { Order, TableOrder } from '../../types';

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// RONGTA printer specific formatting - optimized for thermal printers
export const formatRONGTAPrint = (order: Order | TableOrder, isTable: boolean = false): void => {
  const isTableOrder = 'tableNumber' in order;
  const cafeName = isTableOrder ? "1ER BOULEVARD" : "LA PERLE ROUGE";
  const location = isTableOrder ? "GUELIZ" : "DOHA ABOUAB MARRAKECH";

  // Thermal printer optimized HTML - 58mm width typical
  const thermalTicket = `
    <html>
    <head>
      <title>Ticket Thermique - ${cafeName}</title>
      <style>
        @media print {
          @page { margin: 0; size: 58mm auto; }
          body { margin: 0 !important; }
        }
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 5mm;
          width: 48mm;
          font-size: 12px;
          line-height: 1.2;
          color: #000;
          background: white;
        }
        
        .thermal-ticket {
          width: 100%;
          text-align: center;
        }
        
        .thermal-header {
          border-bottom: 1px dashed #000;
          padding-bottom: 5px;
          margin-bottom: 5px;
        }
        
        .cafe-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .location {
          font-size: 10px;
          margin-bottom: 3px;
        }
        
        .date-time {
          font-size: 9px;
          margin-bottom: 3px;
        }
        
        .table-info {
          font-size: 12px;
          font-weight: bold;
          margin: 3px 0;
        }
        
        .agent-info {
          font-size: 9px;
          margin-bottom: 5px;
        }
        
        .thermal-items {
          text-align: left;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 5px 0;
          margin: 5px 0;
        }
        
        .thermal-item {
          margin-bottom: 3px;
          font-size: 11px;
        }
        
        .item-line1 {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        
        .item-line2 {
          font-size: 9px;
          color: #666;
        }
        
        .thermal-total {
          border-top: 1px solid #000;
          padding-top: 5px;
          margin-top: 5px;
          font-size: 14px;
          font-weight: bold;
        }
        
        .thermal-barcode {
          margin: 10px 0;
          font-size: 8px;
          word-break: break-all;
        }
        
        .barcode-bars {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.5px;
          margin: 5px 0;
        }
        
        .thermal-footer {
          margin-top: 10px;
          font-size: 10px;
          border-top: 1px dashed #000;
          padding-top: 5px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        .agent-copy {
          margin-top: 15px;
        }
        
        .agent-header {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 5px;
          border-bottom: 1px solid #000;
          padding-bottom: 3px;
        }
        
        .agent-items {
          text-align: left;
          margin: 5px 0;
        }
        
        .agent-item {
          font-size: 10px;
          margin-bottom: 2px;
        }
      </style>
    </head>
    <body>
      <!-- Customer ticket -->
      <div class="thermal-ticket">
        <div class="thermal-header">
          <div class="cafe-name">${cafeName}</div>
          <div class="location">${location}</div>
          <div class="date-time">${formatDate(order.date)}</div>
          ${isTableOrder ? `<div class="table-info">TABLE ${(order as TableOrder).tableNumber}</div>` : ''}
          <div class="agent-info">Serveur: ${order.agentName}</div>
        </div>
        
        <div class="thermal-items">
          ${order.items.map((item) => `
            <div class="thermal-item">
              <div class="item-line1">
                <span>${item.drinkName}</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
              <div class="item-line2">
                ${item.quantity} x ${item.unitPrice.toFixed(2)} MAD
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="thermal-total">
          TOTAL: ${order.total.toFixed(2)} MAD
        </div>
        
        <div class="thermal-barcode">
          <div class="barcode-bars">||||  ||  ||||  ||||||</div>
          <div>ID: ${order.id.substring(0, 8)}</div>
        </div>
        
        <div class="thermal-footer">
          Merci de votre visite!
        </div>
      </div>

      <!-- Agent copy -->
      <div class="thermal-ticket page-break agent-copy">
        <div class="agent-header">${cafeName} - COPIE</div>
        ${isTableOrder ? `<div class="table-info">TABLE ${(order as TableOrder).tableNumber}</div>` : ''}
        <div class="date-time">${formatDate(order.date)}</div>
        <div class="agent-info">Agent: ${order.agentName}</div>
        
        <div class="agent-items">
          ${order.items.map((item, index) => `
            <div class="agent-item">
              ${index + 1}. ${item.drinkName} x${item.quantity}
            </div>
          `).join('')}
        </div>
        
        <div class="thermal-barcode">
          <div class="barcode-bars">||||  ||  ||||  ||||||</div>
          <div>${order.id.substring(0, 8)}</div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(thermalTicket);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 600);
    }, 500);
  } else {
    alert("Veuillez autoriser les fenêtres popup pour imprimer le ticket.");
  }
};
