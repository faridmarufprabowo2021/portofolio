import bpy

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

print("=== ALL ROOT OBJECTS ===")
for obj in bpy.data.objects:
    if obj.parent is None:
        print(f"Root Object: {obj.name} (type: {obj.type}) - Children: {len(obj.children)}")
