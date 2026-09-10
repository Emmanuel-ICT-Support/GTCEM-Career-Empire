"""Repair only axial forearm twist in the supplied Schoolboy walk export.
Usage: python3 scripts/repair-schoolboy-forearms.py SOURCE.glb OUTPUT.glb
Retains each forearm swing via swing/twist decomposition around its hand axis.
All bytes outside those two quaternion output accessors are left unchanged.
"""
import json,struct,math,sys,hashlib
from pathlib import Path

def mul(a,b):
 x,y,z,w=a;X,Y,Z,W=b
 return (w*X+x*W+y*Z-z*Y,w*Y-x*Z+y*W+z*X,w*Z+x*Y-y*X+z*W,w*W-x*X-y*Y-z*Z)
def inv(q):return (-q[0],-q[1],-q[2],q[3])
def norm(q):
 l=math.sqrt(sum(v*v for v in q));return tuple(v/l for v in q) if l>1e-9 else (0,0,0,1)
b=bytearray(Path(sys.argv[1]).read_bytes());
assert hashlib.sha256(b).hexdigest() == '8d86e8afb274ae1a047875fcbaaff181e1e1611400bf40fe9ebfd2963fbdb52b', 'Use the verified original Schoolboy export'
n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);base=28+n;changes=[]
for a in j['animations']:
 for c in a['channels']:
  node=j['nodes'][c['target']['node']];name=node.get('name','')
  if name not in ['L_Forearm','R_Forearm'] or c['target']['path']!='rotation':continue
  rest=node.get('rotation',[0,0,0,1]); hand=next(x for x in j['nodes'] if x.get('name')==name[:2]+'Hand');axis=hand['translation'];ln=math.sqrt(sum(v*v for v in axis));axis=[v/ln for v in axis]
  acc=j['accessors'][a['samplers'][c['sampler']]['output']];bv=j['bufferViews'][acc['bufferView']];off=base+bv.get('byteOffset',0)+acc.get('byteOffset',0)
  angles=[]
  for i in range(acc['count']):
   pos=off+i*bv.get('byteStride',16);q=struct.unpack_from('<4f',b,pos);delta=mul(inv(rest),q);dot=sum(delta[k]*axis[k] for k in range(3));twist=norm(tuple(dot*v for v in axis)+(delta[3],));swing=mul(delta,inv(twist));new=norm(mul(rest,swing));struct.pack_into('<4f',b,pos,*new);angles.append(round(math.degrees(2*math.atan2(abs(dot),abs(delta[3]))),2))
  changes.append({'bone':name,'keys':acc['count'],'removedTwistDegrees':[min(angles),max(angles)]})
Path(sys.argv[2]).write_bytes(b);print(json.dumps(changes,indent=2))
