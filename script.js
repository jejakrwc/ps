// ======================================================
// SCRIPT.JS — GAME STATION BOOKING SYSTEM
// (AUTO UPDATE + TERBILANG + PROMO MANUAL ONLY + JARAK AUTO)
// ======================================================

// 1️⃣ SCROLL HALUS KE FORM PEMESANAN
document.getElementById("pesanBtn").addEventListener("click", () => {
  const modal = document.getElementById("bookingModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
});

// 2️⃣ EFEK FADE-IN SAAT SCROLL
const fadeElements = document.querySelectorAll(".fade-in");
function fadeInOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) el.classList.add("visible");
  });
}
window.addEventListener("scroll", fadeInOnScroll);
window.addEventListener("load", fadeInOnScroll);

// 3️⃣ REFERENSI ELEMEN FORM
const consoleSelect = document.getElementById("console");
const roomSelect = document.getElementById("room");
const submitBtn = document.getElementById("submitBtn");
const dateInput = document.getElementById("date");
const startInput = document.getElementById("start");
const durationInput = document.getElementById("duration");
const nameInput = document.getElementById("name");
const statusDiv = document.getElementById("availability");

// 4️⃣ AUTO LOAD DATA BOOKING TERBARU
async function loadLatestData() {
  try {
    const res = await fetch("data-booking.js?v=" + Date.now(), { cache: "no-store" });
    const text = await res.text();

    const bookedMatch = text.match(/bookedData\s*=\s*(\[[\s\S]*?\]);/);
    const roomsMatch = text.match(/roomsByConsole\s*=\s*(\{[\s\S]*?\});/);
    const priceMatch = text.match(/priceList\s*=\s*(\{[\s\S]*?\});/);
    const waMatch = text.match(/waNumber\s*=\s*["'`](\d+)["'`]/);

    if (bookedMatch) window.bookedData = new Function("return " + bookedMatch[1])();
    if (roomsMatch) window.roomsByConsole = new Function("return " + roomsMatch[1])();
    if (priceMatch) window.priceList = new Function("return " + priceMatch[1])();
    if (waMatch) window.waNumber = waMatch[1];

    console.log("✅ Data booking disinkron otomatis:", bookedData.length, "entri");
  } catch (err) {
    console.error("❌ Gagal memuat data-booking.js:", err);
  }
}

// 5️⃣ TERBILANG
function terbilang(n) {
  const angka = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  n = Math.floor(n);
  if (n < 12) return angka[n];
  else if (n < 20) return terbilang(n - 10) + " belas";
  else if (n < 100) return terbilang(Math.floor(n / 10)) + " puluh " + terbilang(n % 10);
  else if (n < 200) return "seratus " + terbilang(n - 100);
  else if (n < 1000) return terbilang(Math.floor(n / 100)) + " ratus " + terbilang(n % 100);
  else if (n < 2000) return "seribu " + terbilang(n - 1000);
  else if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " ribu " + terbilang(n % 1000);
  else if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " juta " + terbilang(n % 1000000);
  else return "";
}

// 6️⃣ PILIHAN ROOM DINAMIS BERDASARKAN KONSOL
consoleSelect.addEventListener("change", async function () {
  await loadLatestData();
  const consoleType = this.value;
  roomSelect.innerHTML = '<option value="">Pilih Room</option>';

  if (consoleType && roomsByConsole?.[consoleType]) {
    roomsByConsole[consoleType].forEach(category => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = category.group;
      category.list.forEach(room => {
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

// 7️⃣ UTILITY
function normalizeTime(value) { if (!value) return ""; return value.split(":").slice(0, 2).join(":"); }
function getRoomType(roomName) {
  if (!roomName) return "";
  if (roomName.includes("Reguler")) return "Reguler";
  if (roomName.includes("Smoking")) return "Smoking";
  if (roomName.includes("VVIP")) return "VVIP";
  if (roomName.includes("VIP")) return "VIP";
  return "";
}
function toMinutes(time) { if(!time) return 0; const [h,m]=time.split(":").map(Number); return h*60+(m||0); }

// 8️⃣ POPUP KONFIRMASI
function showDecisionPopup(title,message,yesText,noText,yesAction,noAction){
  const existing = document.getElementById("decisionPopup");
  if(existing) existing.remove();
  const popup = document.createElement("div");
  popup.id="decisionPopup"; popup.className="decision-popup";
  popup.innerHTML = `<div class="decision-box"><h3>${title}</h3><p>${message}</p><div class="decision-btns"><button id="yesBtn">${yesText}</button><button id="noBtn">${noText}</button></div></div>`;
  document.body.appendChild(popup);
  popup.style.display="flex";
  document.getElementById("yesBtn").addEventListener("click",()=>{ popup.remove(); yesAction?.(); });
  document.getElementById("noBtn").addEventListener("click",()=>{ popup.remove(); noAction?.(); });
}

// 9️⃣ POPUP INVOICE (dibuat dan ditempel ke DOM)
const bookingForm = document.getElementById("bookingForm");
const invoicePopup = document.createElement("div");
invoicePopup.id="invoicePopup"; invoicePopup.style.display="none"; invoicePopup.className="invoice-popup";
invoicePopup.innerHTML=`
<div class="invoice-box">
  <h3>KONFIRMASI PESANAN</h3>
  <div class="invoice-line"></div>
  <div class="invoice-row"><div class="label">Nama</div><div class="colon">:</div><div class="value" id="invName"></div></div>
  <div class="invoice-row"><div class="label">Tanggal</div><div class="colon">:</div><div class="value" id="invDate"></div></div>
  <div class="invoice-row"><div class="label">Jam Mulai</div><div class="colon">:</div><div class="value" id="invTime"></div></div>
  <div class="invoice-row"><div class="label">Konsol</div><div class="colon">:</div><div class="value" id="invConsole"></div></div>
  <div class="invoice-row"><div class="label">Room</div><div class="colon">:</div><div class="value" id="invRoom"></div></div>
  <div class="invoice-row"><div class="label">Jarak anda</div><div class="colon">:</div><div class="value" id="invDistance"></div></div>
  <div class="invoice-line"></div>
  <div class="invoice-row"><div class="label">Harga Satuan</div><div class="colon">:</div><div class="value" id="invRate"></div></div>
  <div class="invoice-row"><div class="label">Durasi</div><div class="colon"></div><div class="value" id="invDuration"></div></div>
  <div class="invoice-line"></div>
  <div class="invoice-total" id="invHarga" data-original="0"></div>
  <div class="invoice-terbilang" id="invTerbilang"></div>
  <div class="invoice-line"></div>

  <!-- PROMO: user harus mengetik di sini agar promo diterapkan -->
  <div class="invoice-row">
    <div class="label">Promo</div><div class="colon">:</div>
    <div class="value"><input type="text" id="promoCode" placeholder="Masukkan kode promo (opsional)"></div>
  </div>
  <div class="invoice-row"><div class="label"></div><div class="colon"></div><div class="value" id="promoMessage" style="color:#e41e26; font-size:0.85rem;"></div></div>

  <div class="invoice-line"></div>
  <div class="invoice-warning" id="vipWarning"></div>
  <div class="invoice-line"></div>
  <div class="invoice-print-date" id="invPrintDate"></div>
  <div class="invoice-line"></div>
  <div class="invoice-buttons"><button id="confirmWA">KIRIM</button><button id="editData">UBAH</button></div>
</div>`;
document.body.appendChild(invoicePopup);

// 🔟 VARIABEL GLOBAL PROMO (PROMO HARUS DITULIS MANUAL DI INVOICE)
let finalTotal = 0;
let appliedPromo = ""; // hanya diisi kalau user mengetikkan kode di invoice
const promos = {"GAME10":0.10,"VIP50":0.50,"MERDEKA17":0.17,"WEEKEND10":0.10,"HAPPYHOUR20":0.20};
const promoInput = document.getElementById("promoCode");
const promoMessage = document.getElementById("promoMessage");
const totalEl = document.getElementById("invHarga");
const terbilangEl = document.getElementById("invTerbilang");

// ✨ Fungsi apply promo MANUAL (dipanggil hanya saat user mengetik/paste di kotak promo invoice)
function applyPromoManual() {
  const code = promoInput.value.toUpperCase().trim();
  const originalTotal = Number(totalEl.dataset.original) || 0;

  if (!code) {
    // jika kosong -> reset ke original, jangan tampilkan pesan
    finalTotal = originalTotal;
    appliedPromo = "";
    promoMessage.textContent = "";
  } else if (promos[code]) {
    const discount = promos[code];
    finalTotal = Math.round(originalTotal * (1 - discount));
    appliedPromo = code;
    promoMessage.style.color = "#28a745";
    promoMessage.textContent = `Kode diterima — diskon ${(discount*100).toFixed(0)}% diterapkan.`;
  } else {
    // kode tidak valid
    finalTotal = originalTotal;
    appliedPromo = "";
    promoMessage.style.color = "#e41e26";
    promoMessage.textContent = "Kode promo tidak valid.";
  }

  // update invoice display
  totalEl.textContent = `TOTAL DIBAYAR : Rp${finalTotal.toLocaleString("id-ID")}`;
  terbilangEl.textContent = `(${terbilang(finalTotal)} rupiah)`;

  // update WA link untuk mencerminkan promo (hanya kalau ada appliedPromo)
  updateWaLink();
}

// hanya panggil applyPromoManual saat user benar-benar mengetik/paste di kotak promo
promoInput.addEventListener("input", applyPromoManual);
// juga support Enter-trigger
promoInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyPromoManual();
  }
});

// NOTE: PROMO DINAMIS BERDASARKAN HARI/JAM DIPERTAHANKAN DI LIST promos
// TAPI TIDAK AKAN OTOMATIS MENGISI INPUT ATAU DIKIRIM KE WA.
// Jika ingin admin/CS mengaktifkan promo dinamis, mereka harus memasukkan kodenya secara manual.

// 1️⃣3️⃣ UPDATE WA LINK (Hanya menaruh promo bila ada appliedPromo)
function updateWaLink(){
  const nameVal = nameInput.value.trim();
  const dateVal = dateInput.value;
  const startVal = normalizeTime(startInput.value);
  const roomVal = roomSelect.value;
  const consoleVal = consoleSelect.value;
  const durationVal = Number(durationInput.value);

  if (!nameVal || !dateVal || !startVal || !roomVal || !consoleVal || !durationVal) return;

  const promoText = appliedPromo || "-";
  const totalText = finalTotal || Number(totalEl.dataset.original) || 0;

  const message = encodeURIComponent(
`FORM PEMESANAN
─────────────────────────────
Nama       : ${nameVal}
Konsol     : ${consoleVal}
Room       : ${roomVal}
Tanggal    : ${dateVal}
Jam Mulai  : ${startVal}
Durasi     : ${durationVal} jam
Promo      : ${promoText}
─────────────────────────────
TOTAL HARGA : Rp${Number(totalText).toLocaleString("id-ID")}
(${terbilang(Number(totalText))} rupiah)
─────────────────────────────
-TERIMAKASIH-`
  );

  submitBtn.setAttribute("data-wa", `https://wa.me/${waNumber}?text=${message}`);
}

// 1️⃣4️⃣ TAMPILKAN STRUK / INVOICE
function showInvoicePopup(){
  const nama = nameInput.value.trim();
  const tanggal = dateInput.value;
  const waktu = startInput.value;
  const durasi = Number(durationInput.value);
  const konsol = consoleSelect.value;
  const room = roomSelect.value;
  const roomType = getRoomType(room);
  const rate = priceList[roomType]?.[konsol] || 0;
  const totalHarga = rate * durasi;

  // set initial totals & clear promo input/message
  finalTotal = totalHarga;
  appliedPromo = "";
  promoInput.value = "";
  promoMessage.textContent = "";

  // simpan total asli untuk referensi
  totalEl.dataset.original = totalHarga;

  document.getElementById("invName").textContent = nama;
  document.getElementById("invDate").textContent = tanggal;
  document.getElementById("invTime").textContent = waktu;
  document.getElementById("invConsole").textContent = konsol;
  document.getElementById("invRoom").textContent = room;
  document.getElementById("invRate").textContent = `Rp${rate.toLocaleString("id-ID")}`;
  document.getElementById("invDuration").textContent = `${durasi} Jam`;
  document.getElementById("invHarga").textContent = `TOTAL DIBAYAR : Rp${totalHarga.toLocaleString("id-ID")}`;
  document.getElementById("invTerbilang").textContent = `(${terbilang(totalHarga)} rupiah)`;
  document.getElementById("invPrintDate").textContent = new Date().toLocaleString("id-ID");

  let note = "";
  if (roomType === "VIP") note = "👥 Maks 4 orang | 🚭 Tidak boleh merokok";
  if (roomType === "VVIP") note = "👥 Maks 10 orang | 🚭 Tidak boleh merokok";
  if (roomType === "Smoking") note = "🚬 Diperbolehkan merokok";
  if (roomType === "Reguler") note = "🚭 Tidak diperkenankan merokok";
  document.getElementById("vipWarning").textContent = note;

  // tampilan invoice
  invoicePopup.style.display = "flex";
  document.body.style.overflow = "hidden";

  // hitung jarak (satu kali) dan update WA link
  calculateDistanceInvoice();
  updateWaLink();
}

// 1️⃣5️⃣ CEK KETERSEDIAAN + WA LINK
async function checkAvailability(){
  const nameVal = nameInput.value.trim();
  const dateVal = dateInput.value;
  const startVal = normalizeTime(startInput.value);
  const roomVal = roomSelect.value;
  const consoleVal = consoleSelect.value;
  const durationVal = Number(durationInput.value);

  if(!nameVal || !dateVal || !startVal || !roomVal || !consoleVal || !durationVal){
    statusDiv.style.display="none"; submitBtn.disabled=true; return;
  }

  statusDiv.style.display="block";
  statusDiv.innerHTML=`<span class="spinner"></span>Memeriksa ketersediaan...`;

  await loadLatestData();

  setTimeout(()=>{
    const startTime = toMinutes(startVal);
    const endTime = startTime + durationVal*60;
    const isOverlap = bookedData.some(b=>{
      if(b.date!==dateVal || b.room!==roomVal) return false;
      const bStart = toMinutes(b.start); const bEnd = bStart + b.duration*60;
      return startTime < bEnd && endTime > bStart;
    });

    if(isOverlap){
      statusDiv.textContent="❌ MAAF, room sudah dibooking di jam tersebut.";
      showDecisionPopup("Ruangan Tidak Tersedia","❌ Ruangan sudah dibooking di jam tersebut.","UBAH RUANGAN","BATAL",()=>{
        roomSelect.value=""; statusDiv.textContent="";
      },()=>{
        document.getElementById("bookingModal").style.display="none"; document.body.style.overflow="auto";
      });
    } else {
      const rate = priceList[getRoomType(roomVal)]?.[consoleVal]||0;
      const totalHarga = rate * durationVal;
      finalTotal = totalHarga;
      appliedPromo = "";

      // IMPORTANT: tidak memanggil auto-promo apapun di sini.
      // Promo hanya berlaku ketika user memasukkan kode di invoice.

      updateWaLink();

      showDecisionPopup("Ruangan Tersedia 🎉","✅ Ruangan tersedia untuk dipesan.<br><br>Lanjutkan ke konfirmasi?","LANJUTKAN","BATAL",
        ()=>showInvoicePopup(),
        ()=>{
          document.getElementById("bookingModal").style.display="none"; document.body.style.overflow="auto";
        });
    }
  },400);
}
[dateInput, startInput, durationInput, roomSelect, consoleSelect, nameInput].forEach(el => {
  el.addEventListener("input", checkAvailability);
  el.addEventListener("change", checkAvailability);
});

// 1️⃣6️⃣ KONFIRMASI / EDIT / WHATSAPP
document.addEventListener("click", e=>{
  if(e.target.id === "editData") {
    invoicePopup.style.display = "none";
    document.body.style.overflow = "auto";
  }
  if(e.target.id === "confirmWA"){
    // Pastikan finalTotal & appliedPromo sesuai keadaan invoice (jika user mengetik kode, applyPromoManual sudah dijalankan)
    // Build WA link lagi to be safe
    updateWaLink();
    const waLink = submitBtn.getAttribute("data-wa");
    if(waLink) window.open(waLink, "_blank");
    invoicePopup.style.display="none";
    document.getElementById("bookingModal").style.display="none";
    bookingForm.reset(); statusDiv.textContent=""; document.body.style.overflow="auto";
  }
});

// 1️⃣7️⃣ INIT LOAD
(async()=>{ await loadLatestData(); console.log("🚀 Sistem booking siap — promo hanya diterapkan bila input di invoice!"); })();

// 1️⃣8️⃣ KOORDINAT & JARAK OTOMATIS (watchPosition untuk update jarak live)
const gamezoneLat = -0.949223;
const gamezoneLng = 100.354821;
function deg2rad(deg){ return deg*(Math.PI/180); }
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=deg2rad(lat2-lat1);
  const dLon=deg2rad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}
const distanceEl = document.getElementById("invDistance");
if(navigator.geolocation){
  // watchPosition agar jarak update jika user bergerak (sesuai permintaan)
  navigator.geolocation.watchPosition(
    pos=>{
      const km = getDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, gamezoneLat, gamezoneLng);
      if(distanceEl) distanceEl.textContent = km.toFixed(2) + " km";
    },
    ()=>{ if(distanceEl) distanceEl.textContent="Tidak bisa mendapatkan lokasi"; },
    { enableHighAccuracy:true, maximumAge:5000, timeout:10000 }
  );
} else {
  if(distanceEl) distanceEl.textContent="Browser tidak mendukung Geolocation";
}

// Utility: calculate distance single-time (dipakai saat membuka invoice)
function calculateDistanceInvoice() {
  if (!navigator.geolocation) {
    if(distanceEl) distanceEl.textContent = "Browser tidak mendukung Geolocation";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const km = getDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, gamezoneLat, gamezoneLng);
      if(distanceEl) distanceEl.textContent = km.toFixed(2) + " km";
    },
    () => { if(distanceEl) distanceEl.textContent = "Tidak bisa mendapatkan lokasi"; }
  );
}
