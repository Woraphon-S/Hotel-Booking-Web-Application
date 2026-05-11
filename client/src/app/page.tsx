'use client';

import React from 'react';
import { Search, MapPin, Calendar, Users, Star, Shield, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { SearchPage } from '@/features/search/components/SearchPage';
import { useLanguageStore } from '@/stores/languageStore';


export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const destinations = React.useMemo(() => [
    { name: 'กรุงเทพฯ', nameEn: 'Bangkok', img: '/images/destinations/bangkok.jpg', count: language === 'th' ? '1,200+ ที่พัก' : '1,200+ Properties' },
    { name: 'เชียงใหม่', nameEn: 'Chiang Mai', img: '/images/destinations/chiangmai.jpg', count: language === 'th' ? '850+ ที่พัก' : '850+ Properties' },
    { name: 'ภูเก็ต', nameEn: 'Phuket', img: '/images/destinations/phuket.jpg', count: language === 'th' ? '640+ ที่พัก' : '640+ Properties' },
    { name: 'พัทยา', nameEn: 'Pattaya', img: '/images/destinations/pattaya.jpg', count: language === 'th' ? '520+ ที่พัก' : '520+ Properties' },
  ], [language]);

  if (!mounted) return null; // Prevent hydration mismatch by waiting for mount




  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?city=${encodeURIComponent(searchQuery)}#search-section`);
    } else {
      router.push('/#search-section');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/30" />
        </div>

        
        <div className="relative z-10 max-w-4xl w-full px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {t('home.hero_title')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 drop-shadow-md">
            {t('home.hero_subtitle')}
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
          >
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder={t('home.search_placeholder')} 
                className="w-full outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="md:w-32 rounded-xl">
              {t('home.search_btn')}
            </Button>
          </form>
        </div>

      </section>

      {/* Features Section - Premium Redesign */}
      <section className="py-24 bg-gradient-to-b from-white to-muted/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight">
              ทำไมต้องจองกับ <span className="text-secondary">HotelBooking?</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full" />
            <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
              เรามอบประสบการณ์การจองที่เหนือกว่า ด้วยระบบที่ทันสมัย มั่นใจได้ในทุกการเดินทาง
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1: Safety */}
            <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-600 rounded-2xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={36} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">ปลอดภัย 100%</h3>
              <p className="text-muted-foreground leading-relaxed">
                ระบบชำระเงินมาตรฐานสากล พร้อมการคุ้มครองข้อมูลส่วนตัวที่เข้มงวด มั่นใจได้ในทุกธุรกรรม
              </p>
            </div>
            
            {/* Feature 2: Best Price */}
            <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 bg-amber-100 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-amber-500 rounded-2xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-lg">
                  <Star className="text-white" size={36} fill="white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">ราคาที่ดีที่สุด</h3>
              <p className="text-muted-foreground leading-relaxed">
                เราคัดสรรดีลสุดพิเศษจากพันธมิตรทั่วโลก เพื่อให้คุณได้รับราคาที่คุ้มค่าที่สุดในทุกฤดูกาล
              </p>
            </div>
            
            {/* Feature 3: Easy Booking */}
            <div className="group bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 bg-emerald-100 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-emerald-600 rounded-2xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-lg">
                  <Clock className="text-white" size={36} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">จองง่าย ใน 2 นาที</h3>
              <p className="text-muted-foreground leading-relaxed">
                อินเตอร์เฟซที่ออกแบบมาเพื่อความสะดวกสูงสุด ค้นหาและจองได้รวดเร็วเพียงไม่กี่คลิก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                {language === 'th' ? 'จุดหมายปลายทางยอดนิยม' : 'Popular Destinations'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'th' ? 'สำรวจที่พักในเมืองยอดฮิตทั่วไทย' : 'Explore properties in popular cities across Thailand'}
              </p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => router.push('/#search-section')}>
              {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((city, index) => (
              <div 
                key={index}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                onClick={() => router.push(`/?city=${city.nameEn}#search-section`)}
              >
                <img 
                  src={city.img} 
                  alt={city.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">
                    {language === 'th' ? city.name : city.nameEn}
                  </h3>
                  <p className="text-sm text-white/80">{city.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Search Experience Section */}
      <section id="search-section" className="py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-border overflow-hidden">
            <div className="p-1 md:p-4">
              <SearchPage />
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">คุณเป็นเจ้าของที่พักใช่หรือไม่?</h2>
          <p className="text-xl mb-10 text-white/80">
            เพิ่มโอกาสในการสร้างรายได้ โดยการลงทะเบียนที่พักของคุณกับเราวันนี้
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-10 h-14 text-lg cursor-pointer"
            onClick={() => {
              if (isAuthenticated && user?.role === 'owner') {
                router.push('/owner/dashboard');
              } else {
                router.push('/register?role=owner');
              }
            }}
          >

            เริ่มลงทะเบียนที่พัก
          </Button>
        </div>
      </section>
    </div>
  );
}
