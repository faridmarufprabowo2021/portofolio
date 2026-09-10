import bpy

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
print(f"Total MESH objects in scene: {len(meshes)}")

for m in meshes:
    mods = [mod.type for mod in m.modifiers]
    parent_name = m.parent.name if m.parent else "None"
    print(f"Name: {m.name} | Parent: {parent_name} | Mods: {mods} | Verts: {len(m.data.vertices)} | Visible: {not m.hide_render}")
