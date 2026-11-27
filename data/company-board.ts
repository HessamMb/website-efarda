type Role = "ceo" | "chair" | "viceChair" | "member";
type Member = [persian: string, english: string, role: Role];

export const boardRoles = {
  ceo: { fa: "مدیرعامل", en: "CEO" },
  chair: { fa: "رئیس هیئت‌مدیره", en: "Board Chair" },
  viceChair: { fa: "نایب‌رئیس هیئت‌مدیره", en: "Board Vice Chair" },
  member: { fa: "عضو هیئت‌مدیره", en: "Board Member" },
} satisfies Record<Role, { fa: string; en: string }>;

// Members follow the left-to-right order of the cards in the source slides.
export const boardMembers: Record<number, Member[]> = {
  3: [
    ["حمیدرضا محبعلی", "Hamidreza Mohebali", "member"],
    ["وجیه‌اله زارع", "Vajihollah Zare", "member"],
    ["محمد ربیع‌زاده", "Mohammad Rabizadeh", "member"],
    ["مهدی رضایی", "Mehdi Rezaei", "chair"],
    ["مهدی باستان", "Mehdi Bastan", "ceo"],
  ],
  4: [
    ["مهدی باستان", "Mehdi Bastan", "viceChair"],
    ["سیدعلی جلالی نظری", "Seyed Ali Jalali Nazari", "chair"],
    ["پویان عطاآبادی", "Pouyan Ataabadi", "ceo"],
  ],
  5: [
    ["محمدرضا بهرامی", "Mohammadreza Bahrami", "member"],
    ["یوسف پناهی", "Yousef Panahi", "viceChair"],
    ["مهدی باستان", "Mehdi Bastan", "chair"],
    ["صدرا بابایی", "Sadra Babaei", "ceo"],
  ],
  6: [
    ["نجمه نوذر", "Najmeh Nowzar", "member"],
    ["مهدی باستان", "Mehdi Bastan", "chair"],
    ["یاسر خانی", "Yaser Khani", "ceo"],
  ],
  7: [
    ["محمدجعفر عبدی", "Mohammadjafar Abdi", "member"],
    ["محمدعلی سهراب‌نژاد", "Mohammadali Sohrabnejad", "chair"],
    ["هومن ملکالی", "Houman Malekali", "ceo"],
  ],
  8: [
    ["حمیدرضا محبعلی", "Hamidreza Mohebali", "member"],
    ["مهدی رضایی", "Mehdi Rezaei", "viceChair"],
    ["محمد کوچکی", "Mohammad Kouchaki", "chair"],
    ["فرشید اردوانی", "Farshid Ardavani", "ceo"],
  ],
  9: [
    ["محمد عباسی", "Mohammad Abbasi", "member"],
    ["محمدصالحی‌فر", "Mohammad Salehifar", "viceChair"],
    ["محمد گودرزی", "Mohammad Goudarzi", "chair"],
    ["یاسر حسن‌زاده", "Yaser Hassanzadeh", "ceo"],
  ],
};
