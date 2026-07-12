import { IMG } from "@/lib/mock";

export function resolveImg(key: string): string {
  return (IMG as Record<string, string>)[key] ?? IMG.lightleaks;
}

export function withImg<T extends { img_key?: string; img?: string }>(a: T): T & { img: string } {
  return { ...a, img: a.img_key ? resolveImg(a.img_key) : (a.img ?? resolveImg("lightleaks")) };
}
