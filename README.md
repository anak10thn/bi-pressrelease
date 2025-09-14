# BI Press Release Scraper

Web scraper headless menggunakan Puppeteer untuk mengumpulkan link press release dari situs Bank Indonesia.

## Features

- ✅ Scraping otomatis dengan navigasi halaman
- ✅ Mode headless untuk performa optimal
- ✅ Dukungan Docker untuk deployment mudah
- ✅ Konfigurasi jumlah iterasi yang fleksibel
- ✅ Penghapusan duplikasi link otomatis
- ✅ Output ke file text yang terstruktur

## Prerequisites

### Local Development
- Node.js 16+ 
- npm atau yarn

### Docker Deployment
- Docker
- Docker Compose (optional)

## Installation & Usage

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Jalankan scraper:
```bash
# Default 10 iterasi
node scraper.js

# Custom iterasi
node scraper.js 100   # untuk 100 halaman
node scraper.js 1000  # untuk 1000 halaman
```

3. Hasil akan disimpan di `./output/press-release-bi.txt`

### Docker Deployment

#### Option 1: Docker Build & Run

1. Build Docker image:
```bash
docker build -t bi-scraper .
```

2. Run container:
```bash
# Default 10 iterasi
docker run -v $(pwd)/output:/usr/src/app/output bi-scraper

# Custom iterasi
docker run -v $(pwd)/output:/usr/src/app/output bi-scraper node scraper.js 500
```

#### Option 2: Docker Compose

1. Run dengan default settings (100 iterasi):
```bash
docker-compose up bi-scraper
```

2. Run dengan custom iterasi:
```bash
docker-compose run --rm bi-scraper-custom node scraper.js 1000
```

3. Run in background:
```bash
docker-compose up -d bi-scraper
```

## Output

Scraper akan menghasilkan file `./output/press-release-bi.txt` yang berisi:
- Satu URL per baris
- Link press release unik (duplikasi dihapus)
- Format: `https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_*.aspx`

## Configuration

### Environment Variables
- `NODE_ENV`: Set ke `production` untuk deployment

### Script Parameters
- Argument pertama: Jumlah iterasi/halaman yang akan di-scrape
- Default: 10 iterasi jika tidak ada argument

## File Structure

```
├── scraper.js              # Main scraper script
├── package.json            # Node.js dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── .dockerignore          # Docker ignore rules
├── .gitignore             # Git ignore rules
├── README.md              # Documentation
└── output/                # Output directory
    └── press-release-bi.txt
```

## Technical Details

### Puppeteer Configuration
- Headless mode enabled
- Chrome browser dengan optimasi untuk container
- Timeout: 15 detik per operasi
- User agent: Chrome desktop

### Navigation Strategy
- Menggunakan multiple selector fallback untuk tombol "Next"
- Wait strategy dengan timeout untuk memastikan halaman loaded
- Error handling untuk halaman yang tidak dapat diakses

### Docker Optimization
- Multi-stage build untuk ukuran image minimal
- Non-root user untuk security
- Volume mounting untuk persistent output
- Optimized Chrome installation untuk container

## Troubleshooting

### Common Issues

1. **Timeout Error**: Increase timeout di script atau cek koneksi internet
2. **No Links Found**: Website mungkin berubah struktur, perlu update selector
3. **Docker Permission Error**: Pastikan volume mounting path benar
4. **Chrome Not Found**: Rebuild Docker image dengan `--no-cache`

### Debug Mode

Untuk debugging, ubah `headless: true` menjadi `headless: false` di `scraper.js`.

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - lihat file LICENSE untuk detail.