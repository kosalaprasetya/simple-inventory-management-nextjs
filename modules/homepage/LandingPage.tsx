import Link from "next/link";

const LandingPage = () => {
  return (
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* 1. CTA / Hero Section */}
      <section
        id="cta"
        className="border-foreground/10 flex h-screen flex-col items-center justify-center border-b px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Sistem Manajemen Inventaris Cerdas
          </h1>
          <p className="text-foreground/70 mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
            Pantau stok barang, kelola pesanan, dan optimalkan bisnis Anda
            secara real-time. Tinggalkan pencatatan manual dan tingkatkan
            efisiensi hari ini.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="bg-foreground text-background w-full cursor-pointer rounded-lg px-8 py-3 font-semibold shadow-sm transition hover:opacity-90 sm:max-w-64"
            >
              Masuk / Daftar
            </Link>
            <button className="border-foreground/20 text-foreground hover:bg-foreground/5 w-full rounded-lg border bg-transparent px-8 py-3 font-semibold transition sm:max-w-64">
              Jadwalkan Demo
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">Fitur Unggulan Kami</h2>
            <p className="text-foreground/70 mt-4 text-lg">
              Segala yang Anda butuhkan untuk mengelola gudang tanpa pusing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature Card 1 */}
            <div className="bg-background border-foreground/10 hover:border-foreground/30 rounded-2xl border p-8 transition duration-300 hover:shadow-sm">
              <div className="bg-foreground/5 text-foreground border-foreground/10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border text-2xl">
                📦
              </div>
              <h3 className="mb-3 text-xl font-bold">Pelacakan Real-time</h3>
              <p className="text-foreground/70 leading-relaxed">
                Ketahui persis berapa jumlah stok Anda di berbagai lokasi gudang
                secara langsung tanpa delay.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-background border-foreground/10 hover:border-foreground/30 rounded-2xl border p-8 transition duration-300 hover:shadow-sm">
              <div className="bg-foreground/5 text-foreground border-foreground/10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border text-2xl">
                ⚠️
              </div>
              <h3 className="mb-3 text-xl font-bold">
                Peringatan Stok Otomatis
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                Cegah kehabisan barang. Dapatkan notifikasi langsung ke email
                atau WhatsApp ketika stok mencapai batas minimum.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-background border-foreground/10 hover:border-foreground/30 rounded-2xl border p-8 transition duration-300 hover:shadow-sm">
              <div className="bg-foreground/5 text-foreground border-foreground/10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border text-2xl">
                📊
              </div>
              <h3 className="mb-3 text-xl font-bold">Laporan Analitik</h3>
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
        className="bg-foreground/5 border-foreground/10 border-y px-6 py-20 lg:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-6 text-3xl font-bold">Tentang Kami</h2>
            <p className="text-foreground/80 mb-4 text-lg leading-relaxed">
              Kami memulai perjalanan ini dengan satu misi:{" "}
              <strong>menyederhanakan operasional bisnis</strong>. Kami tahu
              bahwa mengurus inventaris secara manual sangat menyita waktu dan
              rawan kesalahan.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Oleh karena itu, kami membangun platform ini untuk membantu UMKM
              hingga skala Enterprise agar dapat fokus pada pertumbuhan bisnis,
              bukan sekadar menghitung barang di gudang.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-background border-foreground/20 text-foreground/50 flex h-72 items-center justify-center rounded-2xl border-2 border-dashed shadow-inner">
              <span className="text-lg font-medium">
                [Ilustrasi / Foto Tim di Sini]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer Section */}
      <footer
        id="footer"
        className="bg-background border-foreground/10 border-t px-6 py-12 lg:px-8"
      >
        <div className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h4 className="mb-4 text-2xl font-bold tracking-tight">
              InventoSys
            </h4>
            <p className="text-foreground/60 mb-6 max-w-sm">
              Solusi cerdas untuk manajemen stok, rantai pasok, dan pemenuhan
              pesanan Anda.
            </p>
          </div>

          <div>
            <h4 className="text-foreground/80 mb-4 text-sm font-semibold tracking-wider uppercase">
              Perusahaan
            </h4>
            <ul className="text-foreground/60 space-y-3">
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
            <h4 className="text-foreground/80 mb-4 text-sm font-semibold tracking-wider uppercase">
              Kontak
            </h4>
            <ul className="text-foreground/60 space-y-3">
              <li>hello@inventosys.id</li>
              <li>+62 811 2233 4455</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-foreground/10 text-foreground/60 mx-auto flex max-w-6xl flex-col items-center justify-between border-t pt-8 text-center text-sm md:flex-row md:text-left">
          <p>
            &copy; {new Date().getFullYear()} InventoSys. Hak Cipta Dilindungi.
          </p>
          <div className="mt-4 space-x-4 md:mt-0">
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
