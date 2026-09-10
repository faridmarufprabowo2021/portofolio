import bpy

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
non_rb_meshes = [m for m in meshes if not (m.parent and "rigidbodies" in m.parent.name.lower())]

print(f"Non-rigidbody MESH objects: {len(non_rb_meshes)}")
for m in non_rb_meshes:
    print(f"Name: {m.name} | Parent: {m.parent.name if m.parent else 'None'} | Modifiers: {[mod.type for mod in m.modifiers]} | Verts: {len(m.data.vertices)}")
