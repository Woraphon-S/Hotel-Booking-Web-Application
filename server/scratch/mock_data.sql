-- Mock Data Script for Hotel Booking Application
DO $$ 
DECLARE 
    owner_id INT := 2;
    prop_id INT;
BEGIN
    -- 1. เดอะ แกรนด์ เชียงใหม่
    INSERT INTO properties (owner_id, name, description, address, city, province, zip_code, min_price, max_price, amenities)
    VALUES (owner_id, 'เดอะ แกรนด์ เชียงใหม่', 'ที่พักหรูสไตล์ล้านนาใจกลางเมืองเชียงใหม่ เดินทางสะดวกใกล้ถนนคนเดินและวัดพระสิงห์ บริการระดับ 5 ดาวพร้อมสปาและสระว่ายน้ำระบบเกลือ', '123 ถนนราชดำเนิน', 'เมือง', 'เชียงใหม่', '50000', 1500, 4500, '{wifi,pool,parking,ac,restaurant,breakfast}')
    RETURNING id INTO prop_id;
    
    INSERT INTO property_images (property_id, url, is_main) VALUES 
    (prop_id, 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?q=80&w=2070&auto=format&fit=crop', true),
    (prop_id, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop', false);
    
    INSERT INTO rooms (property_id, name, description, type, price_per_night, capacity, total_rooms) VALUES 
    (prop_id, 'Deluxe Lanna Room', 'ห้องพักตกแต่งไม้สักแท้', 'Deluxe', 1500, 2, 10),
    (prop_id, 'Grand Suite', 'ห้องสวีทขนาดใหญ่พร้อมอ่างจากุซซี่', 'Suite', 4500, 2, 5);

    -- 2. ภูเก็ต พาราไดซ์ รีสอร์ท
    INSERT INTO properties (owner_id, name, description, address, city, province, zip_code, min_price, max_price, amenities)
    VALUES (owner_id, 'ภูเก็ต พาราไดซ์ รีสอร์ท', 'รีสอร์ทส่วนตัวติดริมชายหาดป่าตอง พร้อมวิวทะเลแบบพาโนรามา สระว่ายน้ำส่วนตัวในห้องพัก และบาร์ริมหาดที่ให้บริการตลอดคืน', '45/1 หาดป่าตอง', 'กะทู้', 'ภูเก็ต', '83150', 3000, 12000, '{wifi,pool,parking,ac,restaurant,gym,spa,breakfast}')
    RETURNING id INTO prop_id;
    
    INSERT INTO property_images (property_id, url, is_main) VALUES 
    (prop_id, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop', true),
    (prop_id, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', false);
    
    INSERT INTO rooms (property_id, name, description, type, price_per_night, capacity, total_rooms) VALUES 
    (prop_id, 'Ocean View King', 'ห้องวิวทะเลชั้นสูง', 'Superior', 3000, 2, 20),
    (prop_id, 'Private Pool Villa', 'วิลล่าพร้อมสระว่ายน้ำส่วนตัว', 'Villa', 12000, 4, 3);

    -- 3. พัทยา เบย์ วิว
    INSERT INTO properties (owner_id, name, description, address, city, province, zip_code, min_price, max_price, amenities)
    VALUES (owner_id, 'พัทยา เบย์ วิว', 'สัมผัสประสบการณ์การพักผ่อนระดับพรีเมียม ใกล้แหล่งช้อปปิ้งและห้างสรรพสินค้าชื่อดัง พร้อม Rooftop Bar ที่คุณสามารถชมพระอาทิตย์ตกได้สวยที่สุดในพัทยา', '789 เลียบชายหาด', 'บางละมุง', 'ชลบุรี', '20150', 2000, 5500, '{wifi,pool,parking,ac,restaurant,gym}')
    RETURNING id INTO prop_id;
    
    INSERT INTO property_images (property_id, url, is_main) VALUES 
    (prop_id, 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=2071&auto=format&fit=crop', true),
    (prop_id, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop', false);
    
    INSERT INTO rooms (property_id, name, description, type, price_per_night, capacity, total_rooms) VALUES 
    (prop_id, 'Standard City View', 'ห้องพักราคาประหยัด', 'Standard', 2000, 2, 30),
    (prop_id, 'Executive Sea View', 'ห้องพักวิวทะเลมุมกว้าง', 'Executive', 5500, 2, 8);

    -- 4. แบงค็อก ซิตี้ ลักชูรี
    INSERT INTO properties (owner_id, name, description, address, city, province, zip_code, min_price, max_price, amenities)
    VALUES (owner_id, 'แบงค็อก ซิตี้ ลักชูรี', 'โรงแรมสุดหรูใจกลางย่านสุขุมวิท ตกแต่งสไตล์ร่วมสมัย พร้อมสิ่งอำนวยความสะดวกครบครัน ใกล้รถไฟฟ้า BTS และห้างสรรพสินค้าชั้นนำ', '22 สุขุมวิท 24', 'คลองเตย', 'กรุงเทพฯ', '10110', 2500, 8000, '{wifi,pool,parking,ac,restaurant,gym,spa}')
    RETURNING id INTO prop_id;
    
    INSERT INTO property_images (property_id, url, is_main) VALUES 
    (prop_id, 'https://images.unsplash.com/photo-1541971875076-8f97bd827dfb?q=80&w=2074&auto=format&fit=crop', true),
    (prop_id, 'https://images.unsplash.com/photo-1551882547-ff43c61f328c?q=80&w=2070&auto=format&fit=crop', false);
    
    INSERT INTO rooms (property_id, name, description, type, price_per_night, capacity, total_rooms) VALUES 
    (prop_id, 'Studio Superior', 'ห้องพักขนาดมาตรฐาน', 'Studio', 2500, 2, 50),
    (prop_id, 'Presidential Suite', 'ห้องสวีทที่ดีที่สุดของโรงแรม', 'Suite', 8000, 2, 2);

END $$;
