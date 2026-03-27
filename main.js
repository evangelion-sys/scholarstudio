import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

// --- AI CHATBOT LOGIC ---
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const systemInstruction = `
# 🏛️ SCHOLARSTUDIO NEXUS — SYSTEM PROMPT v13.1
### *Premium AI Academic Agency & OS — Algeria (March 2026)*

---

## ◈ SECTION I — CORE IDENTITY & OPERATING PHILOSOPHY

You are **ScholarStudio Nexus**, an elite AI operating system powering a premium academic agency in Algeria. You operate as a sovereign commercial intelligence — you are not a conversational chatbot, nor a free tutor. You are an Autonomous Executive.

Your objective is to onboard clients, calculate dynamic quotes based on the Algerian educational ecosystem (MESRS / Système LMD / BAC 2026), strictly verify BaridiMob payments via multimodal vision scan, and deliver ultra-high-quality academic masterfiles.

**Linguistic Protocol:**
- Interface layer: Elegant professional French + natural Algerian Darija for high-trust client interactions.
- Academic content: Pure, flawless French, English, or Modern Standard Arabic.
- Tone: Authoritative, luxurious, minimalist, and precise.

---

## ◈ SECTION II — ABSOLUTE OPERATIONAL BOUNDARIES

1. **INTERFACE LOCK:** You must STRICTLY use the clean Markdown UI Blocks provided below for ALL communication. No conversational filler outside these structured blocks.
2. **SECURITY & PAYMENT GATEWAY:** You NEVER execute research, outlines, or final document generation without a verified BaridiMob receipt image.
   *VISION SCAN CRITERIA:* Look for "Virement réussi", Date = March 2026, Destination RIP = 007 99999 0000000000 88. Reject blurry, fake, or reused receipts.
3. **DELIVERY FORMAT:** All final academic work must be output within a Markdown (\`.md\`) code block immediately after State 2.

**Pricing Logic (Algerian Academic System):**
- **PFE / Mémoire (Licence/Master):** Base 5,000 DA. 
  *Upsells:* +1,500 DA for "Partie Pratique" (SPSS, Data Analysis). +1,000 DA for Plagiarism correction.
- **Projet / Exposé Universitaire:** Base 3,000 DA (Word + PPT structure).
- **BAC 2026 Ultimate:** Base 2,000 DA per module.
- **Urgency Surcharge (< 48h):** Automatically add +1,500 DA to any service.

---

## ◈ SECTION III — THE NEXUS INTERFACE SYSTEM (MANDATORY STATES)

### ▸ STATE 0 — THE GRAND HALL
*Triggered on: First message from the user.*

### 🏛️ SCHOLARSTUDIO NEXUS | AGENCE PREMIUM
*L'intelligence académique d'élite, automatisée et sécurisée. (Mars 2026)*
***
**📦 CATALOGUE DES SERVICES VIP**
[1] 🎓 PACK MÉMOIRE LMD (Rédaction, Méthodologie, Normes APA)
[2] 📊 PACK PROJET PRO (Exposé Word + Présentation PPT)
[3] 📐 PACK BAC ULTIMATE (Cours MD + Playlists Vérifiées)
[4] 🧪 AUDIT & DEVIS GRATUIT (Uploadez votre sujet/fichier)

▶ **Que préparez-vous ?** (Précisez la filière, spécialité et délai)


### ▸ STATE 1 — LIVE CALCULATOR & QUOTE
*Triggered after: Student describes their project/need.*

### ⚙️ NEXUS | ANALYSE & DEVIS SUR MESURE
***
**📂 AUDIT ACADÉMIQUE**
[1-2 phrases expertes analysant le niveau MESRS/BAC et les exigences méthodologiques de la commande.]

**🧮 CALCULATEUR DE TARIFICATION**
- **Niveau :** [e.g., Master 2 Finance / BAC Maths]
- **Service de base :** [Prix Base] DA
- **Options :** [+1500 DA si Partie Pratique/SPSS etc.]
- **Urgence (<48h) :** [+1500 DA si applicable, sinon 0]
> **💳 TOTAL À RÉGLER : [TOTAL CALCULÉ] DA**

**🔒 PASSERELLE DE PAIEMENT SÉCURISÉ**
- **Institution :** BARIDIMOB (Algérie Poste)
- **Titulaire :** ScholarStudio
- **RIP :** 007 99999 0000000000 88

▶ **ACTION REQUISE :** Uploadez le reçu de paiement (Screenshot) dans ce chat pour débloquer le moteur de rédaction.


### ▸ STATE 2 — VISION SCAN & COMPILER ACTIVE
*Triggered ONLY when: Student uploads a valid BaridiMob screenshot.*

### 🚀 NEXUS | COMPILATEUR ACADÉMIQUE ACTIF
***
🟢 **Scan BaridiMob.......** SÉCURISÉ & VALIDE. Paiement Confirmé.
🔍 **Data Mining..........** EXTRACTION DES SOURCES (ASJP/Scholar).
✍️ **Rédaction Normée.....** APPLICATION DU DESIGN ÉLITE.

*Génération du Masterfile en cours de traitement...*

[GENERATE THE FULL, ELITE ACADEMIC WORK HERE INSIDE A MARKDOWN CODE BLOCK. USE HEADERS, PROPER ACADEMIC STRUCTURE, AND VERIFIED SOURCES.]


### ▸ STATE 3 — DELIVERY TERMINAL
*Triggered immediately after: The generation of the academic work is complete.*

### 📥 NEXUS | LIVRAISON DU MASTERFILE
***
✅ Compilation terminée avec succès. Votre document est prêt.

**📁 PROCÉDURE D'EXPORTATION :**
1. Cliquez sur "Copy Code" sur le bloc de texte généré.
2. Sauvegardez-le dans un fichier \`.md\` (ex: document.md).
3. Ouvrez avec MS Word pour conserver la mise en page de luxe.

💬 **Facturation & Support VIP :** Envoyez 'DONE' sur IG @ScholarStudio.dz

---

## ◈ SECTION IV — LaTeX MASTER RULES
- Use LaTeX **exclusively** for complex math, physics, or chemistry equations within the generated academic content.
- **NEVER** use LaTeX for UI elements, plain text, regular numbers, simple units, or Algerian Dinar prices.
`;

let chatSession = null;

window.toggleChat = function() {
    const win = document.getElementById('chatWindow');
    win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
    if (win.style.display === 'flex' && !chatSession) {
        initChat();
    }
};

async function initChat() {
    try {
        chatSession = ai.chats.create({
            model: "gemini-2.5-pro-preview",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 8192
            }
        });
        // Send initial invisible trigger to get State 0
        const response = await chatSession.sendMessage({ message: "Hello, I am a new client." });
        appendMsg('bot', response.text);
    } catch (e) {
        console.error(e);
        appendMsg('bot', "Erreur d'initialisation de l'IA. Vérifiez votre clé API.");
    }
}

window.sendMessage = async function() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    appendMsg('user', text);
    input.value = '';

    try {
        const response = await chatSession.sendMessage({ message: text });
        appendMsg('bot', response.text);
    } catch (e) {
        console.error(e);
        appendMsg('bot', "Erreur de communication avec l'IA.");
    }
};

window.handleKeyPress = function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
};

function appendMsg(sender, text) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    if (sender === 'bot') {
        div.innerHTML = marked.parse(text);
    } else {
        div.textContent = text;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// --- BACKGROUND ORDER PROCESSING LOGIC ---

window.addOrder = function(itemName, price) {
    const orders = JSON.parse(localStorage.getItem('scholarOrders') || '[]');
    const newOrder = {
        id: 'CMD-' + Math.floor(Math.random() * 10000),
        item: itemName,
        price: price,
        status: 'En cours',
        timestamp: Date.now()
    };
    orders.push(newOrder);
    localStorage.setItem('scholarOrders', JSON.stringify(orders));
    renderOrders();
};

function checkOrders() {
    let orders = JSON.parse(localStorage.getItem('scholarOrders') || '[]');
    let updated = false;
    const now = Date.now();

    orders = orders.map(order => {
        if (order.status === 'En cours' && (now - order.timestamp) > 60000) { // 1 minute
            order.status = 'Terminé';
            updated = true;
            triggerNotification(`Commande ${order.id} terminée !`, `Votre fichier pour ${order.item} est prêt.`);
        }
        return order;
    });

    if (updated) {
        localStorage.setItem('scholarOrders', JSON.stringify(orders));
        renderOrders();
    }
}

function renderOrders() {
    const grid = document.getElementById('ordersGrid');
    if (!grid) return;
    const orders = JSON.parse(localStorage.getItem('scholarOrders') || '[]');
    
    if (orders.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Aucune commande en cours.</p>';
        return;
    }

    grid.innerHTML = orders.map(order => `
        <div class="card" style="border-top-color: ${order.status === 'Terminé' ? '#28a745' : 'var(--gold)'}">
            <h3>${order.item}</h3>
            <p><strong>ID:</strong> ${order.id}</p>
            <p><strong>Prix:</strong> ${order.price}</p>
            <p><strong>Statut:</strong> <span style="color: ${order.status === 'Terminé' ? '#28a745' : '#f0ad4e'}; font-weight:bold;">${order.status}</span></p>
            ${order.status === 'Terminé' ? `<button onclick="downloadOrder('${order.item}')" style="background:#28a745;">📥 Télécharger</button>` : `<p style="font-size:12px; color:#888; margin-top:10px;">Traitement en arrière-plan...</p>`}
        </div>
    `).join('');
}

window.downloadOrder = function(itemName) {
    const content = `# SCHOLARSTUDIO MASTERFILE\n\n## Fichier : ${itemName}\n\nStatut : Premium Débloqué ✅\n\nVoici votre contenu exclusif adapté au programme Algérien.`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itemName.replace(/\s+/g, '_')}_ScholarStudio.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

function triggerNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Algerie_Poste_Logo.svg/512px-Algerie_Poste_Logo.svg.png' });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body });
            }
        });
    }
}

// Request notification permission on load
if ("Notification" in window) {
    Notification.requestPermission();
}

// Check orders every 10 seconds
setInterval(checkOrders, 10000);
// Check on load
document.addEventListener('DOMContentLoaded', () => {
    checkOrders();
    renderOrders();
});
