import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-600 mb-4">
        404
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Page not found
      </h1>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try
        the navigation above, or head back to the homepage.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}