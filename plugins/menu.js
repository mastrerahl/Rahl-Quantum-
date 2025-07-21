module.exports = async function menuPlugin(client, message) {
  const menu = `
*👑 RAHL QUANTUM MASTER PANEL ⚜️*

Greetings, *${message.pushName || "Noble"}*.
Welcome to the Palace of Control. Your Royal Commands await.

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *BASIC COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .menu – Show this menu  
⚜️ .alive – Check bot status  
⚜️ .ping – Speed check  
⚜️ .owner – Contact the throne  
⚜️ .runtime – Bot uptime  
⚜️ .rules – Kingdom rules  
⚜️ .support – Get help  
⚜️ .status – Bot system info  
⚜️ .groupinfo – Group details  
⚜️ .infobot – Bot metadata  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *MEDIA CONVERSION*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .sticker – Image to sticker  
⚜️ .toimg – Sticker to image  
⚜️ .gif – Image to GIF  
⚜️ .photo – Sticker to photo  
⚜️ .crop – Crop image  
⚜️ .flip – Flip image  
⚜️ .mirror – Mirror effect  
⚜️ .blur – Blur image  
⚜️ .resize – Resize image  
⚜️ .rotate – Rotate image  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *VOICE & AUDIO FX*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .tts en Hello – Text to speech  
⚜️ .voice – AI voice  
⚜️ .say – Echo command  
⚜️ .bass – Bass boost  
⚜️ .deep – Deep voice  
⚜️ .slow – Slow audio  
⚜️ .fast – Speed audio  
⚜️ .robot – Robotify  
⚜️ .reverse – Reverse audio  
⚜️ .ghost – Haunted effect  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *DOWNLOAD ZONE*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .ytmp3 [link] – YouTube audio  
⚜️ .ytmp4 [link] – YouTube video  
⚜️ .fb [link] – Facebook download  
⚜️ .ig [link] – Instagram video  
⚜️ .tt [link] – TikTok video  
⚜️ .mediafire [url] – Download file  
⚜️ .apk [app name] – Get APK  
⚜️ .play [song] – Search + download  
⚜️ .lyrics [song] – Find lyrics  
⚜️ .scdl [link] – Soundcloud DL  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *RAHL INTELLIGENCE*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .ask [question] – Ask Rahl AI  
⚜️ .bio – Generate a royal bio  
⚜️ .caption – Caption generator  
⚜️ .quote – Random wisdom  
⚜️ .chatgpt – Talk to RAHL GPT  
⚜️ .gpt4 – Multimodal genius  
⚜️ .describe – Image to text  
⚜️ .summarize – Text shrinker  
⚜️ .title – Title generator  
⚜️ .explain – Explain anything  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *GROUP MODERATION*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .kick @user – Remove user  
⚜️ .add 254xxxx – Add member  
⚜️ .promote @user – Make admin  
⚜️ .demote @user – Revoke admin  
⚜️ .setwelcome – Welcome text  
⚜️ .setgoodbye – Goodbye text  
⚜️ .mute – Silence group  
⚜️ .unmute – Unsilence  
⚜️ .tagall – Mention all  
⚜️ .del – Delete message  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *UTILITY & TOOLS*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .calc – Calculate  
⚜️ .qr – Generate QR  
⚜️ .readmore – Readmore break  
⚜️ .shorten – Short link  
⚜️ .translate – Translate text  
⚜️ .weather – Get forecast  
⚜️ .time – World time  
⚜️ .ipinfo – IP lookup  
⚜️ .define – Dictionary  
⚜️ .poll – Create a vote  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *DEPLOYMENT ZONE*
━━━━━━━━━━━━━━━━━━━━━━
⚜️ .session – Generate session  
⚜️ .pair – Generate pair code  
⚜️ .deploy – Deploy bot  
⚜️ .restart – Reboot bot  
⚜️ .update – Get latest build  
⚜️ .logs – Bot logs  
⚜️ .dev – Developer info  
⚜️ .host – Hosting tips  
⚜️ .backup – Get data backup  
⚜️ .exit – Shutdown  

━━━━━━━━━━━━━━━━━━━━━━
⚜️ *RAHL QUANTUM SYSTEM ⚜️*
━━━━━━━━━━━━━━━━━━━━━━
Built on wisdom. Powered by purpose.  
_Crafted for comrades, warriors, and kings._

*Royal Link:* [Deploy Yours](https://github.com/lordrahl2-sys/Rahl-Quantum)

`;

  await client.sendText(message.from, menu);
};
