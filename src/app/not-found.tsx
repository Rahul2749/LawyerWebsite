import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container text-center max-w-lg">
        <p className="font-serif text-[8rem] lg:text-[12rem] font-light text-accent-gold/20 leading-none select-none">
          404
        </p>
        <h1 className="text-h2 -mt-8 mb-4">
          Page <span className="italic">Not Found</span>
        </h1>
        <p className="text-body text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
