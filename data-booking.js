// =============================================================
// 📄 data-booking.js
// -------------------------------------------------------------
// File ini berisi konfigurasi data utama untuk sistem booking
// dan juga digunakan oleh sistem monitoring agar sinkron otomatis.
// =============================================================


// ✅ 1. NOMOR WHATSAPP ADMIN
const waNumber = "6282389224224"; // 🟢 Ganti dengan nomor WhatsApp kamu


// ✅ 2. DATA PEMESANAN (dipakai oleh Website Pemesanan & Monitoring)
const bookedData = [
  // === Contoh: satu ruangan punya dua jadwal di tanggal yang sama ===
  { nama: "KOSONG", date: "2025-11-01", start: "09:32", duration: 2, konsol: "PS4", room: "Reguler 1", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "SOBOK", date: "2025-11-02", start: "20:00", duration: 2, konsol: "PS4", room: "Reguler 1", order_via: "Via WA", operator: "RIZKI" },
  { nama: "KIKI", date: "2025-11-03", start: "22:00", duration: 1, konsol: "PS4", room: "Reguler 1", order_via: "Via IG", operator: "LEO" },

  // === Data ruangan lainnya ===
  { nama: "SSS", date: "2025-11-01", start: "17:52", duration: 1, konsol: "PS4", room: "Reguler 2", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "19:18", duration: 1.5, konsol: "PS5", room: "Reguler 3", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS5", room: "Reguler 4", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-07", start: "10:00", duration: 2, konsol: "PS4", room: "Reguler 5", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-07", start: "10:00", duration: 2, konsol: "PS4", room: "Reguler 6", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-07", start: "10:28", duration: 1, konsol: "PS4", room: "Reguler 7", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-07", start: "09:30", duration: 2, konsol: "PS4", room: "Reguler 8", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS5", room: "Smoking 9", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "SMA", date: "2025-11-01", start: "11:30", duration: 1, konsol: "PS4", room: "Smoking 10", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "UPI", date: "2025-11-01", start: "11:30", duration: 1, konsol: "PS4", room: "Smoking 11", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS4", room: "Smoking 12", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS4", room: "Smoking 13", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "20:00", duration: 2, konsol: "PS4", room: "VIP 1", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "PUTIH", date: "2025-11-01", start: "20:40", duration: 1, konsol: "PS4", room: "VIP 2", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "WILDO", date: "2025-11-01", start: "20:30", duration: 2, konsol: "PS4", room: "VIP 3", order_via: "Via WA", operator: "RIZKI" },
  { nama: "SMP", date: "2025-11-01", start: "12:45", duration: 2, konsol: "PS4", room: "VIP 4", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS5", room: "VIP 5", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "KOSONG", date: "2025-11-01", start: "00:00", duration: 0, konsol: "PS5", room: "VIP 6", order_via: "Datang Langsung", operator: "RIZKI" },
  { nama: "ISI", date: "2025-11-01", start: "10:20", duration: 1, konsol: "PS5", room: "VVIP 1", order_via: "Datang Langsung", operator: "RIZKI" },
];


// ✅ 3. DAFTAR HARGA
const priceList = {
  Reguler: { PS4: 10000, PS5: 15000 },
  Smoking: { PS4: 12000, PS5: 17000 },
  VIP: { PS4: 20000, PS5: 25000 },
  VVIP: { PS4: 75000, PS5: 75000 },
};


// ✅ 4. STRUKTUR ROOM BERDASARKAN KONSOL
const roomsByConsole = {
  PS4: [
    {
      group: "Reguler",
      list: ["Reguler 1", "Reguler 2", "Reguler 5", "Reguler 6", "Reguler 7", "Reguler 8"],
    },
    {
      group: "Smoking",
      list: ["Smoking 10", "Smoking 11", "Smoking 12", "Smoking 13"],
    },
    {
      group: "VIP",
      list: ["VIP 1", "VIP 2", "VIP 3", "VIP 4"],
    },
    {
      group: "VVIP",
      list: ["VVIP 1"],
    },
  ],

  PS5: [
    {
      group: "Reguler",
      list: ["Reguler 3", "Reguler 4"],
    },
    {
      group: "Smoking",
      list: ["Smoking 9"],
    },
    {
      group: "VIP",
      list: ["VIP 5", "VIP 6"],
    },
    {
      group: "VVIP",
      list: ["VVIP 1"],
    },
  ],
};


// =============================================================
// 🔁 5. AUTO UPDATE UNTUK WEBSITE MONITORING
// -------------------------------------------------------------
// Jika file ini digunakan oleh halaman monitoring, kita ekspor data
// agar bisa diakses oleh script.js tanpa refresh manual.
// =============================================================

if (typeof window !== "undefined") {
  window.bookedData = bookedData;
}



