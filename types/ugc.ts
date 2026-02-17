export type Scene = {
  scene: number;
  visual: string;
  direction: string;
  voiceover: string;
};

export type UGCConcept = {
  product: {
    url: string;
    title: string;
    description: string;
    image: string | null;
  };
  hook: string;
  script: string;
  scenes: Scene[];
  voiceover: string;
  cta: string;
};
