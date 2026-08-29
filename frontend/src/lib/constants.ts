export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'espresso', name: '에스프레소' },
  { id: 'milk_based', name: '라떼 & 밀크' },
  { id: 'sweet', name: '시그니처 & 스위트' },
  { id: 'non_coffee', name: '논커피 & 티' },
] as const;
