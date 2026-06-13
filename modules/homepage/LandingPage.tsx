import Link from "next/link";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* 1. CTA / Hero Section */}
      <section
        id="cta"
        className="py-24 px-6 lg:px-8 border-b border-foreground/10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Sistem Manajemen Inventaris Cerdas
          </h1>
          <p className="text-lg md:text-xl mb-10 text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Pantau stok barang, kelola pesanan, dan optimalkan bisnis Anda
            secara real-time. Tinggalkan pencatatan manual dan tingkatkan
            efisiensi hari ini.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" passHref>
              <button className="cursor-pointer bg-foreground text-background px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-sm">
                Masuk / Daftar
              </button>
            </Link>
            <button className="bg-transparent border border-foreground/20 text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-foreground/5 transition">
              Jadwalkan Demo
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Fitur Unggulan Kami</h2>
            <p className="text-foreground/70 mt-4 text-lg">
              Segala yang Anda butuhkan untuk mengelola gudang tanpa pusing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-background p-8 rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:shadow-sm transition duration-300">
              <div className="w-14 h-14 bg-foreground/5 text-foreground rounded-xl flex items-center justify-center mb-6 text-2xl border border-foreground/10">
                📦
              </div>
              <h3 className="text-xl font-bold mb-3">Pelacakan Real-time</h3>
              <p className="text-foreground/70 leading-relaxed">
                Ketahui persis berapa jumlah stok Anda di berbagai lokasi gudang
                secara langsung tanpa delay.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-background p-8 rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:shadow-sm transition duration-300">
              <div className="w-14 h-14 bg-foreground/5 text-foreground rounded-xl flex items-center justify-center mb-6 text-2xl border border-foreground/10">
                ⚠️
              </div>
              <h3 className="text-xl font-bold mb-3">
                Peringatan Stok Otomatis
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Cegah kehabisan barang. Dapatkan notifikasi langsung ke email
                atau WhatsApp ketika stok mencapai batas minimum.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-background p-8 rounded-2xl border border-foreground/10 hover:border-foreground/30 hover:shadow-sm transition duration-300">
              <div className="w-14 h-14 bg-foreground/5 text-foreground rounded-xl flex items-center justify-center mb-6 text-2xl border border-foreground/10">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Laporan Analitik</h3>
              <p className="text-foreground/70 leading-relaxed">
                Identifikasi barang paling laris dan pantau pergerakan finansial
                Anda dengan laporan visual yang mudah dipahami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Us Section */}
      <section
        id="about-us"
        className="bg-foreground/5 py-20 px-6 lg:px-8 border-y border-foreground/10"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Tentang Kami</h2>
            <p className="text-foreground/80 mb-4 leading-relaxed text-lg">
              Kami memulai perjalanan ini dengan satu misi:{" "}
              <strong>menyederhanakan operasional bisnis</strong>. Kami tahu
              bahwa mengurus inventaris secara manual sangat menyita waktu dan
              rawan kesalahan.
            </p>
            <p className="text-foreground/80 leading-relaxed text-lg">
              Oleh karena itu, kami membangun platform ini untuk membantu UMKM
              hingga skala Enterprise agar dapat fokus pada pertumbuhan bisnis,
              bukan sekadar menghitung barang di gudang.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-background h-72 rounded-2xl border-2 border-dashed border-foreground/20 flex items-center justify-center text-foreground/50 shadow-inner">
              <span className="font-medium text-lg">
                [Ilustrasi / Foto Tim di Sini]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer Section */}
      <footer
        id="footer"
        className="bg-background py-12 px-6 lg:px-8 border-t border-foreground/10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h4 className="text-2xl font-bold mb-4 tracking-tight">
              InventoSys
            </h4>
            <p className="max-w-sm mb-6 text-foreground/60">
              Solusi cerdas untuk manajemen stok, rantai pasok, dan pemenuhan
              pesanan Anda.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider text-foreground/80">
              Perusahaan
            </h4>
            <ul className="space-y-3 text-foreground/60">
              <li>
                <a
                  href="#about-us"
                  className="hover:text-foreground transition"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition">
                  Harga
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider text-foreground/80">
              Kontak
            </h4>
            <ul className="space-y-3 text-foreground/60">
              <li>hello@inventosys.id</li>
              <li>+62 811 2233 4455</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-foreground/10 pt-8 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center text-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} InventoSys. Hak Cipta Dilindungi.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-foreground transition">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-foreground transition">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
