// ======================================================
// SCRIPT.JS — GAME STATION BOOKING SYSTEM FINAL
// ======================================================

// ======================================================
// 1️⃣ SCROLL HALUS KE FORM PEMESANAN
// ======================================================
document.getElementById("pesanBtn").addEventListener("click", () => {
  const modal = document.getElementById("bookingModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
});

// ======================================================
// 2️⃣ EFEK FADE-IN SAAT SCROLL
// ======================================================
const fadeElements = document.querySelectorAll(".fade-in");
function fadeInOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  fadeElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) el.classList.add("visible");
  });
}
window.addEventListener("scroll", fadeInOnScroll);
window.addEventListener("load", fadeInOnScroll);

// ======================================================
// 3️⃣ REFERENSI ELEMEN FORM
// ======================================================
const consoleSelect = document.getElementById("console");
const roomSelect = document.getElementById("room");
const submitBtn = document.getElementById("submitBtn");
const dateInput = document.getElementById("date");
const startInput = document.getElementById("start");
const durationInput = document.getElementById("duration");
const nameInput = document.getElementById("name");
const statusDiv = document.getElementById("availability");

// ======================================================
// 4️⃣ PILIHAN ROOM DINAMIS BERDASARKAN KONSOL
// ======================================================
consoleSelect.addEventListener("change", function () {
  const consoleType = this.value;
  roomSelect.innerHTML = '<option value="">Pilih Room</option>';

  if (consoleType && roomsByConsole[consoleType]) {
    roomsByConsole[consoleType].forEach((category) => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = category.group;

      category.list.forEach((room) => {
        const option = document.createElement("option");
        option.value = room;
        option.textContent = room;
        optGroup.appendChild(option);
      });

      roomSelect.appendChild(optGroup);
    });
  }
  submitBtn.disabled = true;
});

// ======================================================
// 5️⃣ CEK KETERSEDIAAN ROOM OTOMATIS
// ======================================================
[dateInput, startInput, durationInput, roomSelect, consoleSelect, nameInput].forEach((el) => {
  el.addEventListener("input", checkAvailability);
  el.addEventListener("change", checkAvailability);
});

function normalizeTime(value) {
  if (!value) return "";
  return value.split(":").slice(0, 2).join(":");
}
function getRoomType(roomName) {
  if (roomName.includes("Reguler")) return "Reguler";
  if (roomName.includes("Smoking")) return "Smoking";
  if (roomName.includes("VVIP")) return "VVIP";
  if (roomName.includes("VIP")) return "VIP";
  return "";
}
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// ======================================================
// 6️⃣ POPUP KONFIRMASI DINAMIS
// ======================================================
function showDecisionPopup(title, message, yesText, noText, yesAction, noAction) {
  const existing = document.getElementById("decisionPopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "decisionPopup";
  popup.className = "decision-popup";
  popup.innerHTML = `
    <div class="decision-box">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="decision-btns">
        <button id="yesBtn">${yesText}</button>
        <button id="noBtn">${noText}</button>
      </div>
    </div>`;
  document.body.appendChild(popup);
  popup.style.display = "flex";

  document.getElementById("yesBtn").addEventListener("click", () => {
    popup.remove();
    yesAction?.();
  });
  document.getElementById("noBtn").addEventListener("click", () => {
    popup.remove();
    noAction?.();
  });
}

// ======================================================
// 7️⃣ POPUP INVOICE (STRUK)
// ======================================================
const bookingForm = document.getElementById("bookingForm");
const invoicePopup = document.createElement("div");
invoicePopup.id = "invoicePopup";
invoicePopup.style.display = "none";
invoicePopup.className = "invoice-popup";
invoicePopup.innerHTML = `
  <div class="invoice-box">
    <h3>KONFIRMASI PESANAN</h3>
    <div class="invoice-line"></div>
    <div class="invoice-row"><div class="label">Nama</div><div class="colon">:</div><div class="value" id="invName"></div></div>
    <div class="invoice-row"><div class="label">Tanggal</div><div class="colon">:</div><div class="value" id="invDate"></div></div>
    <div class="invoice-row"><div class="label">Jam Mulai</div><div class="colon">:</div><div class="value" id="invTime"></div></div>
    <div class="invoice-row"><div class="label">Konsol</div><div class="colon">:</div><div class="value" id="invConsole"></div></div>
    <div class="invoice-row"><div class="label">Room</div><div class="colon">:</div><div class="value" id="invRoom"></div></div>
    <div class="invoice-line"></div>
    <div class="invoice-row"><div class="label">Harga / Jam</div><div class="colon">:</div><div class="value" id="invRate"></div></div>
    <div class="invoice-row"><div class="label">Durasi</div><div class="colon">:</div><div class="value" id="invDuration"></div></div>
    
    <div class="invoice-line"></div>
    <div class="invoice-total" id="invHarga"></div>
    <div class="invoice-line"></div>
    
    <div class="invoice-warning" id="vipWarning"></div>

    <div class="invoice-line"></div>
    <div class="invoice-print-date" id="invPrintDate"></div>
    <div class="invoice-line"></div>

    <div class="invoice-buttons">
      <button id="confirmWA">KIRIM</button>
      <button id="editData">UBAH</button>
    </div>
  </div>`;
document.body.appendChild(invoicePopup);

// ======================================================
// 8️⃣ TAMPILKAN STRUK BOOKING
// ======================================================
function showInvoicePopup() {
  const nama = nameInput.value.trim();
  const tanggal = dateInput.value;
  const waktu = startInput.value;
  const durasi = Number(durationInput.value);
  const konsol = consoleSelect.value;
  const room = roomSelect.value;

  const roomType = getRoomType(room);
  const rate = priceList[roomType]?.[konsol] || 0;
  const totalHarga = rate * durasi;

  document.getElementById("invName").textContent = nama;
  document.getElementById("invDate").textContent = tanggal;
  document.getElementById("invTime").textContent = waktu;
  document.getElementById("invConsole").textContent = konsol;
  document.getElementById("invRoom").textContent = room;
  document.getElementById("invRate").textContent = `Rp${rate.toLocaleString("id-ID")}`;
  document.getElementById("invDuration").textContent = `${durasi} Jam`;
  document.getElementById("invHarga").textContent = `Total: Rp${totalHarga.toLocaleString("id-ID")}`;
  document.getElementById("invPrintDate").textContent = new Date().toLocaleString("id-ID");

  let note = "";
  if (roomType === "VIP") note = "👥 Maks 4 orang | 🚭 Tidak boleh merokok";
  if (roomType === "VVIP") note = "👥 Maks 10 orang | 🚭 Tidak boleh merokok";
  if (roomType === "Smoking") note = "🚬 Diperbolehkan merokok";
  if (roomType === "Reguler") note = "🚭 Tidak diperkenankan merokok";
  document.getElementById("vipWarning").textContent = note;

  invoicePopup.style.display = "flex";
}

// ======================================================
// 9️⃣ CEK KETERSEDIAAN ROOM + POPUP KONFIRMASI
// ======================================================
function checkAvailability() {
  const nameVal = nameInput.value.trim();
  const dateVal = dateInput.value;
  const startVal = normalizeTime(startInput.value);
  const roomVal = roomSelect.value;
  const consoleVal = consoleSelect.value;
  const durationVal = Number(durationInput.value);

  if (!nameVal || !dateVal || !startVal || !roomVal || !consoleVal || !durationVal) {
    statusDiv.style.display = "none";
    submitBtn.disabled = true;
    return;
  }

  statusDiv.style.display = "block";
  statusDiv.innerHTML = `<span class="spinner"></span>Memeriksa ketersediaan...`;

  setTimeout(() => {
    const startTime = toMinutes(startVal);
    const endTime = startTime + durationVal * 60;
    const isOverlap = bookedData.some((b) => {
      if (b.date !== dateVal || b.room !== roomVal) return false;
      const bStart = toMinutes(b.start);
      const bEnd = bStart + b.duration * 60;
      return startTime < bEnd && endTime > bStart;
    });

    // 🚫 Jika bentrok jadwal
    if (isOverlap) {
      statusDiv.textContent = "❌ MAAF, room sudah dibooking di jam tersebut.";
      showDecisionPopup(
        "Ruangan Tidak Tersedia",
        "❌ Ruangan sudah dibooking di jam tersebut.",
        "UBAH RUANGAN",
        "BATAL",
        () => {
          roomSelect.value = "";
          statusDiv.textContent = "";
        },
        () => {
          document.getElementById("bookingModal").style.display = "none";
          document.body.style.overflow = "auto";
        }
      );
    } 
    // ✅ Jika tersedia
    else {
      const rate = priceList[getRoomType(roomVal)]?.[consoleVal] || 0;
      const totalHarga = rate * durationVal;
      const hargaFormat = totalHarga.toLocaleString("id-ID");

      // 💬 Format pesan WA elegan & senada
      const message = encodeURIComponent(
`🕹️ *FORM PEMESANAN*
━━━━━━━━━━━━━━━
👤 Nama: ${nameVal}
🎮 Konsol: ${consoleVal}
🏠 Room: ${roomVal}
📅 Tanggal: ${dateVal}
⏰ Jam Mulai: ${startVal}
⏱️ Durasi: ${durationVal} jam
💰 Total: Rp${hargaFormat}
━━━━━━━━━━━━━━━
Silakan *konfirmasi* agar reservasi diproses ✅`
      );

      const waLink = `https://wa.me/${waNumber}?text=${message}`;
      submitBtn.setAttribute("data-wa", waLink);

      // 🪩 Popup konfirmasi dengan animasi lembut
      showDecisionPopup(
        "Ruangan Tersedia 🎉",
        "✅ Ruangan tersedia untuk dipesan.<br><br>Lanjutkan ke konfirmasi?",
        "LANJUTKAN",
        "BATAL",
        () => showInvoicePopup(),
        () => {
          document.getElementById("bookingModal").style.display = "none";
          document.body.style.overflow = "auto";
        }
      );
    }
  }, 600);
}



// ======================================================
// 🔟 KONFIRMASI ATAU EDIT STRUK / WHATSAPP
// ======================================================
document.addEventListener("click", (e) => {
  if (e.target.id === "editData") invoicePopup.style.display = "none";
  if (e.target.id === "confirmWA") {
    const waLink = submitBtn.getAttribute("data-wa");
    if (waLink) window.open(waLink, "_blank");
    invoicePopup.style.display = "none";
    document.getElementById("bookingModal").style.display = "none";
    bookingForm.reset();
    statusDiv.textContent = "";
    document.body.style.overflow = "auto";
  }
});
