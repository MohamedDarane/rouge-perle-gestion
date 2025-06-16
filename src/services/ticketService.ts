
import { Order } from "../types";

export const generateThankYouMessage = (): string => {
  const messages = [
    "Merci pour votre visite! Nous espérons vous revoir très bientôt chez La Perle Rouge.",
    "Votre sourire est notre plus belle récompense. À très vite chez La Perle Rouge!",
    "La Perle Rouge vous remercie de votre confiance. Au plaisir de vous servir à nouveau!",
    "Un café chez La Perle Rouge, c'est un moment de bonheur à partager. Revenez vite!",
    "Merci d'avoir choisi La Perle Rouge. Nous vous attendons pour votre prochaine pause café!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const printTicket = (order: Order): void => {
  // Generate barcode-like pattern
  const generateBarcode = (id: string) => {
    const chars = id.split('');
    return chars.map(char => {
      const code = char.charCodeAt(0);
      const pattern = (code % 4) + 1;
      return '|'.repeat(pattern) + ' ';
    }).join('');
  };

  const barcode = generateBarcode(order.id);
  const thankYouMessage = generateThankYouMessage();

  // Combined document with page break
  const combinedTicket = `
    <html>
    <head>
      <title>Tickets - La Perle Rouge</title>
      <style>
        @media print {
          body { margin: 0 !important; }
          .page-break { page-break-before: always; }
        }
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        
        /* Customer ticket styles */
        .ticket {
          background: white;
          width: 300px;
          padding: 20px;
          border: 2px solid #e63946;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          margin-bottom: 40px;
        }
        .header {
          border-bottom: 2px solid #e63946;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .cafe-name {
          font-size: 1.8rem;
          font-weight: bold;
          color: #e63946;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        .subtitle {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 10px;
        }
        .ticket-info {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 15px;
        }
        .server-info {
          font-size: 0.9rem;
          color: #333;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .items-section {
          border-top: 1px dashed #ccc;
          border-bottom: 1px dashed #ccc;
          padding: 15px 0;
          margin: 15px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .item-details {
          flex: 1;
          text-align: left;
        }
        .item-name {
          font-weight: bold;
          color: #333;
        }
        .item-qty {
          color: #666;
          font-size: 0.8rem;
        }
        .item-price {
          font-weight: bold;
          color: #e63946;
          margin-left: 10px;
        }
        .total-section {
          margin: 20px 0;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 2px solid #e63946;
        }
        .total {
          font-size: 1.4rem;
          font-weight: bold;
          color: #e63946;
        }
        .barcode-section {
          margin: 20px 0;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        .barcode {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
          word-break: break-all;
          color: #333;
          margin-bottom: 5px;
        }
        .barcode-id {
          font-size: 0.7rem;
          color: #666;
        }
        .message {
          margin: 20px 0;
          font-style: italic;
          font-size: 0.85rem;
          color: #555;
          line-height: 1.4;
          padding: 10px;
          background-color: #fff8f0;
          border-radius: 5px;
          border-left: 4px solid #e63946;
        }
        .footer {
          font-size: 0.8rem;
          color: #888;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .address {
          font-size: 0.75rem;
          color: #999;
          margin-top: 10px;
          line-height: 1.3;
        }

        /* Agent ticket styles */
        .agent-ticket {
          background: #f8f9fa;
          width: 250px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .agent-header {
          font-size: 1.2rem;
          font-weight: bold;
          color: #e63946;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
        }
        .agent-copy-label {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .agent-info {
          font-size: 0.8rem;
          margin-bottom: 15px;
        }
        .agent-items {
          font-size: 0.8rem;
          margin: 15px 0;
          text-align: left;
        }
        .agent-item {
          margin-bottom: 5px;
          padding: 3px 0;
          border-bottom: 1px dotted #ddd;
        }
        .agent-barcode {
          font-size: 0.6rem;
          color: #666;
          margin: 15px 0;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <!-- Customer ticket -->
      <div class="ticket">
        <div class="header">
          <div class="cafe-name">LA PERLE ROUGE</div>
          <div class="subtitle">Café • Restaurant</div>
          <div class="ticket-info">${new Date(order.date).toLocaleString('fr-FR')}</div>
        </div>
        
        <div class="server-info">Serveur: ${order.agentName}</div>
        
        <div class="items-section">
          ${order.items.map((item, index) => `
            <div class="item">
              <div class="item-details">
                <div class="item-name">${index + 1}. ${item.drinkName}</div>
                <div class="item-qty">${item.quantity} × ${item.unitPrice.toFixed(2)} MAD</div>
              </div>
              <div class="item-price">${(item.unitPrice * item.quantity).toFixed(2)} MAD</div>
            </div>
          `).join('')}
        </div>
        
        <div class="total-section">
          <div class="total">TOTAL: ${order.total.toFixed(2)} MAD</div>
        </div>
        
        <div class="barcode-section">
          <div class="barcode">${barcode}</div>
          <div class="barcode-id">ID: ${order.id}</div>
        </div>
        
        <div class="message">${thankYouMessage}</div>
        
        <div class="footer">
          <div>Merci de votre visite!</div>
          <div class="address">
            DOHA ABOUAB MARRAKECH
          </div>
        </div>
      </div>

      <!-- Agent copy with page break - products only -->
      <div class="agent-ticket page-break">
        <div class="agent-header">LA PERLE ROUGE</div>
        <div class="agent-copy-label">COPIE AGENT</div>
        
        <div class="agent-info">
          <div>Date: ${new Date(order.date).toLocaleDateString('fr-FR')}</div>
          <div>Heure: ${new Date(order.date).toLocaleTimeString('fr-FR')}</div>
          <div>Agent: ${order.agentName}</div>
        </div>
        
        <div class="agent-items">
          <strong>Produits:</strong>
          ${order.items.map((item, index) => `
            <div class="agent-item">
              ${index + 1}. ${item.drinkName} x${item.quantity}
            </div>
          `).join('')}
        </div>
        
        <div class="agent-barcode">
          ${barcode}<br>
          ${order.id}
        </div>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.write(combinedTicket);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    alert("Veuillez autoriser les fenêtres popup pour imprimer le ticket.");
  }
};
