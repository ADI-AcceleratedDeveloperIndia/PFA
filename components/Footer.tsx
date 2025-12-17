import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-2">
        <span className="text-xs text-gray-500">Built by</span>
        <a
          href="https://aideveloperindia.store"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <Image
            src="/A-logo-transparent.png"
            alt="AI Developer India"
            width={24}
            height={24}
            className="h-6 w-auto object-contain"
          />
          <span className="text-xs font-medium text-gray-700">
            AI Developer India
          </span>
        </a>
      </div>
    </footer>
  );
}


