-- ============================================================
-- TechZone Bénin — mise à jour du catalogue (comparaison fournisseur)
-- À coller dans Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================

-- 1) Retrait des 7 doublons "Neuf" (le fournisseur les fournit en Occasion (10/10))
delete from products where slug in ('lenovo-ideapad-320-gaming', 'hp-probook-450-g3', 'lenovo-thinkpad', 'lenovo-thinkpad-x1-carbon', 'hp-probook-650-g4', 'dell-latitude-5480', 'mini-pc-asus');

-- 2) Mise à jour des prix (38 produits)
update products set price = 8800, updated_at = now() where slug = 'nokia-105-original';
update products set price = 10750, updated_at = now() where slug = 'tecno-t528';
update products set price = 11000, updated_at = now() where slug = 'tecno-t529';
update products set price = 6700, updated_at = now() where slug = 'villaon-v5606';
update products set price = 51000, updated_at = now() where slug = 'kxd-a07-pro-32-2';
update products set price = 56000, updated_at = now() where slug = 'kxd-a07-pro-64-3';
update products set price = 75000, updated_at = now() where slug = 'redmi-a7-64-3';
update products set price = 115000, updated_at = now() where slug = 'redmi-15c-256-8';
update products set price = 163000, updated_at = now() where slug = 'redmi-note-14-pro-256-8';
update products set price = 108500, updated_at = now() where slug = 'samsung-galaxy-a17-128-4';
update products set price = 215000, updated_at = now() where slug = 'samsung-galaxy-a37-5g-256-8';
update products set price = 250000, updated_at = now() where slug = 'samsung-galaxy-a57-256-8';
update products set price = 81000, updated_at = now() where slug = 'tecno-pop-20-64-4';
update products set price = 93500, updated_at = now() where slug = 'tecno-pop-20-128-4';
update products set price = 120000, updated_at = now() where slug = 'tecno-spark-50-128-4';
update products set price = 107500, updated_at = now() where slug = 'infinix-hot-70-128-4';
update products set price = 58500, updated_at = now() where slug = 'villaon-v50s-64-4';
update products set price = 143000, updated_at = now() where slug = 'redmi-pad-2-4g-128-4';
update products set price = 1900, updated_at = now() where slug = 'ecouteur-oraimo-oep-320-original';
update products set price = 35000, updated_at = now() where slug = 'zealot-s67';
update products set price = 88500, updated_at = now() where slug = 'zealot-s95';
update products set price = 127500, updated_at = now() where slug = 'zealot-s98';
update products set price = 1850, updated_at = now() where slug = 'chargeur-18w-android-type-c';
update products set price = 3000, updated_at = now() where slug = 'chargeur-oraimo';
update products set price = 2300, updated_at = now() where slug = 'chargeur-iphone-85w';
update products set price = 2700, updated_at = now() where slug = 'chargeur-tecno-infinix-type-c-android';
update products set price = 4000, updated_at = now() where slug = 'chargeur-rapide-33w';
update products set price = 4500, updated_at = now() where slug = 'chargeur-samsung-25w-type-c-a-type-c';
update products set price = 8500, updated_at = now() where slug = 'powerbank-topteen-20-000-mah';
update products set price = 17500, updated_at = now() where slug = 'powerbank-oraimo-20-000-mah-original';
update products set price = 1100, updated_at = now() where slug = 'batterie-itel-5c';
update products set price = 1800, updated_at = now() where slug = 'batterie-itel-bl-25bi-2500mah-original';
update products set price = 1800, updated_at = now() where slug = 'batterie-itel-bl-29fi-3000mah';
update products set price = 2200, updated_at = now() where slug = 'batterie-oraimo-bl-sc-1110mah';
update products set price = 3000, updated_at = now() where slug = 'cle-usb-2gb';
update products set price = 3500, updated_at = now() where slug = 'cle-usb-4gb';
update products set price = 15000, updated_at = now() where slug = 'pocket-wifi-afrilink';
update products set price = 160000, updated_at = now() where slug = 'dell-latitude-5480-2';

-- 3) Nouveaux produits (13)
insert into products (slug, name, brand, category, subcategory, subcategory_label, condition, condition_detail, description, price, images, active, featured) values
('redmi-a7-pro-128-4', 'Redmi A7 Pro (128+4)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', 'Avec 128 Go de stockage, cette version Pro du Redmi A7 offre plus d''espace pour vos applications et fichiers.', 92000, '[]'::jsonb, true, false),
('redmi-15c-128-4', 'Redmi 15C (128+4)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', 'Avec 128 Go de stockage, une alternative plus accessible à la version 256 Go du Redmi 15C.', 97500, '[]'::jsonb, true, false),
('redmi-note-15-256-8', 'Redmi Note 15 (256+8)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', '256 Go de stockage et 8 Go de RAM pour un usage fluide au quotidien.', 147000, '[]'::jsonb, true, false),
('redmi-note-15-pro-256-8-2', 'Redmi Note 15 Pro (256+8)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', 'Version Pro du Redmi Note 15, avec 256 Go de stockage et 8 Go de RAM.', 177000, '[]'::jsonb, true, false),
('redmi-note-17-256-8', 'Redmi Note 17 (256+8, 7700mAh)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', '256 Go de stockage, 8 Go de RAM et une batterie de 7700 mAh pour une autonomie renforcée.', 160000, '[]'::jsonb, true, false),
('redmi-note-17-pro-5g-256-8', 'Redmi Note 17 Pro 5G (256+8, 8340mAh)', 'Redmi', 'telephones', 'smartphones', 'Smartphones', 'neuf', 'Neuf', 'Compatible 5G, avec 256 Go de stockage, 8 Go de RAM et une batterie de 8340 mAh.', 215000, '[]'::jsonb, true, false),
('samsung-galaxy-a06-64-4', 'Samsung Galaxy A06 (64+4)', 'Samsung', 'telephones', 'samsung-galaxy', 'Samsung Galaxy', 'neuf', 'Neuf', 'Avec 64 Go de stockage et 4 Go de RAM, une entrée de gamme fiable chez Samsung.', 76000, '[]'::jsonb, true, false),
('samsung-galaxy-s25-ultra-256-8', 'Samsung Galaxy S25 Ultra (256+8)', 'Samsung', 'telephones', 'samsung-galaxy', 'Samsung Galaxy', 'neuf', 'Neuf', 'Le haut de gamme Samsung, avec 256 Go de stockage et 8 Go de RAM.', 530000, '[]'::jsonb, true, false),
('tecno-spark-40-128-4', 'Tecno Spark 40 (128+4)', 'Tecno', 'telephones', 'tecno', 'Tecno', 'neuf', 'Neuf', '128 Go de stockage et 4 Go de RAM pour un usage quotidien fluide.', 105000, '[]'::jsonb, true, false),
('villaon-hyper100-128-4', 'Villaon Hyper100 (128+4)', 'Villaon', 'telephones', 'villaon-itel', 'Villaon & Itel', 'neuf', 'Neuf', '128 Go de stockage et 4 Go de RAM, le modèle le plus performant de la gamme Villaon.', 71500, '[]'::jsonb, true, false),
('villaon-v-pad-2-4g-64-3', 'Villaon V-Pad 2 4G (64+3)', 'Villaon', 'tablettes', 'tablettes', 'Tablettes', 'neuf', 'Neuf', 'Tablette 4G avec 64 Go de stockage et 3 Go de RAM.', 63000, '[]'::jsonb, true, false),
('zealot-ze01', 'Zealot ZE01', 'Zealot', 'audio-accessoires', 'audio', 'Enceintes & audio', 'neuf', 'Neuf', 'Enceinte Zealot ZE01, pour un son puissant en déplacement.', 93500, '[]'::jsonb, true, false),
('trepied-zealot', 'Trépied Zealot', 'Zealot', 'audio-accessoires', 'divers-kits', 'Divers & kits', 'neuf', 'Neuf', 'Trépied Zealot, pratique pour stabiliser votre téléphone ou votre appareil photo.', 9500, '[]'::jsonb, true, false)
on conflict (slug) do nothing;