import bpy
import os

print("=== Clean Export without Unused Morph Targets ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# Delete physics rigidbodies & joints
for obj in list(bpy.data.objects):
    if obj.name.startswith("rigidbodies") or obj.name.startswith("joints") or "dummy" in obj.name.lower():
        bpy.data.objects.remove(obj, do_unlink=True)

out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=85,
    export_morph=False,  # Bypasses 150+ unused MMD shape target buffers that bloat 40MB!
    export_anim_single_armature=True,
    export_draco_mesh_compression_enable=False
)

size_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"ULTRA-LIGHTWEIGHT PRISTINE GLB: {size_mb:.2f} MB")
