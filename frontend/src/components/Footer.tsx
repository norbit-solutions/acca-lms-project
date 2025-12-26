import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xl font-display">Learn Spear</p>
        <div className="flex gap-8 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-black transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-black transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-sm text-gray-400">© 2025 NorBit Solutions</p>
      </div>
    </footer>
  );
}
