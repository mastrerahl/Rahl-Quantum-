// plugins/vv.js — 👁️‍🗨️ Rahl's Royal Vision

module.exports = async function viewOncePlugin(client, message) {
  const isVV = message.body.toLowerCase().startsWith(".vv");
  const isVV2 = message.body.toLowerCase().startsWith(".vv2");

  try {
    const quotedMsg = message.quotedMsg;

    if (!quotedMsg || !quotedMsg.isViewOnce) {
      return client.sendText(
        message.from,
        "🔒 *Royal Alert:* Please reply to a view-once image or video with `.vv` or `.vv2`."
      );
    }

    const mediaData = await client.downloadMedia(quotedMsg);

    const royalCaption = `👁️‍🗨️ *RAHL REVEALS THE HIDDEN MEDIA...* 👁️‍🗨️\n\n🪄 View-once unlocked by *Rahl Quantum*`;

    if (isVV) {
      if (quotedMsg.type === "image") {
        await client.sendImage(message.from, mediaData, "revealed.jpg", royalCaption);
      } else if (quotedMsg.type === "video") {
        await client.sendVideoAsGif(message.from, mediaData, "revealed.mp4", royalCaption);
      }
    } else if (isVV2) {
      const sender = message.sender.id;
      if (quotedMsg.type === "image") {
        await client.sendImage(sender, mediaData, "revealed.jpg", royalCaption);
      } else if (quotedMsg.type === "video") {
        await client.sendVideoAsGif(sender, mediaData, "revealed.mp4", royalCaption);
      }
      await client.sendText(message.from, "📬 *Delivered to your Royal DM!*");
    }
  } catch (err) {
    console.error("❌ VV Error:", err.message);
    await client.sendText(
      message.from,
      "⚠️ *Rahl encountered a problem unlocking the view-once.* Try again."
    );
  }
};
