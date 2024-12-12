// Array untuk menyimpan jurnal umum dan jurnal penyesuaian
let jurnalUmum = [];
let jurnalPenyesuaian = [];
let bukuBesar = {};
let neracaSaldo = {};
let laporanLabaRugi = { pendapatan: 0, beban: 0 };

// Fungsi untuk menampilkan halaman
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  const selectedPage = document.getElementById(pageId);
  selectedPage.classList.add("active");
}

// Fungsi untuk menampilkan form tambah jurnal
function showAddForm(pageId) {
  const akun = prompt("Masukkan Nama Akun:");
  const debit = parseInt(prompt("Masukkan Jumlah Debit:"));
  const kredit = parseInt(prompt("Masukkan Jumlah Kredit:"));
  const tanggal = new Date().toLocaleDateString();

  if (pageId === "jurnal-umum") {
    addJurnal(jurnalUmum, akun, debit, kredit, tanggal);
  } else if (pageId === "jurnal-penyesuaian") {
    addJurnal(jurnalPenyesuaian, akun, debit, kredit, tanggal);
  }
}

// Fungsi untuk menambahkan jurnal ke array
function addJurnal(jurnalArray, akun, debit, kredit, tanggal) {
  // Validasi input
  if (!akun || isNaN(debit) || isNaN(kredit)) {
    alert("Data tidak lengkap!");
    return;
  }

  // Menambahkan jurnal baru
  jurnalArray.push({ akun, debit, kredit, tanggal });

  // Update tabel setelah menambahkan jurnal
  updateTabel("jurnal-umum");
  updateTabel("jurnal-penyesuaian");
  updateBukuBesar();
  updateNeracaSaldo();
  updateLaporanLabaRugi();
}

// Fungsi untuk memperbarui tabel
function updateTabel(pageId) {
  const tabel = document.querySelector(`#tabel-${pageId} tbody`);
  tabel.innerHTML = ""; // Reset tabel

  let jurnalArray = pageId === "jurnal-umum" ? jurnalUmum : jurnalPenyesuaian;
  jurnalArray.forEach((jurnal, index) => {
    let row = tabel.insertRow();
    row.insertCell(0).textContent = jurnal.tanggal;
    row.insertCell(1).textContent = jurnal.akun;
    row.insertCell(2).textContent = `Rp ${jurnal.debit.toLocaleString()}`;
    row.insertCell(3).textContent = `Rp ${jurnal.kredit.toLocaleString()}`;
    let actionCell = row.insertCell(4);
    actionCell.innerHTML = `<button onclick="editJurnal(${index}, '${pageId}')">Edit</button> <button onclick="hapusJurnal(${index}, '${pageId}')">Hapus</button>`;
  });
}

// Fungsi untuk mengedit jurnal
function editJurnal(index, pageId) {
  let jurnalArray = pageId === "jurnal-umum" ? jurnalUmum : jurnalPenyesuaian;
  const jurnal = jurnalArray[index];

  const akun = prompt("Masukkan Nama Akun:", jurnal.akun);
  const debit = parseInt(prompt("Masukkan Jumlah Debit:", jurnal.debit));
  const kredit = parseInt(prompt("Masukkan Jumlah Kredit:", jurnal.kredit));

  if (akun && !isNaN(debit) && !isNaN(kredit)) {
    jurnalArray[index] = {
      akun,
      debit,
      kredit,
      tanggal: new Date().toLocaleDateString(),
    };
    updateTabel(pageId);
    updateBukuBesar();
    updateNeracaSaldo();
    updateLaporanLabaRugi();
  } else {
    alert("Data tidak valid!");
  }
}

// Fungsi untuk menghapus jurnal
function hapusJurnal(index, pageId) {
  if (confirm("Yakin ingin menghapus jurnal ini?")) {
    let jurnalArray = pageId === "jurnal-umum" ? jurnalUmum : jurnalPenyesuaian;
    jurnalArray.splice(index, 1);
    updateTabel(pageId);
    updateBukuBesar();
    updateNeracaSaldo();
    updateLaporanLabaRugi();
  }
}

// Fungsi untuk memperbarui Buku Besar
function updateBukuBesar() {
  bukuBesar = {}; // Reset Buku Besar
  const tabel = document.querySelector("#tabel-buku-besar tbody");
  tabel.innerHTML = "";

  // Mengumpulkan data dari jurnal umum dan jurnal penyesuaian
  const allJournals = [...jurnalUmum, ...jurnalPenyesuaian];
  allJournals.forEach((jurnal) => {
    if (!bukuBesar[jurnal.akun]) {
      bukuBesar[jurnal.akun] = { debit: 0, kredit: 0 };
    }
    bukuBesar[jurnal.akun].debit += jurnal.debit;
    bukuBesar[jurnal.akun].kredit += jurnal.kredit;
  });

  // Tampilkan di tabel Buku Besar
  for (const akun in bukuBesar) {
    let row = tabel.insertRow();
    row.insertCell(0).textContent = akun;
    row.insertCell(1).textContent = `Rp ${bukuBesar[
      akun
    ].debit.toLocaleString()}`;
    row.insertCell(2).textContent = `Rp ${bukuBesar[
      akun
    ].kredit.toLocaleString()}`;
    row.insertCell(3).textContent = `Rp ${(
      bukuBesar[akun].debit - bukuBesar[akun].kredit
    ).toLocaleString()}`;
  }
}

// Fungsi untuk memperbarui Neraca Saldo
function updateNeracaSaldo() {
  neracaSaldo = {}; // Reset Neraca Saldo
  const tabel = document.querySelector("#tabel-neraca-saldo tbody");
  tabel.innerHTML = "";

  // Mengumpulkan data dari jurnal umum dan jurnal penyesuaian
  const allJournals = [...jurnalUmum, ...jurnalPenyesuaian];
  allJournals.forEach((jurnal) => {
    if (!neracaSaldo[jurnal.akun]) {
      neracaSaldo[jurnal.akun] = { debit: 0, kredit: 0 };
    }
    neracaSaldo[jurnal.akun].debit += jurnal.debit;
    neracaSaldo[jurnal.akun].kredit += jurnal.kredit;
  });

  // Tampilkan di tabel Neraca Saldo
  for (const akun in neracaSaldo) {
    let row = tabel.insertRow();
    row.insertCell(0).textContent = akun;
    row.insertCell(1).textContent = `Rp ${neracaSaldo[
      akun
    ].debit.toLocaleString()}`;
    row.insertCell(2).textContent = `Rp ${neracaSaldo[
      akun
    ].kredit.toLocaleString()}`;
  }
}

// Fungsi untuk memperbarui Laporan Laba Rugi
function updateLaporanLabaRugi() {
  laporanLabaRugi = { pendapatan: 0, beban: 0 };
  const tabel = document.querySelector("#tabel-laba-rugi tbody");
  tabel.innerHTML = "";

  // Mengumpulkan data dari jurnal umum dan jurnal penyesuaian
  const allJournals = [...jurnalUmum, ...jurnalPenyesuaian];
  allJournals.forEach((jurnal) => {
    // Jika akun berisi "Pendapatan", tambahkan ke pendapatan
    if (jurnal.akun.toLowerCase().includes("pendapatan")) {
      laporanLabaRugi.pendapatan += jurnal.kredit;
    }
    // Jika akun berisi "Beban", tambahkan ke beban
    else if (jurnal.akun.toLowerCase().includes("beban")) {
      laporanLabaRugi.beban += jurnal.debit;
    }
  });

  // Tampilkan di tabel Laporan Laba Rugi
  let row = tabel.insertRow();
  row.insertCell(0).textContent = "Pendapatan";
  row.insertCell(
    1
  ).textContent = `Rp ${laporanLabaRugi.pendapatan.toLocaleString()}`;

  row = tabel.insertRow();
  row.insertCell(0).textContent = "Beban";
  row.insertCell(
    1
  ).textContent = `Rp ${laporanLabaRugi.beban.toLocaleString()}`;

  row = tabel.insertRow();
  row.insertCell(0).textContent = "Laba Bersih";
  row.insertCell(1).textContent = `Rp ${(
    laporanLabaRugi.pendapatan - laporanLabaRugi.beban
  ).toLocaleString()}`;
}
