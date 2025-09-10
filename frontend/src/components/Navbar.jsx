import { useAuthStore } from '../store/useAuthStore.js'
import { Link } from 'react-router-dom'
import { Origami, User, LogOut, Settings } from 'lucide-react'

const Navbar = () => {

  const { authUser, logout } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Origami className="size-8 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Virgin²</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              flex gap-2 items-center text-white-600 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors
              
              `}
            >
              <Settings className="size-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`flex gap-2 items-center text-white-600 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center text-red-600 hover:text-red-700 hover:bg-red-100 px-2 py-1 rounded-md transition-colors"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar