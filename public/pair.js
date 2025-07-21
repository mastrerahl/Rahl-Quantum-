// public/pair.js — Rahl Quantum Pairing Request Handler
async function getCode() {
  const phoneInput = document.getElementById("phone");
  const output = document.getElementById("output");
  const number = phoneInput.value.trim();

  if (!number || number.length < 10) {
    output.innerHTML = "❌ Please enter a valid phone number with country code.";
    return;
  }

  output.innerHTML = "⏳ Generating pairing code...";

  try {
    const response = await fetch(`/pair?number=${number}`);
    const data = await response.json();

    if (data.pairingCode) {
      output.innerHTML = `✅ Pairing Code: <b>${data.pairingCode}</b><br>📲 Use it in WhatsApp > Linked Devices`;
    } else {
      output.innerHTML = `⚠️ ${data.error || "Unexpected error occurred."}`;
    }
  } catch (err) {
    output.innerHTML = `❌ Server error: ${err.message}`;
  }
}
