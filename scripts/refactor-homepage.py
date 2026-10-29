from pathlib import Path
import re
import shutil

root = Path("client/src/features/public")
source = root / "HomePage.jsx"
components = root / "components"

if not source.exists():
    raise SystemExit("HomePage.jsx tidak ditemukan.")

text = source.read_text()

if components.exists() and any(components.iterdir()):
    raise SystemExit(
        "Folder components sudah berisi file. "
        "Batalkan agar tidak menimpa kode yang ada."
    )

markers = [
    "function CountUp(",
    "function Navbar()",
    "function Hero(",
    "function Statistics(",
    "function AboutSection()",
    "function ProgramSection()",
    "function NewsSection(",
    "function ContactSection()",
    "function Footer()",
    "export default function HomePage()",
]

positions = [text.find(marker) for marker in markers]

if any(position < 0 for position in positions):
    raise SystemExit(
        "Struktur HomePage.jsx berbeda dari yang diaudit. "
        "Tidak ada file yang diubah."
    )

if positions != sorted(positions) or len(set(positions)) != len(positions):
    raise SystemExit("Urutan fungsi tidak sesuai. Refactor dibatalkan.")

program_start = text.find("const programs = [")
program_end = text.find("\n];", program_start)

if program_start < 0 or program_end < 0:
    raise SystemExit("Deklarasi programs tidak ditemukan.")

programs = text[program_start:program_end + 3]

parts = {}
for index, marker in enumerate(markers):
    start = positions[index]
    end = positions[index + 1] if index + 1 < len(markers) else len(text)
    parts[marker] = text[start:end].strip()

files = {
    "CountUp.jsx": (
        "",
        parts["function CountUp("].replace(
            "function CountUp(", "export default function CountUp(", 1
        ),
    ),
    "Navbar.jsx": (
        'import { useState } from "react";\nimport { Link } from "react-router-dom";\n',
        parts["function Navbar()"].replace(
            "function Navbar()", "export default function Navbar()", 1
        ),
    ),
    "HeroSection.jsx": (
        'import heroImage from "../../../assets/hero.png";\n'
        'import Navbar from "./Navbar";\n'
        'import CountUp from "./CountUp";\n',
        parts["function Hero("].replace(
            "function Hero(", "export default function HeroSection(", 1
        ),
    ),
    "StatisticsSection.jsx": (
        'import CountUp from "./CountUp";\n',
        parts["function Statistics("].replace(
            "function Statistics(", "export default function StatisticsSection(", 1
        ),
    ),
    "AboutSection.jsx": (
        "",
        parts["function AboutSection()"].replace(
            "function AboutSection()", "export default function AboutSection()", 1
        ),
    ),
    "ProgramsSection.jsx": (
        programs + "\n\n",
        parts["function ProgramSection()"].replace(
            "function ProgramSection()", "export default function ProgramsSection()", 1
        ),
    ),
    "NewsSection.jsx": (
        'import { Link } from "react-router-dom";\n',
        parts["function NewsSection("].replace(
            "function NewsSection(", "export default function NewsSection(", 1
        ),
    ),
    "ContactSection.jsx": (
        'import { Link } from "react-router-dom";\n',
        parts["function ContactSection()"].replace(
            "function ContactSection()", "export default function ContactSection()", 1
        ),
    ),
    "Footer.jsx": (
        'import { Link } from "react-router-dom";\n',
        parts["function Footer()"].replace(
            "function Footer()", "export default function Footer()", 1
        ),
    ),
}

home_imports = """import { useEffect, useState } from "react";
import { getPublicNews } from "../dashboard/publicNewsService";
import HeroSection from "./components/HeroSection";
import StatisticsSection from "./components/StatisticsSection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import NewsSection from "./components/NewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

"""

home = parts["export default function HomePage()"]
home = re.sub(r"<Hero articleCount=", "<HeroSection articleCount=", home)
home = home.replace("</Hero>", "</HeroSection>")
home = re.sub(r"<Statistics articleCount=", "<StatisticsSection articleCount=", home)
home = home.replace("</Statistics>", "</StatisticsSection>")
home = home.replace("<ProgramSection />", "<ProgramsSection />")

new_home = home_imports + home + "\n"

# Verify expected component references before writing anything.
for expected in [
    "<HeroSection ",
    "<StatisticsSection ",
    "<AboutSection />",
    "<ProgramsSection />",
    "<NewsSection",
    "<ContactSection />",
    "<Footer />",
]:
    if expected not in new_home:
        raise SystemExit(f"Referensi komponen tidak ditemukan: {expected}")

backup = source.with_suffix(".jsx.before-refactor")
shutil.copy2(source, backup)

try:
    components.mkdir(parents=True, exist_ok=True)

    for filename, (imports, body) in files.items():
        (components / filename).write_text(
            imports + body.rstrip() + "\n"
        )

    source.write_text(new_home)

except Exception:
    shutil.copy2(backup, source)
    raise

print("Refactor selesai.")
print(f"Backup homepage: {backup}")
print(f"Komponen dibuat: {len(files)}")
print(f"Homepage baru: {source}")
