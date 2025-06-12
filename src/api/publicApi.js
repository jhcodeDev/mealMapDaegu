const API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;

export const fetchSomething = async (query) => {
  const url = `https://apis.data.go.kr/6270000/dgMealCardShop/getShopList?serviceKey=${API_KEY}&type=xml&numOfRows=10&pageNo=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};
