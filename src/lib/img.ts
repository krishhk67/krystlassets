import { IMG } from "@/lib/mock";

export function resolveImg(key: string): string {
  return (IMG as Record<string, string>)[key] ?? IMG.lightleaks;
}

export function withImg<T extends { img_key?: string; img?: string; img_url?: string }>(
  a: T,
): T & { img: string } {
  const url = a.img_url && a.img_url.length > 0 ? a.img_url : undefined;
  return {
    ...a,
    img: url ?? (a.img_key ? resolveImg(a.img_key) : a.img ?? resolveImg("lightleaks")),
  };
}
