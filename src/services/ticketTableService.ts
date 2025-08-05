import { TableOrder } from '../types';

// Générer un code-barres simple
const generateBarcode = (orderId: string): string => {
  const barcodeData = `|||| || |||| | || |||| || | |||| | || |||| |||| | || ||||`;
  return `<div style="font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 1px; text-align: center; margin: 10px 0; transform: scaleX(0.5);">${barcodeData}</div>
          <div style="font-size: 12px; text-align: center; color: #666; margin-bottom: 15px;">${orderId}</div>`;
};

export const printTableTicket = (order: TableOrder): void => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const customerTicketContent = `
    <html>
    <head>
      <title>Ticket - Le 1er Boulevard</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: white;
          color: black;
          width: 320px;
          margin: 0 auto;
        }
        .ticket {
          text-align: center;
          border: 2px solid #daa520;
          padding: 25px;
          background: white;
        }
        .header {
          border-bottom: 3px solid #daa520;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .cafe-name {
          font-size: 28px;
          font-weight: bold;
          color: #daa520;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .address {
          font-size: 16px;
          color: #333;
          margin-bottom: 5px;
        }
        .order-info {
          margin: 25px 0;
          padding: 15px;
          background: #f8f8f8;
          border-radius: 8px;
          border: 1px solid #daa520;
        }
        .table-info {
          font-size: 22px;
          font-weight: bold;
          color: #000;
          margin-bottom: 15px;
        }
        .items {
          text-align: left;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 18px;
          padding: 8px 0;
          border-bottom: 1px dotted #ccc;
        }
        .item-details {
          flex: 1;
        }
        .item-name {
          font-weight: bold;
          color: #000;
        }
        .item-price {
          font-weight: bold;
          color: #daa520;
        }
        .total {
          border-top: 3px solid #daa520;
          padding-top: 15px;
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #daa520;
        }
        .footer {
          margin-top: 25px;
          padding-top: 15px;
          border-top: 2px solid #daa520;
          font-size: 16px;
          color: #666;
        }
        .date {
          font-size: 16px;
          color: #666;
          margin-top: 10px;
        }
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .ticket { 
            border: 1px solid #000; 
            margin: 0;
            width: 300px;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <div class="cafe-name">1ER BOULEVARD</div>
          <div class="address">GUELIZ</div>
        </div>
        
        <div class="order-info">
          <div class="table-info">TABLE ${order.tableNumber}</div>
          <div class="date">${formatDate(order.date)}</div>
          <div style="font-size: 16px; color: #666; margin-top: 8px;">
            Serveur: ${order.agentName}
          </div>
        </div>
        
        <div class="items">
          ${order.items.map(item => `
            <div class="item">
              <div class="item-details">
                <div class="item-name">${item.drinkName}</div>
                <div style="font-size: 16px; color: #666;">
                  ${item.quantity} x ${item.unitPrice.toFixed(2)} MAD
                </div>
              </div>
              <div class="item-price">
                ${(item.quantity * item.unitPrice).toFixed(2)} MAD
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="total">
          TOTAL: ${order.total.toFixed(2)} MAD
        </div>
        
        ${generateBarcode(order.id)}
        
        <div class="footer">
          <div>Merci de votre visite !</div>
          <div style="margin-top: 10px;">À bientôt au 1er Boulevard</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const agentTicketContent = `
    <html>
    <head>
      <title>Copie Agent - Le 1er Boulevard</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          line-height: 1.4;
          margin: 0;
          padding: 15px;
          background: white;
          color: black;
          width: 280px;
          margin: 0 auto;
        }
        .ticket {
          text-align: center;
          border: 1px solid #000;
          padding: 15px;
          background: white;
        }
        .header {
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .cafe-name {
          font-size: 22px;
          font-weight: bold;
          color: #000;
          margin-bottom: 8px;
        }
        .copy-type {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          margin-bottom: 10px;
        }
        .table-info {
          font-size: 20px;
          font-weight: bold;
          color: #000;
          margin: 15px 0;
        }
        .items {
          text-align: left;
          margin: 15px 0;
        }
        .item {
          margin-bottom: 8px;
          font-size: 16px;
          padding: 5px 0;
          border-bottom: 1px dotted #999;
        }
        .item-name {
          font-weight: bold;
          color: #000;
        }
        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #000;
          font-size: 14px;
          color: #666;
        }
        .date {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
        }
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .ticket { 
            border: 1px solid #000; 
            margin: 0;
            width: 260px;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <div class="cafe-name">LE 1ER BOULEVARD</div>
          <div class="copy-type">COPIE AGENT</div>
        </div>
        
        <div class="table-info">TABLE ${order.tableNumber}</div>
        <div class="date">${formatDate(order.date)}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">
          Agent: ${order.agentName}
        </div>
        
        <div class="items">
          ${order.items.map(item => `
            <div class="item">
              <div class="item-name">${item.drinkName}</div>
              <div style="font-size: 14px; color: #666;">
                Quantité: ${item.quantity}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${generateBarcode(order.id)}
        
        <div class="footer">
          <div>Copie pour l'agent</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Imprimer le ticket client
  const customerWindow = window.open('', '_blank');
  if (customerWindow) {
    customerWindow.document.write(customerTicketContent);
    customerWindow.document.close();
    customerWindow.focus();
    customerWindow.print();
    customerWindow.close();
  }

  // Attendre un peu puis imprimer la copie agent
  setTimeout(() => {
    const agentWindow = window.open('', '_blank');
    if (agentWindow) {
      agentWindow.document.write(agentTicketContent);
      agentWindow.document.close();
      agentWindow.focus();
      agentWindow.print();
      agentWindow.close();
    }
  }, 2000); // Augmenter le délai pour s'assurer que le premier ticket s'imprime bien
};