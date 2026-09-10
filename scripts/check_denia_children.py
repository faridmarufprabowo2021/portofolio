import bpy

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

root = bpy.data.objects.get("Denia - (blue ver)")
for child in root.children:
    print(f"Child: {child.name} (type: {child.type}) - Sub-children: {len(child.children)}")
