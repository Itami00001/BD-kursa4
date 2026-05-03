BEGIN;
SET client_encoding = 'UTF8';
DROP INDEX IF EXISTS ux_parts_name;
TRUNCATE TABLE compatibility RESTART IDENTITY;
TRUNCATE TABLE parts RESTART IDENTITY CASCADE;
TRUNCATE TABLE manufacturers RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
-- categories
INSERT INTO categories (name) VALUES ('brakes.big_brake_kit');
INSERT INTO categories (name) VALUES ('brakes.pads.front');
INSERT INTO categories (name) VALUES ('engine');
INSERT INTO categories (name) VALUES ('engine.air_filter');
INSERT INTO categories (name) VALUES ('engine.camshaft');
INSERT INTO categories (name) VALUES ('engine.chip_tuning');
INSERT INTO categories (name) VALUES ('engine.ecu');
INSERT INTO categories (name) VALUES ('engine.ignition');
INSERT INTO categories (name) VALUES ('engine.intake');
INSERT INTO categories (name) VALUES ('engine.intercooler');
INSERT INTO categories (name) VALUES ('engine.oil_filter');
INSERT INTO categories (name) VALUES ('engine.swap');
INSERT INTO categories (name) VALUES ('engine.turbo');
INSERT INTO categories (name) VALUES ('engine.turbo_kit');
INSERT INTO categories (name) VALUES ('exhaust.system');
INSERT INTO categories (name) VALUES ('fuel.injector');
INSERT INTO categories (name) VALUES ('fuel.pump');
INSERT INTO categories (name) VALUES ('fuel.system');
INSERT INTO categories (name) VALUES ('ignition');
INSERT INTO categories (name) VALUES ('suspension');
INSERT INTO categories (name) VALUES ('suspension.coilovers');
INSERT INTO categories (name) VALUES ('suspension.springs');
INSERT INTO categories (name) VALUES ('transmission.swap');
-- manufacturers
INSERT INTO manufacturers (name) VALUES ('034Motorsport');
INSERT INTO manufacturers (name) VALUES ('APR');
INSERT INTO manufacturers (name) VALUES ('Brembo');
INSERT INTO manufacturers (name) VALUES ('GReddy');
INSERT INTO manufacturers (name) VALUES ('Garrett');
INSERT INTO manufacturers (name) VALUES ('HKS');
INSERT INTO manufacturers (name) VALUES ('Injector Dynamics');
INSERT INTO manufacturers (name) VALUES ('NISMO');
INSERT INTO manufacturers (name) VALUES ('Nismo');
INSERT INTO manufacturers (name) VALUES ('Quantum Racing');
INSERT INTO manufacturers (name) VALUES ('TOMEI');
INSERT INTO manufacturers (name) VALUES ('Tomei');
INSERT INTO manufacturers (name) VALUES ('Unknown');
INSERT INTO manufacturers (name) VALUES ('Walbro');
-- parts
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбина Quantum Racing GT2871 для SR20DET',
  0,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Quantum Racing' LIMIT 1),
  0,
  0,
  'Гибридный турбокомпрессор для двигателей Nissan SR20DET. Обеспечивает повышенный прирост мощности и улучшенный отклик за счет фрезерованной крыльчатки (Billet Wheel) в холодной части, сохраняя надежность на высоких оборотах.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер GReddy LS Intercooler Kit для S14/S15',
  0,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GReddy' LIMIT 1),
  0,
  0,
  'Комплект интеркулера увеличенного объема и эффективности. Снижает температуру наддувочного воздуха, что позволяет повысить мощность и снизить риск детонации при тюнинге двигателя.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выхлопная система 76мм (3 дюйма) для Nissan Silvia S14/S15',
  0,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Высокопоточная выхлопная трасса из нержавеющей стали диаметром 76 мм. Уменьшает сопротивление выпуска отработавших газов, что способствует увеличению мощности двигателя, улучшению отклика и дает характерный спортивный звук.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки Injector Dynamics ID1050x',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Injector Dynamics' LIMIT 1),
  0,
  0,
  'Высокопроизводительные топливные форсунки для построения мощных турбомоторов. Обеспечивают точную и стабильную подачу топлива при высоком давлении, необходимы для реализации потенциала крупных турбин и других доработок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Спортивный распредвал выпускной HKS style для SR20',
  0,
  (SELECT id FROM categories WHERE name = 'engine.camshaft' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  0,
  0,
  'Распредвал с измененными фазами газораспределения и подъемами клапанов. Увеличивает производительность двигателя на высоких оборотах, улучшая наполнение и очистку цилиндров.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Услуга чип-тюнинга ЭБУ TOMEI (Modification Service)',
  0,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'TOMEI' LIMIT 1),
  0,
  0,
  'Физическая доработка и перепрошивка штатного блока управления двигателем (ECU) для оптимизации параметров (зажигание, топливоподача) под установленные тюнинговые детали. Раскрывает потенциал аппаратных доработок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбина Garrett GT2871R для Nissan Silvia S15 SR20DET',
  0,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  0,
  0,
  'Турбокомпрессор Garrett GT2871R — популярный апгрейд для двигателя SR20DET, обеспечивающий сбалансированный прирост мощности с хорошей отзывчивостью на низких и средних оборотах. Идеально подходит для стрит-использования и любительского дрифта.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Распредвалы BRIAN CROWER 264/264 12.0 для S14/S15 SR20',
  0,
  (SELECT id FROM categories WHERE name = 'engine.camshaft' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Спортивные распределительные валы с увеличенной фазой и подъемом (264 градуса, 12.0 мм). Улучшают наполнение цилиндров на высоких оборотах, что повышает пиковую мощность и потенциал двигателя при работе с большой турбиной.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер HKS фронтальный для Nissan Silvia S15',
  0,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  0,
  0,
  'Фронтальный интеркулер увеличенной эффективности для охлаждения наддувочного воздуха. Позволяет снизить температуру впуска, минимизировать потери мощности из-за нагрева и снизить риск детонации на форсированном двигателе.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки SARD 850cc для Nissan Silvia S15',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Высокопроизводительные форсунки увеличенной пропускной способности (850 куб.см/мин). Необходимы для подачи большего количества топлива при повышении мощности двигателя свыше 350-400 л.с. Обеспечивают стабильную работу на высоких нагрузках.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Контроллер ЭБУ APEX''i Power FC D-Jetro для S15 SR20DET',
  0,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Стояночный программируемый блок управления двигателем, заменяющий штатный ЭБУ. Позволяет производить полноценную калибровку впрыска и зажигания под установленные тюнинговые детали. Комплектуется датчиками абсолютного давления (D-Jetro) для точного измерения нагрузки.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система полного прямоточного типа 3 дюйма для S15',
  0,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Система выпуска с увеличенным диаметром (76 мм / 3 дюйма) от турбины до заднего глушителя. Значительно снижает противодавление в выпускном тракте, что способствует более эффективной продувке цилиндров, раскрытию потенциала турбины и увеличению мощности.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбина Garrett GT3582R (GT35R) для перехода на одиночную турбину на FD3S',
  0,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  0,
  0,
  'Одиночный турбокомпрессор Garrett GT3582R — популярный выбор для замены штатных двойных турбин на Mazda RX-7 FD3S. Обеспечивает значительный прирост мощности и улучшенный отклик на высоких оборотах, что идеально подходит для драг-рейсинга и дрифта.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер HKS R-Type для Mazda RX-7 FD3S (1993-2002)',
  0,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  0,
  0,
  'Фронтальный интеркулер увеличенного объёма и эффективности, специально разработанный для FD3S. Обеспечивает лучшее охлаждение наддувочного воздуха, что снижает риск детонации и позволяет повысить давление наддува.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система Racing Beat 3-дюймовая (76 мм) для Mazda RX-7 FD3S',
  0,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Высокопоточная выхлопная система из нержавеющей стали диаметром 76 мм. Уменьшает противодавление в выпускном тракте, что улучшает продувку цилиндров и повышает эффективность работы турбины.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки Denso 850cc для Mazda RX-7 FD3S',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Высокопроизводительные форсунки увеличенной пропускной способности, необходимые для подачи большего количества топлива при повышении мощности двигателя свыше 400 л.с. Обеспечивают стабильную работу на высоких нагрузках.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программируемый ЭБУ Haltech Elite 2500 для Mazda RX-7 FD3S',
  0,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Мощный стояночный программируемый блок управления двигателем, заменяющий штатный ЭБУ. Позволяет производить полноценную калибровку впрыска, зажигания и управления турбиной под установленные тюнинговые детали.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Спортивные апекс-селы (Apex Seals) для роторного двигателя 13B-REW',
  0,
  (SELECT id FROM categories WHERE name = 'engine' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Усиленные уплотнения вершин роторов, критически важные для повышения надёжности и мощности форсированного роторного двигателя. Позволяют выдерживать более высокие температуры и давления, снижая риск задиров и разрушения.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Коллектор зажигания LS-2 coil conversion kit для Mazda RX-7 FD3S',
  0,
  (SELECT id FROM categories WHERE name = 'ignition' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Комплект для замены штатных катушек зажигания на более мощные катушки LS-2. Улучшает воспламенение топливно-воздушной смеси, что особенно важно для форсированных двигателей с высоким давлением наддува.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'NISMO Интеркулер для Skyline GT-R (14461-RSR45)',
  0,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'NISMO' LIMIT 1),
  0,
  0,
  'Оригинальный интеркулер NISMO для двигателей RB26DETT в моделях Skyline GT-R (R32, R33, R34). Изготовлен из высококачественного алюминия для максимальной теплоотдачи. Улучшает охлаждение наддувочного воздуха, снижает тепловую нагрузку (heat soak) и повышает стабильность мощности, что критически важно для форсирования двигателя.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбокомпрессоры Garrett GT2860R-7 (комплект под двойную установку)',
  0,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  0,
  0,
  'Комплект из двух турбин Garrett GT2860R-7 (дизелинг -9) для замены штатных турбин RB26DETT. Обеспечивает значительный прирост мощности и крутящего момента с улучшенной отзывчивостью по сравнению со стоком. Популярный выбор для достижения мощности 450-500 л.с.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки Nismo 740cc для RB26DETT',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Nismo' LIMIT 1),
  0,
  0,
  'Форсунки повышенной производительности от Nismo. Предназначены для подачи большего объема топлива, необходимого при значительном повышении мощности двигателя (до ~600 л.с.). Обеспечивают точное дозирование и стабильную работу на высоких нагрузках.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программируемый ЭБУ Link G4+ Fury для Skyline R34 GT-R',
  0,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Мощный универсальный программируемый блок управления двигателем, заменяющий штатный ECU. Позволяет полностью контролировать параметры впрыска, зажигания, управления турбинами и другими системами. Необходим для реализации потенциала любых серьезных аппаратных доработок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система полного типа 3.5 дюйма (90 мм) для R34 GT-R',
  0,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Прямоточная система выпуска от турбин до заднего глушителя увеличенного диаметра. Кардинально снижает противодавление в выпускном тракте, что повышает эффективность продувки цилиндров, снижает температуру выхлопных газов и раскрывает потенциал турбин.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект усиленных шатунов Tomei для RB26DETT',
  0,
  (SELECT id FROM categories WHERE name = 'engine' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Tomei' LIMIT 1),
  0,
  0,
  'Кованые шатуны повышенной прочности для двигателя RB26DETT. Предназначены для сборки высокофорсированных моторов, испытывающих экстремальные нагрузки (высокое давление наддува, закись азота). Критически важны для надежности при мощности свыше 500-550 л.с.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбина Mamba GT3582R для 2JZ-GTE',
  0,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Одиночный турбокомпрессор для замены штатных двойных турбин на двигателе 2JZ-GTE. Обеспечивает значительный прирост мощности и крутящего момента с улучшенной отзывчивостью.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер HKS фронтальный для Supra A80',
  0,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  0,
  0,
  'Фронтальный интеркулер увеличенного объема и эффективности для охлаждения наддувочного воздуха. Позволяет снизить температуру впуска, минимизировать потери мощности из-за нагрева и снизить риск детонации на форсированном двигателе.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система 3.5 дюйма (90 мм) для Supra A80',
  0,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Прямоточная система выпуска увеличенного диаметра от турбины до заднего глушителя. Значительно снижает противодавление в выпускном тракте, что повышает эффективность продувки цилиндров и раскрывает потенциал турбины.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки SSS Performance 1000cc для 2JZ-GTE',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Высокопроизводительные форсунки увеличенной пропускной способности (1000 куб.см/мин). Необходимы для подачи большего количества топлива при повышении мощности двигателя свыше 500 л.с. Обеспечивают стабильную работу на высоких нагрузках.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'ЭБУ HKS FCON VPRO Gold 3.1 для Supra A80',
  0,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  0,
  0,
  'Профессиональный стояночный программируемый блок управления двигателем, заменяющий штатный ECU. Позволяет производить полноценную калибровку впрыска, зажигания и управления турбиной под установленные тюнинговые детали.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Распредвалы Brian Crower BC272 для 2JZ-GTE',
  0,
  (SELECT id FROM categories WHERE name = 'engine.camshaft' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Спортивные распределительные валы с увеличенной фазой и подъемом (272 градуса). Улучшают наполнение цилиндров на высоких оборотах, что повышает пиковую мощность и потенциал двигателя при работе с большой турбиной.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливный насос Walbro 255 л/ч для Supra A80',
  0,
  (SELECT id FROM categories WHERE name = 'fuel.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Walbro' LIMIT 1),
  0,
  0,
  'Высокопроизводительный топливный насос, обеспечивающий достаточную подачу топлива для форсированного двигателя. Необходим при установке форсунок большого объема и повышении давления в системе.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Front Drift Angle Lock Kit (S14/S15 Front V2 Drift Angle Lock Kit with Rack Offset Spacers)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Передний комплект на увеличение угла поворота — основное решение для дрифта, даёт до 60° выворота.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Rear Suspension Drop Knuckle Kit (S14/S15)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Задний комплект опускающих кулаков — улучшает кинематику задней подвески при сильном снижении клиренса.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Front Drift Angle Lock Kit (R34)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Передний комплект на увеличение угла поворота — разработан для R34, обеспечивает около 60° выворота и корректирует кинематику.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Front Drift Angle Lock Kit (RX-7 FD3S)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Передний комплект на увеличение угла поворота — для RX‑7 FD, заявленный угол до 62°.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Front Drift Angle Lock Kit (Supra JZA80 / Soarer)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Передний комплект на увеличение угла поворота — для Supra и Soarer, до 65° выворота.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'WiseFab Rear Suspension Drop Knuckle Kit (Supra JZA80)',
  0,
  (SELECT id FROM categories WHERE name = 'suspension' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Задний комплект опускающих кулаков — улучшает сцепление задней оси на lowered Supra.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo Quantum Racing GT2871 для SR20DET (Nissan Silvia S14)',
  21000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Quantum Racing' LIMIT 1),
  90,
  100,
  'Установить турбину в штатное место, подключить интеркулер, выхлоп и усиленный топливный насос, выполнить перепрошивку ЭБУ.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер GReddy LS для S14/S15',
  14000,
  (SELECT id FROM categories WHERE name = 'engine.intercooler' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'GReddy' LIMIT 1),
  5,
  8,
  'Смонтировать в переднем бампере, установить удлинённые патрубки и хомуты.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выхлопная система 76 mm (3 in) для S14/S15',
  12000,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  20,
  30,
  'Прикрепить к штатным точкам крепления, при необходимости подрезать фланцы.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливный насос повышенной производительности для S14',
  18000,
  (SELECT id FROM categories WHERE name = 'fuel.pump' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  2,
  5,
  'Установить в штатный топливный модуль, подключить к новой системе форсунок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Распредвал HKS style для SR20 (S14)',
  18000,
  (SELECT id FROM categories WHERE name = 'engine.camshaft' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  30,
  35,
  'Снять головку блока, установить вал, заменить пружины и сделать настройку ЭБУ.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Чип‑тюнинг ТУЭМИ (ECU) для S14 Zenki',
  30000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Отправить штатный ECU в сервис, вернуть перепрошитый блок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo Garrett GT2871R для SR20DET (S15)',
  20000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  5,
  8,
  'Встроить турбину, подключить HKS‑интеркулер, модуль форсунок и перепрошивку.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер HKS фронтальный для S15',
  15000,
  (SELECT id FROM categories WHERE name = 'engine.intercooler' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  5,
  8,
  'Установить в передний бампер, подключить к турбине.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система 3‑inch (76 mm) для S15',
  13000,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  20,
  30,
  'Установить без доработок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливный насос повышенной производительности для S15',
  19000,
  (SELECT id FROM categories WHERE name = 'fuel.pump' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  2,
  5,
  'Установить в топливный модуль, подключить к регулятору.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Топливные форсунки SARD 850 cc для S15',
  26000,
  (SELECT id FROM categories WHERE name = 'fuel.injector' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  1,
  2,
  'Установить в ральку, настроить давление.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Контроллер ECU APEX''i Power FC D‑Jetro для S15',
  32000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Установить контроллер, выполнить калибровку на стенде.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'NISMO интеркулер для RB26DETT (R34)',
  24000,
  (SELECT id FROM categories WHERE name = 'engine.intercooler' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'NISMO' LIMIT 1),
  5,
  8,
  'Установить в передний бампер, подключить к системе турбин.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект двойных турбин Garrett GT2860R‑7 для RB26DETT',
  65000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  180,
  220,
  'Установить турбинки, подключить к интеркулеру, модернизировать топливную систему.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo Garrett GT3582R (GT35R) для 13B‑REW (RX‑7 FD)',
  80000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  175,
  210,
  'Установить турбину, собрать кастомный выпуск и вывести к интеркулеру, подключить усиленную топливную систему.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Интеркулер HKS R‑Type для FD3S',
  22000,
  (SELECT id FROM categories WHERE name = 'engine.intercooler' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  5,
  8,
  'Установить в передний бампер, подключить к турбине.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выпускная система Racing Beat 3‑inch (76 mm) для FD3S',
  28000,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  30,
  40,
  'Установить без доработок.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программируемый ЭБУ Haltech Elite 2500 для FD3S',
  45000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Установить блок, выполнить полную калибровку на стенде.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Полный Turbo‑Kit 4G63T 600+ л.с. для Evo VIII',
  120000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  320,
  350,
  'Полный разбор двигателя, установка стренг‑блоков, турбины, интеркулера, форсированных деталей и настройка ECU.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Койловеры BC Racing BR Type RS для JZX90/JZX100',
  25000,
  (SELECT id FROM categories WHERE name = 'suspension.coilovers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  1,
  1,
  'Установить, выполнить сход‑развал.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программируемый ЭБУ A''PEXi Power FC для 1JZ‑GTE',
  34000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Установить блок, настроить через FC‑Datalogit.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Coil Conversion & ICM Delete Kit (Audi RS6) для 2.7T',
  15000,
  (SELECT id FROM categories WHERE name = 'engine.ignition' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Заменить катушки, удалить ICM, перепрошить ECU.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программируемый ЭБУ Link G4+ Fury для A6 C5',
  38000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  3,
  5,
  'Установить блок, выполнить калибровку.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Впускные патрубки (RS4 B5) для турбин K04',
  13000,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  5,
  8,
  'Сменить штатные патрубки, установить новые.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Двигатель 2.0 L AZJ (VW) для Octavia A5',
  42000,
  (SELECT id FROM categories WHERE name = 'engine.swap' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  30,
  35,
  'Установить двигатель, заменить крепления и провести перепрошивку.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo‑Kit K04 (RacingLine) Stage 3 для 1.4 TSI Rapid',
  95000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  85,
  120,
  'Установить турбину K04, интеркулер, обновить топливную систему, перепрошить ECU.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo Garrett GT35R для RB26DETT (Nissan Skyline R34)',
  35000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Garrett' LIMIT 1),
  120,
  150,
  'Установить турбину, модернизировать систему охлаждения, усилить топливную систему, настроить ЭБУ.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo HKS GT2540 для SR20DET (Nissan Silvia S15)',
  28000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  80,
  90,
  'Установить турбину HKS, подключить интеркулер и выхлопную систему.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo Kit HKS для 2JZ-GTE (Toyota Supra A80)',
  85000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  200,
  250,
  'Полная замена турбосистемы с установкой интеркулера и выхлопа.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Cold Air Intake Icebox для B16B (Honda Civic EK9)',
  8000,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  8,
  10,
  'Установить холодный впуск в штатное место.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Turbo HKS T04R для 13B-REW (Mazda RX-7 FD3S)',
  45000,
  (SELECT id FROM categories WHERE name = 'engine.turbo' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'HKS' LIMIT 1),
  100,
  120,
  'Установить турбину HKS, модернизировать систему охлаждения.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Cold Air Intake 034Motorsport X34 Carbon Fiber CAI для 2.7T',
  18000,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = '034Motorsport' LIMIT 1),
  10,
  12,
  'Заменить штатный впуск, установить карбон‑короб.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект замены АКПП на ZF310 для E36',
  55000,
  (SELECT id FROM categories WHERE name = 'transmission.swap' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  5,
  7,
  'Снять автомат, установить механическую коробку, адаптировать педали.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбо‑кит для M50/M52 (включая турбоколлектор)',
  110000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  150,
  180,
  'Установить турбоколлектор, комплект турбины T3, интеркулер и подготовить топливную систему.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Программное обеспечение APR Stage 1 для Octavia A7',
  12000,
  (SELECT id FROM categories WHERE name = 'engine.ecu' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'APR' LIMIT 1),
  30,
  40,
  'Перепрошить штатный ECU через OBD‑II.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Тормозные колодки передние Brembo для Golf IV GTI',
  8000,
  (SELECT id FROM categories WHERE name = 'brakes.pads.front' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Brembo' LIMIT 1),
  1,
  2,
  'Снять старые колодки, установить новые.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Масляный фильтр европейского бренда (OEM)',
  1100,
  (SELECT id FROM categories WHERE name = 'engine.oil_filter' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  2,
  3,
  'Сменить фильтр во время замены масла.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Воздушный фильтр европейского бренда (OEM)',
  1400,
  (SELECT id FROM categories WHERE name = 'engine.air_filter' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  2,
  3,
  'Сменить фильтр.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект подвески HR Sport для BMW E30',
  45000,
  (SELECT id FROM categories WHERE name = 'suspension.coilovers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Установить амортизаторы и пружины, выполнить развал-схождение.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбо-кит для M50/M52 (BMW E30)',
  95000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  120,
  150,
  'Установить турбину, интеркулер, усилить топливную систему.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Турбо-кит для 1.8T (Volkswagen Golf IV GTI)',
  55000,
  (SELECT id FROM categories WHERE name = 'engine.turbo_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  60,
  80,
  'Установить турбо-кит, выполнить прошивку ЭБУ.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Чип-тюнинг для 2.0 TDI (Skoda Octavia A5)',
  15000,
  (SELECT id FROM categories WHERE name = 'engine.chip_tuning' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  30,
  50,
  'Выполнить прошивку ЭБУ для увеличения мощности.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Чип-тюнинг для 2.0 TSI (Skoda Octavia A7)',
  18000,
  (SELECT id FROM categories WHERE name = 'engine.chip_tuning' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  35,
  60,
  'Выполнить прошивку ЭБУ для оптимизации мощности.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Чип-тюнинг для 1.0 TSI (Skoda Rapid)',
  12000,
  (SELECT id FROM categories WHERE name = 'engine.chip_tuning' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  20,
  30,
  'Выполнить прошивку ЭБУ для увеличения мощности.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект подвески KW Variant 3 для Octavia A5/A7',
  65000,
  (SELECT id FROM categories WHERE name = 'suspension.coilovers' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Установить амортизаторы и пружины KW, выполнить развал-схождение.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Комплект подвески Eibach Pro-Kit для Skoda Rapid',
  25000,
  (SELECT id FROM categories WHERE name = 'suspension.springs' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  0,
  0,
  'Установить занижающие пружины Eibach.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выхлопная система Milltek для Octavia A5/A7',
  35000,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  15,
  25,
  'Установить выхлопную систему Milltek Sport.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Выхлопная система Borla для Skoda Rapid',
  28000,
  (SELECT id FROM categories WHERE name = 'exhaust.system' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  12,
  20,
  'Установить выхлопную систему Borla.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Холодный впуск Neuspeed для Octavia A5/A7',
  12000,
  (SELECT id FROM categories WHERE name = 'engine.intake' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Unknown' LIMIT 1),
  8,
  12,
  'Установить холодный впуск Neuspeed.'
);
INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", instruction)
VALUES (
  'Тормозная система Brembo для Skoda Rapid',
  45000,
  (SELECT id FROM categories WHERE name = 'brakes.big_brake_kit' LIMIT 1),
  (SELECT id FROM manufacturers WHERE name = 'Brembo' LIMIT 1),
  0,
  0,
  'Установить тормозные суппорты и диски Brembo.'
);
-- compatibility
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Полная совместимость (Plug&Play). Турбина предназначена для установки в штатное место на двигателе SR20DET, имеет стандартный фланец T25 и слив GT15, не требует доработок крепления или коллектора.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Турбина Quantum Racing GT2871 для SR20DET'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Комплект разработан для Nissan Silvia S14/S15 и совместим по посадочным местам. Оценка снижена, так как для установки, вероятно, потребуется умеренная доработка переднего бампера для размещения интеркулера и прокладка новых патрубков.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Интеркулер GReddy LS Intercooler Kit для S14/S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Высокая совместимость. Система разработана для S14/S15 и устанавливается на штатные точки крепления. Небольшая оценка снимается за потенциальную необходимость подгона соединений или замены уплотнений.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Выхлопная система 76мм (3 дюйма) для Nissan Silvia S14/S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Требует комплексных доработок. Форсунки физически совместимы с топливной рейкой SR20DET, но их установка — часть масштабного апгрейда топливной системы (насос, регулятор, магистрали) и обязательной перенастройки ЭБУ. Без этого работа двигателя невозможна.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Топливные форсунки Injector Dynamics ID1050x'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Требует серьезных доработок и глубоких знаний. Хотя вал предназначен для SR20, его установка почти всегда влечет за собой вскрытие ГБЦ и замену смежных компонентов ГРМ (пружины, толкатели) для надежности, а также последующую обязательную настройку ЭБУ.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Спортивный распредвал выпускной HKS style для SR20'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Полная программная совместимость после перепрошивки, так как модифицируется штатный ЭБУ конкретной модели (для S14 Zenki 1995-1996). Оценка снижена из-за необходимости физической отправки блока и невозможности использования автомобиля в этот период, а также строгой зависимости от корректно установленного оборудования.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Услуга чип-тюнинга ЭБУ TOMEI (Modification Service)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 8. Турбина является распространённым и физически совместимым апгрейдом для SR20DET. Снижение балла обусловлено обязательной необходимостью комплексного обновления топливной системы и калибровки ЭБУ для безопасной работы. Установка требует профессиональных навыков.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Турбина Garrett GT2871R для Nissan Silvia S15 SR20DET'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 5. Валы совместимы с двигателем SR20DET, но их установка — серьёзное вмешательство в ГБЦ. Требует обязательной замены пружин клапанов на усиленные для предотвращения «зависания» и последующей профессиональной настройки ЭБУ. Не является Plug&Play решением.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Распредвалы BRIAN CROWER 264/264 12.0 для S14/S15 SR20'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 9. Комплект HKS разработан специально для S15, что обеспечивает высокую совместимость. Почти полный балл не ставится, так как на некоторых автомобилях может потребоваться незначительная подгонка креплений или элементов передней части кузова для установки.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Интеркулер HKS фронтальный для Nissan Silvia S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 4. Форсунки физически подходят к топливной рейке SR20DET. Низкий балл объясняется тем, что их установка бессмысленна и даже вредна без комплексного обновления всей топливной системы (насос, регулятор) и обязательной, точной калибровки ЭБУ под новые параметры. Без этого двигатель не будет работать корректно.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Топливные форсунки SARD 850cc для Nissan Silvia S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 9. Power FC — известное и хорошо адаптированное под S15 решение. Имеет высокий уровень совместимости и широкие возможности настройки для двигателя SR20DET. Оценка снижена на один балл, так как для его корректной работы требуется профессиональная установка и обязательная настройка на диностенде, самостоятельная инсталляция без опыта не рекомендуется.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Контроллер ЭБУ APEX''i Power FC D-Jetro для S15 SR20DET'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 10 (Plug&Play). Готовые комплекты выпускных систем полного типа для S15 SR20DET изготавливаются с учётом штатных точек крепления и геометрии кузова. При качественном производстве устанавливаются без доработок, являясь одной из самых простых в монтаже производительных модификаций.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Выпускная система полного прямоточного типа 3 дюйма для S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 5 (требует доработок). Турбина физически совместима с двигателем 13B-REW, но установка требует полного перехода на одиночную турбину: замены выпускного коллектора, доработки впуска/выпуска, upgrade топливной системы и обязательной профессиональной настройки ЭБУ. Без этих доработок мотор не будет работать корректно.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Турбина Garrett GT3582R (GT35R) для перехода на одиночную турбину на FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 9. Комплект HKS R-Type является целенаправленной разработкой для FD3S и имеет высокую совместимость по посадочным местам. Снижение балла связано с возможной необходимостью незначительной подгонки креплений или элементов передней части кузова при установке.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Интеркулер HKS R-Type для Mazda RX-7 FD3S (1993-2002)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 10 (Plug&Play). Готовые комплекты Racing Beat для FD3S изготавливаются с учётом штатных точек крепления и геометрии кузова. При качественном производстве устанавливаются без доработок.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Выпускная система Racing Beat 3-дюймовая (76 мм) для Mazda RX-7 FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 4. Форсунки физически подходят к топливной рейке 13B-REW, но их установка бессмысленна без комплексного обновления всей топливной системы (насос, регулятор, магистрали) и обязательной точной калибровки ЭБУ под новые параметры. Без этого двигатель не будет работать корректно.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Топливные форсунки Denso 850cc для Mazda RX-7 FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 7. Haltech Elite 2500 — мощное и гибкое решение для FD3S, но его установка требует профессиональных навыков: замены проводки, установки дополнительных датчиков и обязательной настройки на диностенде. Без этого достичь стабильной работы двигателя невозможно.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Программируемый ЭБУ Haltech Elite 2500 для Mazda RX-7 FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 3. Апекс-селы являются деталью, специфичной для роторного двигателя, но их установка — это сложнейший процесс, требующий полной разборки двигателя, профессионального портирования и балансировки. Без этих доработок и опыта установка невозможна.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Спортивные апекс-селы (Apex Seals) для роторного двигателя 13B-REW'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 6. Катушки LS-2 физически могут быть адаптированы к двигателю 13B-REW, но установка требует изготовления custom креплений, прокладки новой проводки и возможной корректировки параметров зажигания в ЭБУ. Рекомендуется для опытных тюнеров.'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Коллектор зажигания LS-2 coil conversion kit для Mazda RX-7 FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 8. Деталь является оригинальным апгрейдом от NISMO и спроектирована для двигателя RB26DETT, что гарантирует высокую совместимость по посадочным местам и патрубкам. Снижение балла связано с вероятной необходимостью физической доработки переднего бампера или решетки для корректного монтажа, что исключает оценку Plug&Play.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'NISMO Интеркулер для Skyline GT-R (14461-RSR45)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 6. Турбины физически совместимы с двигателем RB26DETT, и существуют готовые установочные комплекты. Однако достижение заявленного потенциала и безопасная работа НЕВОЗМОЖНЫ без комплексного апгрейда топливной системы, системы управления и интеркулера. Требует профессиональной установки и настройки.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'Турбокомпрессоры Garrett GT2860R-7 (комплект под двойную установку)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 9. Это оригинальные форсунки от тюнингового подразделения Nissan, поэтому они обеспечивают практически идеальную посадку и электрическую совместимость со штатной топливной рампой и проводкой RB26DETT. Оценка не максимальная, так как для их работы все равно обязательна установка более производительного бензонасоса и калибровка ЭБУ.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'Топливные форсунки Nismo 740cc для RB26DETT'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 7. ЭБУ Link является одним из профессиональных стандартов в тюнинге и отлично подходит для сложных проектов на RB26. Однако его установка требует полной замены штатной проводки или использования адаптивного харнеса, а также абсолютно обязательной, квалифицированной настройки на диностенде. Это не решение ''подключи и работай''.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'Программируемый ЭБУ Link G4+ Fury для Skyline R34 GT-R'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 10 (Plug&Play). Готовые выпускные системы от известных брендов (например, HKS, Trust) для R34 GT-R изготавливаются с учетом штатной геометрии кузова и точек крепления. При качественном исполнении устанавливаются без доработок и являются одной из самых простых в монтаже производительных модификаций.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'Выпускная система полного типа 3.5 дюйма (90 мм) для R34 GT-R'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Оценка 3. Шатуны являются деталью, полностью соответствующей геометрии RB26. Однако их установка — это сложнейшая операция, требующая полной разборки двигателя (капитальный ремонт), высокоточных механических работ (расточка, хонингование) и последующей балансировки коленчатого вала в сборе. Невозможно установить без специального оборудования и глубоких знаний.'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'Комплект усиленных шатунов Tomei для RB26DETT'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах (например, mkivsupra.net, supraforums.com). Установка одиночной турбины требует серьезных доработок: замены коллектора, топливной системы, настройки ЭБУ. Без точной информации о совместимости с конкретным комплектом оценить как Plug&Play невозможно.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Турбина Mamba GT3582R для 2JZ-GTE'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. Хотя HKS выпускает комплекты для Supra A80, точная совместимость с конкретной моделью (например, с активным спойлером) может потребовать проверки. Рекомендуется изучить отчеты об установке на ресурсах типа Drive2 или supraforums.com.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Интеркулер HKS фронтальный для Supra A80'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. Готовые выпускные системы от известных брендов (например, HKS, Trust) для Supra A80 могут быть близки к Plug&Play, но необходимо проверить совместимость с конкретным годом выпуска и наличием заднего диффузора. Рекомендуется поиск обзоров на Drive2 или supraforums.com.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Выпускная система 3.5 дюйма (90 мм) для Supra A80'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. Форсунки физически подходят к топливной рампе 2JZ-GTE, но их установка бессмысленна без комплексного обновления всей топливной системы и обязательной точной калибровки ЭБУ. Для проверки совместимости по сопротивлению и разъемам рекомендуется изучить темы на mkivsupra.net.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Топливные форсунки SSS Performance 1000cc для 2JZ-GTE'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. HKS FCON VPRO — известное решение для Supra, но его установка требует профессиональных навыков: замены проводки, установки дополнительных датчиков и обязательной настройки на диностенде. Для точной информации о совместимости с конкретной моделью 2JZ-GTE (VVTi/non-VVTi) рекомендуется обратиться к специализированным тюнинг-ателье.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'ЭБУ HKS FCON VPRO Gold 3.1 для Supra A80'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. Валы совместимы с двигателем 2JZ-GTE, но их установка требует вскрытия ГБЦ, замены пружин клапанов на усиленные и последующей профессиональной настройки ЭБУ. Для подтверждения совместимости с конкретной версией головки (VVTi/non-VVTi) рекомендуется изучить обсуждения на supraforums.com.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Распредвалы Brian Crower BC272 для 2JZ-GTE'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Данные требуют уточнения на форумах. Насос Walbro 255 л/ч является распространенным апгрейдом для Supra A80 и обычно устанавливается в штатный топливный модуль. Однако для подтверждения совместимости с конкретным годом выпуска и моделью (турбо/атмо) рекомендуется проверить темы на mkivsupra.net или Drive2.'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Топливный насос Walbro 255 л/ч для Supra A80'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/nissan-s14-s15-front-v2-drift-angle-lock-kit-with-rack-offset-spacers'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14/S15'
  AND p.name = 'WiseFab Front Drift Angle Lock Kit (S14/S15 Front V2 Drift Angle Lock Kit with Rack Offset Spacers)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/nissan-s14-s15-rear-suspension-drop-knuckle-kit'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14/S15'
  AND p.name = 'WiseFab Rear Suspension Drop Knuckle Kit (S14/S15)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/nissan-r34-front-drift-angle-lock-kit'
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline GT-R R34'
  AND p.name = 'WiseFab Front Drift Angle Lock Kit (R34)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/mazda-rx-7-front-drift-angle-lock-kit'
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'WiseFab Front Drift Angle Lock Kit (RX-7 FD3S)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/toyota-supra-jza80-soarer-front-drift-angle-lock-kit'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80 (JZA80)'
  AND p.name = 'WiseFab Front Drift Angle Lock Kit (Supra JZA80 / Soarer)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, 'Источник: www.wisefab.com/toyota-supra-jza80-rear-suspension-drop-knuckle-kit'
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80 (JZA80)'
  AND p.name = 'WiseFab Rear Suspension Drop Knuckle Kit (Supra JZA80)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Turbo Quantum Racing GT2871 для SR20DET (Nissan Silvia S14)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = '3 in' AND c.model = ''
  AND p.name = 'Выхлопная система 76 mm (3 in) для S14/S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'S14' AND c.model = ''
  AND p.name = 'Распредвал HKS style для SR20 (S14)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'ECU' AND c.model = ''
  AND p.name = 'Чип‑тюнинг ТУЭМИ (ECU) для S14 Zenki'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'S15' AND c.model = ''
  AND p.name = 'Turbo Garrett GT2871R для SR20DET (S15)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = '76 mm' AND c.model = ''
  AND p.name = 'Выпускная система 3‑inch (76 mm) для S15'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'R34' AND c.model = ''
  AND p.name = 'NISMO интеркулер для RB26DETT (R34)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'GT35R' AND c.model = ''
  AND p.name = 'Turbo Garrett GT3582R (GT35R) для 13B‑REW (RX‑7 FD)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = '76 mm' AND c.model = ''
  AND p.name = 'Выпускная система Racing Beat 3‑inch (76 mm) для FD3S'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Audi' AND c.model = 'RS6'
  AND p.name = 'Coil Conversion & ICM Delete Kit (Audi RS6) для 2.7T'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'RS4' AND c.model = 'B5'
  AND p.name = 'Впускные патрубки (RS4 B5) для турбин K04'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'VW' AND c.model = ''
  AND p.name = 'Двигатель 2.0 L AZJ (VW) для Octavia A5'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'RacingLine' AND c.model = ''
  AND p.name = 'Turbo‑Kit K04 (RacingLine) Stage 3 для 1.4 TSI Rapid'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S14'
  AND p.name = 'Turbo Quantum Racing GT2871 для SR20DET (Nissan Silvia S14)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Skyline R34'
  AND p.name = 'Turbo Garrett GT35R для RB26DETT (Nissan Skyline R34)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Nissan' AND c.model = 'Silvia S15'
  AND p.name = 'Turbo HKS GT2540 для SR20DET (Nissan Silvia S15)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Toyota' AND c.model = 'Supra A80'
  AND p.name = 'Turbo Kit HKS для 2JZ-GTE (Toyota Supra A80)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Honda' AND c.model = 'Civic EK9'
  AND p.name = 'Cold Air Intake Icebox для B16B (Honda Civic EK9)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Mazda' AND c.model = 'RX-7 FD3S'
  AND p.name = 'Turbo HKS T04R для 13B-REW (Mazda RX-7 FD3S)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'включая' AND c.model = 'турбоколлектор'
  AND p.name = 'Турбо‑кит для M50/M52 (включая турбоколлектор)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'OEM' AND c.model = ''
  AND p.name = 'Масляный фильтр европейского бренда (OEM)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'OEM' AND c.model = ''
  AND p.name = 'Воздушный фильтр европейского бренда (OEM)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'BMW' AND c.model = 'E30'
  AND p.name = 'Турбо-кит для M50/M52 (BMW E30)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Volkswagen' AND c.model = 'Golf IV GTI'
  AND p.name = 'Турбо-кит для 1.8T (Volkswagen Golf IV GTI)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Octavia A5'
  AND p.name = 'Чип-тюнинг для 2.0 TDI (Skoda Octavia A5)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Octavia A7'
  AND p.name = 'Чип-тюнинг для 2.0 TSI (Skoda Octavia A7)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Rapid'
  AND p.name = 'Чип-тюнинг для 1.0 TSI (Skoda Rapid)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Octavia A5'
  AND p.name = 'Чип-тюнинг для 2.0 TDI (Skoda Octavia A5)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Octavia A7'
  AND p.name = 'Чип-тюнинг для 2.0 TSI (Skoda Octavia A7)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
INSERT INTO compatibility (carId, partId, note)
SELECT c.id, p.id, NULL
FROM cars c, parts p
WHERE c.brand = 'Skoda' AND c.model = 'Rapid'
  AND p.name = 'Чип-тюнинг для 1.0 TSI (Skoda Rapid)'
  AND NOT EXISTS (
    SELECT 1 FROM compatibility x WHERE x.carId = c.id AND x.partId = p.id
  );
COMMIT;
