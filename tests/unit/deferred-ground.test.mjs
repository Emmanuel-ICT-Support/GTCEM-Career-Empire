import {test,expect} from 'vitest';
import * as T from '../../playable-3d/vendor/three/build/three.module.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
// Use the bundled Three library without adding a Node package for browser imports.
const source=readFileSync(new URL('../../playable-3d/environment/ground-polish.js',import.meta.url),'utf8');
const polishGround=vm.runInNewContext(source.replace("import * as T from 'three';",'').replace('export function polishGround','function polishGround')+';polishGround;',{T});
test('perimeter exists with deferred placeholder and shares eventual exact texture',()=>{const scene=new T.Scene(),map=new T.Texture({width:1,height:1}),material=new T.MeshStandardMaterial({map}),tile=new T.Mesh(new T.PlaneGeometry(2,2),material);tile.name='tile-kit-grass';scene.add(tile);const outer=polishGround(scene);expect(outer.name).toBe('Soft campus perimeter');expect(outer.material.map).toBe(map);map.source=new T.Source({src:'grass-ecc-campus-v1-lossless.webp',width:2048,height:2048});expect(outer.material.map.image).toBe(map.image);expect(polishGround(scene)).toBe(outer);expect(scene.children.filter(o=>o.name==='Soft campus perimeter')).toHaveLength(1);});
test('no grass material does not fabricate a surface or throw',()=>{expect(polishGround(new T.Scene())).toBeUndefined();});
