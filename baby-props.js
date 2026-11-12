// Soft, fitted nursery objects rendered in the same lit 3D scene as the baby.
export function buildBabyProps({T,body,shape,centreY,p,front,ball,mat,mesh,tube}){
 const teddy=new T.Group();teddy.name='baby-teddy';teddy.position.set(-shape[0]*.66,.36,.64);teddy.scale.setScalar(.47);teddy.rotation.z=.13;body.add(teddy);
 const fur=mat('#c6a788',{roughness:.95,sheen:.45,sheenColor:new T.Color('#ead8c3')}),muzzle=mat('#ead5ba',{roughness:1}),paw=mat('#b8977d',{roughness:.95}),ink=mat('#433748',{roughness:.8}),ribbon=mat('#97bfb9',{roughness:.9});
 ball(teddy,fur,0,.39,0,.28,.34,.23);ball(teddy,muzzle,0,.36,.19,.19,.23,.065);
 for(const sign of[-1,1]){ball(teddy,fur,sign*.27,.30,0,.12,.22,.13).rotation.z=sign*.45;ball(teddy,paw,sign*.18,.085,.075,.16,.13,.19);ball(teddy,fur,sign*.23,.90,0,.135,.14,.11);ball(teddy,muzzle,sign*.23,.91,.075,.075,.085,.035);}
 ball(teddy,fur,0,.72,.015,.32,.29,.25);ball(teddy,muzzle,0,.62,.23,.17,.12,.075);
 for(const sign of[-1,1])ball(teddy,ink,sign*.105,.77,.249,.027,.032,.016);
 ball(teddy,ink,0,.66,.30,.045,.032,.025);tube(teddy,[[-.065,.60,.29],[0,.58,.305],[.065,.60,.29]],.009,ink);
 ball(teddy,ribbon,-.075,.50,.22,.09,.047,.035).rotation.z=-.25;ball(teddy,ribbon,.075,.50,.22,.09,.047,.035).rotation.z=.25;ball(teddy,ribbon,0,.50,.25,.035);
 const nappy=new T.Group();nappy.name='baby-nappy';body.add(nappy);const cloth=mat('#eeeaf1',{roughness:.96,sheen:.3,sheenColor:new T.Color('#fff5e6')}),fold=mat('#ddd7e6',{roughness:1}),trim=mat('#c3b8d4',{roughness:.9});
 const top=centreY-shape[1]*.38,start=Math.acos((top-centreY)/shape[1]),geometry=new T.SphereGeometry(1,64,36,0,Math.PI*2,start,Math.PI-start),pos=geometry.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),belly=p.species==='wiggle'?1+.12*y-.07*Math.cos(y*3):1+.065*Math.cos(y*3),wobble=p.species==='wiggle'?.065:p.species==='blip'?.035:.025;pos.setXYZ(i,x*belly+wobble*Math.sin(y*3.5)*(1-y*y),y+.018*x*(1-y*y),z*(1+.055*Math.cos(y*3)));}geometry.computeVertexNormals();const cover=mesh(nappy,geometry,cloth,0,centreY,0);cover.scale.set(shape[0]*1.04,shape[1]*1.025,shape[2]*1.06);
 const y=top-.06;for(const sign of[-1,1]){const tab=ball(nappy,cloth,sign*shape[0]*.55,y-.01,front(sign*shape[0]*.55,y)+.04,.20,.09,.06);tab.rotation.z=sign*.16;tube(nappy,[[sign*.18,y-.04,front(sign*.18,y-.04)+.07],[sign*.31,y-.15,front(sign*.31,y-.15)+.07],[sign*.35,y-.24,front(sign*.35,y-.24)+.07]],.008,fold);}
 const pin=new T.Group();pin.name='closed-safety-pin';pin.position.set(.02,y-.075,front(.02,y-.075)+.105);pin.rotation.z=-.18;nappy.add(pin);const metal=mat('#bccbd2',{metalness:.65,roughness:.32}),cap=mat('#a595c8',{roughness:.55});tube(pin,[[-.15,0,0],[-.19,.035,0],[-.15,.07,0],[.15,.07,0],[.17,.035,0],[.13,.015,0],[-.11,.015,0]],.012,metal);ball(pin,cap,.145,.043,.012,.055,.05,.028);ball(pin,trim,-.15,.035,.012,.024,.024,.018);
 const update=care=>{teddy.visible=!!care?.teddy;nappy.visible=!!care?.nappy&&(!p.babyOutfit||p.babyOutfit==='none');};update(p.babyCare);return{teddy,nappy,update};
}
