export interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const ARTICLES: Article[] = [
  {
    id: "c1",
    title: "Indoor vs Outdoor plants",
    category: "Home & Garden",
    image: "https://i.postimg.cc/Xv3rvzxT/5600.webp",
  },
  {
    id: "c2",
    title: "Gardening tools & from where?",
    category: "Tools",
    image: "https://i.postimg.cc/rp463xwC/pexels-gary-barnes-6231714.jpg",
  },
  {
    id: "c3",
    title: "How to Take Care of Your Plants?",
    category: "Plant Care",
    image: "https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg",
  },
  {
    id: "c4",
    title: "Clean Air, Happy Life",
    category: "Plants",
    image: "https://i.postimg.cc/8zBSTy1x/pexels-photo-807598.jpg",
  },
  {
    id: "c5",
    title: "Common Plant Diseases",
    category: "Diseases",
    image:
      "https://cdn.pixabay.com/photo/2012/10/06/02/20/birnbaum-leaves-59904_1280.jpg",
  },
  {
    id: "c6",
    title: "Perfect Soil Guide",
    category: "Healthy Soil",
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
  },
];

export function getArticleById(id: string | undefined): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
