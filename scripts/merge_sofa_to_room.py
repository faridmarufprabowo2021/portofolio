import bpy
import os
import math

print("=== Merging High-Detail Sofa into Full 3D Archviz Living Room + PS5 ===")

# 1. Open main Living Room PS5 scene
room_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_PS5.blend"
sofa_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Detailed_Sofa.blend"

bpy.ops.wm.open_mainfile(filepath=room_blend)

scene = bpy.context.scene

# 2. Remove basic old sofa objects from Living Room
old_sofa_names = [
    "Sofa_Base", "Sofa_Backrest", "Sofa_Arm_L", "Sofa_Cushion_1", "Sofa_Cushion_2",
    "Sofa_Chaise", "Sofa_Chaise_Base", "Pillow_Mustard_1", "Pillow_Cream_1"
]

for name in old_sofa_names:
    obj = bpy.data.objects.get(name)
    if obj:
        bpy.data.objects.remove(obj, do_unlink=True)

# 3. Append HighDetail_Sofa Collection from Cozy_Detailed_Sofa.blend
with bpy.data.libraries.load(sofa_blend, link=False) as (data_from, data_to):
    data_to.collections = ["HighDetail_Sofa"]

# Link imported sofa collection to main scene
for col in data_to.collections:
    if col:
        scene.collection.children.link(col)
        # Position high-detail sofa into the living room seating area
        for obj in col.objects:
            obj.location.y += -0.2 # Align perfectly in front of TV & coffee table

# Save merged master scene
out_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_Merged.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_blend)

print(f"✅ MERGED MASTER LIVING ROOM SCENE SAVED TO: {out_blend}")
