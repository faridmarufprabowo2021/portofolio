import bpy
import os

print("=== FIXING DOUBLE MESH BUG: Purging All 406 Rigidbodies & 561 Joints ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

armature = bpy.data.objects.get("Denia - (blue ver)_arm")
main_mesh = bpy.data.objects.get("Denia - (blue ver)_mesh")

if not armature or not main_mesh:
    raise RuntimeError(f"Could not find required objects! Armature: {armature}, Mesh: {main_mesh}")

# Delete every single object in the blend file EXCEPT the armature and the main animated character mesh
for obj in list(bpy.data.objects):
    if obj != armature and obj != main_mesh:
        bpy.data.objects.remove(obj, do_unlink=True)

# Verify only 2 objects remain in scene
print(f"Remaining objects in scene: {[o.name for o in bpy.data.objects]}")
assert len(bpy.data.objects) == 2, "Expected exactly 2 objects (Armature + Mesh)!"

# Also clear unlinked mesh data from memory
for mesh in list(bpy.data.meshes):
    if mesh != main_mesh.data:
        bpy.data.meshes.remove(mesh)

print(f"Remaining mesh datablocks: {[m.name for m in bpy.data.meshes]}")

# Export only the pure armature + character mesh
out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=85,
    export_morph=False,
    export_anim_single_armature=True,
    export_draco_mesh_compression_enable=False
)

size_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"✅ SINGLE PRISTINE ANIMATED CHARACTER GLB EXPORTED: {size_mb:.2f} MB")
