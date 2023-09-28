import Link from "next/link"

export function NavBar () {
  // Render
  return (
    <nav className="bg-black">
      <div className="mx-8 border-b border-gray-700">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  className="h-8 w-auto"
                  src="/f3d.png"
                  alt="Fill 3D"
                />
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex gap-x-12 items-center">
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}