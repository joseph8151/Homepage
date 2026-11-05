/**
 * 사진 슬롯 — 파일을 `public/images/` 에 같은 이름으로 넣으면 자동으로 나타납니다(없으면 해당 구간은 표시되지 않음).
 * 사진은 분위기 연출용입니다. 팀원·고객·후기로 오해될 수 있는 설명(이름, 직함, 인용)을 붙이지 마십시오.
 */
export type Photo = { id: string; src: string; alt: string; w: number; h: number; focus?: string };

export const photos = {
  desk: { id: "desk", src: "/images/work-desk.jpg", alt: "밝은 작업 공간에서 노트북으로 디자인 작업을 하는 모습", w: 1168, h: 784, focus: "40% 40%" },
  coffee: { id: "coffee", src: "/images/coffee-break.jpg", alt: "노트북 앞에서 커피를 들고 웃는 모습", w: 784, h: 1168, focus: "50% 30%" },
  portrait: { id: "portrait", src: "/images/portrait-light.jpg", alt: "밝은 사무 공간에서 미소 짓는 인물 사진", w: 784, h: 1168, focus: "50% 25%" },
  laptop: { id: "laptop", src: "/images/laptop-beige.jpg", alt: "흰 책상에서 노트북으로 작업하는 모습", w: 1168, h: 784, focus: "35% 40%" },
} satisfies Record<string, Photo>;
