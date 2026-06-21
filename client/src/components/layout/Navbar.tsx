'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Menu, X, Heart } from 'lucide-react';

import { authService } from '@/features/auth/services/auth.service';

import { useLanguageStore } from '@/stores/languageStore';
import { useTranslation } from '@/hooks/useTranslation';

export const Navbar = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const displayAuth = mounted && isAuthenticated;
  const displayLang = mounted ? language : 'th';

  const handleLogout = async () => {
    if (user) {
      try {
        await authService.logout(user.id);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    clearAuth();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Hotel<span className="text-accent">Booking</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={toggleLanguage}
              className="w-12 h-8 flex items-center justify-center text-xs border border-white/20 rounded-md hover:bg-white/10 transition-colors uppercase font-bold"
            >
              {displayLang === 'th' ? 'EN' : 'TH'}
            </button>

            <Link href="/#search-section" className="hover:text-accent transition-colors">{t('navbar.search')}</Link>

            <Link href="/favorites" className="hover:text-accent transition-colors flex items-center">
              <Heart size={18} className="mr-1" />
              {displayLang === 'th' ? 'ที่บันทึกไว้' : 'Favorites'}
            </Link>
            {displayAuth ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-sm bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 transition-all group"
                >
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold">{user?.first_name}</span>
                </Link>
                
                {user?.role === 'owner' && (
                  <Link href="/owner/dashboard" className="hover:text-accent transition-colors font-medium">{t('navbar.manage')}</Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-300 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (

              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">{t('navbar.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="sm">{t('navbar.register')}</Button>
                </Link>
              </div>
            )}
          </div>


          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-primary-foreground/10">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-4 space-y-3">
          <Link href="/#search-section" className="block py-2 hover:text-accent">ค้นหาที่พัก</Link>

          {displayAuth ? (
            <>
              {user?.role === 'owner' && (
                <Link href="/owner/dashboard" className="block py-2 hover:text-accent">จัดการที่พัก</Link>
              )}
              <div className="pt-2 border-t border-white/10">
                <p className="text-sm text-white/70 mb-2">เข้าใช้งานโดย: {user?.first_name}</p>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-white p-0 hover:bg-transparent">
                  <LogOut size={16} className="mr-2" />
                  ออกจากระบบ
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full text-white">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="secondary" className="w-full">สมัครสมาชิก</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
