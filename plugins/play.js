// plugins/play.js — Royal Music Summoner 🎵 const axios = require("axios"); const yts = require("yt-search"); const fs = require("fs-extra"); const { exec } = require("child_process");

module.exports = async function playPlugin(client, message) { const query = message.body.trim().split(/ +/).slice(1).join(" "); if (!query) return client.reply( message.from, "🎶 Please provide a song name after .play\n\nExample: .play shape of you", message.id );

const infoMsg = await client.sendText( message.from, 🎵 Summoning Royal melodies for *${query}*... );

try { const search = await yts(query); const song = search.videos[0]; const url = song.url;

exec(`yt-dlp -x --audio-format mp3 -o 'downloads/%(title)s.%(ext)s' "${url}"`, async (err) => {
  if (err) {
    console.error("Download error:", err);
    return client.sendText(
      message.from,
      "❌ Royal servers failed to summon the track."
    );
  }

  const filename = `downloads/${song.title}.mp3`;
  await client.sendFile(
    message.from,
    filename,
    `${song.title}.mp3`,
    `🎶 *Rahl's Melody:* ${song.title}\n⏰ Duration: ${song.timestamp}`
  );

  await fs.remove(filename);
  await client.sendText(message.from, "🕊️ Royal delivery complete.");
});

} catch (e) { console.error(e); client.sendText( message.from, "❌ Royal error fetching song. Try again." ); } };

