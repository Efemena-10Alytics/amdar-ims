export type TestimonialVideo = {
  id: number;
  videoUrl: string;
};

export const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  {
    id: 1,
    videoUrl:
      "https://www.youtube.com/watch?v=MME05VFUbUY&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z",
  },
  {
    id: 2,
    videoUrl:
      "https://www.youtube.com/watch?v=OzipG-7I3bU&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=3",
  },
  {
    id: 3,
    videoUrl:
      "https://www.youtube.com/watch?v=ab_c-mPVzEA&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=8",
  },
  {
    id: 4,
    videoUrl:
      "https://www.youtube.com/watch?v=GRSz3ndb-tQ&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=9",
  },
  {
    id: 5,
    videoUrl:
      "https://www.youtube.com/watch?v=kX1LWvJx9Ks&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=10",
  },
  {
    id: 6,
    videoUrl:
      "https://www.youtube.com/watch?v=jY-j0xYXzpo&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=12",
  },
];

/** Get YouTube thumbnail image URL from a watch URL or video ID. */
export function getYoutubeThumbnail(urlOrId: string): string {
  const match = urlOrId.match(/(?:v=|\/vi\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : urlOrId;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
