// تجميع وحدات المقرر — كهرباء وإلكترونيات الآلات الميكانيكية (مصيم 221)
import { UNIT1 } from './unit1.js';
import { UNIT2 } from './unit2.js';
import { UNIT3 } from './unit3.js';
import { UNIT4 } from './unit4.js';
import { UNIT5 } from './unit5.js';
import { UNIT6 } from './unit6.js';

export const COURSE = {
  title: 'كهرباء وإلكترونيات الآلات الميكانيكية',
  emoji: '⚡',
  tagline: 'من الإلكترون الحر إلى لوحة التحكم — افهم كهرباء آلتك قبل أن تفكّها',
  audience: 'متدربو تخصص صيانة الآلات الميكانيكية — مصيم 221',
  units: [UNIT1, UNIT2, UNIT3, UNIT4, UNIT5, UNIT6],
};
