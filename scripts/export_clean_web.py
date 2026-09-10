import bpy
import os

print("=== Clean Anime Web Export ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# Delete physics rigidbodies & joints empty objects that inflate glTF animation tracks
for obj in list(bpy.data.objects):
    if obj.name.startswith("rigidbodies") or obj.name.startswith("joints") or "dummy" in obj.name.lower():
        bpy.data.objects.remove(obj, do_unlink=True)

# Resize any 2K textures to 1024
for img in bpy.data.images:
    if img.size[0] > 1024 or img.size[1] > 1024:
        img.scale(min(img.size[0], 1024), min(img.size[1], 1024))

out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=85,
    export_anim_single_armature=True,
    export_bake_animation=False,  # Don't bake 500+ physics bones, export clean keyframes only
    export_draco_mesh_compression_enable=False
)

size_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"CLEAN GLB EXPORTED: {size_mb:.2f} MB")
