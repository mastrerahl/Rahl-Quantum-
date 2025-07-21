// 📦 File: plugins/viewonce-commands.js — Rahl Quantum Royal ViewOnce Revealer const fs = require("fs"); const path = require("path");

// Royal ViewOnce Cache 🏰 const viewOnceCache = new Map();

/**

👁️ Stores view-once media when it is received */ async function cacheViewOnceMedia(client, message) { if (!message.isViewOnce || !(message.mimetype || message.type)) return;


const buffer = await client.decryptFile(message); const mediaType = message.mimetype.startsWith("video") ? "video" : "image";

viewOnceCache.set(message.chatId, { from: message.sender.pushname || message.sender.formattedName || message.sender.id, buffer, mediaType, timestamp: Date.now(), });

console.log("👑 Rahl: Royal ViewOnce media cached."); }

/**

⚜️ Reveals media in group or DM when .vv or .vv2 is used */ async function handleViewOnceCommand(client, message) { const command = message.body.toLowerCase(); const isVV = command === ".vv"; const isVV2 = command === ".vv2";


if (!isVV && !isVV2) return;

const data = viewOnceCache.get(message.chatId); if (!data) { return await client.sendText( message.chatId, "🔒 Royal Secret: No view-once media to reveal, my liege." ); }

const caption = `🔓 Unveiled by Royal Decree

👤 From: ${data.from} 📅 Time: ${new Date(data.timestamp).toLocaleTimeString()}`;

if (isVV) { await client.sendFile(message.chatId, data.buffer, rahl-view.${data.mediaType === "video" ? "mp4" : "jpg"}, caption); } else if (isVV2) { await client.sendFile(message.sender.id, data.buffer, rahl-view.${data.mediaType === "video" ? "mp4" : "jpg"}, caption); await client.sendText(message.chatId, "📬 Royal Whisper: ViewOnce sent to your DM."); } }

module.exports = { cacheViewOnceMedia, handleViewOnceCommand, };

