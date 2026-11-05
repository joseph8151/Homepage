/**
 * 사진 슬롯 — public/images 에 사진을 넣으면 빌드 때 자동 배치됩니다(scripts/gen-photos.mjs).
 * 파일명이 슬롯 이름으로 시작하면 그 자리에 우선 배정되고, 나머지는 가로/세로에 따라 순서대로 들어갑니다.
 * 사진은 분위기 연출용입니다. 팀원·고객·후기로 오해될 수 있는 설명(이름, 직함, 인용)을 붙이지 마십시오.
 */
export type Photo = { id: string; src: string; alt: string; w: number; h: number; focus?: string };

export const photos = {
  desk: { id: "desk", src: "/images/work-desk.jpg", alt: "밝은 작업 공간에서 노트에 화면 구성을 스케치하는 모습", w: 1168, h: 784, focus: "50% 40%" },
  portrait: { id: "portrait", src: "/images/portrait-light.jpg", alt: "밝은 사무 공간에서 미소 짓는 인물 사진", w: 784, h: 1168, focus: "50% 28%" },
  laptop: { id: "laptop", src: "/images/laptop-beige.jpg", alt: "노트북과 노트가 놓인 책상에 앉아 있는 모습", w: 1168, h: 784, focus: "35% 40%" },
  coffee: { id: "coffee", src: "/images/coffee-break.jpg", alt: "커피를 들고 노트북 앞에 앉아 미소 짓는 모습", w: 784, h: 1168, focus: "50% 30%" },
  studio: { id: "studio", src: "/images/studio-black.jpg", alt: "여러 화면 구성안 종이가 놓인 책상에서 노트북으로 작업하는 모습", w: 1712, h: 1152, focus: "50% 40%" },
} satisfies Record<string, Photo>;
