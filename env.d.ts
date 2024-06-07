interface CloudflareEnv {
  KV: KVNamespace;
}

interface Article {
  article_id: string;
  category: string[];
  country: string[];
  creator: string | null;
  description: string;
  image_url: string;
  keywords: string[] | null;
  link: string;
  pubDate: string;
  source_id: string;
  title: string;
}

interface topArticle {
  title: string;
  image_url: string;
}

interface NewsData {
  business: Article[];
  politics: Article[];
  sports: Article[];
  tech: Article[];
  top: Article[];
}
