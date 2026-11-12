export const SHAPE_SOUNDS={
 blob:{hello:360,giggle:510,resonance:1050,instrument:'sine',dance:[330,392,440,392,330,294,330,392],beat:.23},
 bobble:{hello:390,giggle:590,resonance:1250,instrument:'triangle',dance:[392,523,659,523,440,587,784,587],beat:.20},
 blip:{hello:510,giggle:740,resonance:1650,instrument:'sine',dance:[659,784,988,784,880,1046,988,784],beat:.16},
 wiggle:{hello:285,giggle:460,resonance:900,instrument:'triangle',dance:[262,392,330,494,294,440,349,523],beat:.25}
};
export const shapeSound=species=>SHAPE_SOUNDS[species]||SHAPE_SOUNDS.blob;
