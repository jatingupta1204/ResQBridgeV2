// Header.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-red-700 text-xl">ResQ Bridge</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/report" className="transition-colors hover:text-foreground/80">
              Report Emergency 
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
          </nav>
        </div>

        {/* Right Side: Action Buttons & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="destructive" size="sm" asChild>
            <Link to="/sos" className="flex items-center space-x-2">
              <AlertCircle className="mr-1 h-4 w-4" />
              <span>SOS</span>
            </Link>
          </Button>
          <div className="hidden md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/report"
                  className="text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Report Emergency
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
