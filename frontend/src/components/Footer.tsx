import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-blue-400 mb-4">ACCA LMS</h3>
            <p className="text-gray-400 max-w-md">
              Your trusted platform for ACCA exam preparation. 
              Quality video lessons from experienced instructors.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
              <li><Link href="/#features" className="hover:text-white">Features</Link></li>
              <li><Link href="/#testimonials" className="hover:text-white">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>WhatsApp: +94 XX XXX XXXX</li>
              <li>Email: info@accalms.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ACCA LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
