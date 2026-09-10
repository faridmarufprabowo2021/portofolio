import bpy
import os

print("=== Compressing Denia GLB Textures ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# Delete physics rigidbodies & joints empty objects
for obj in list(bpy.data.objects):
    if obj.name.startswith("rigidbodies") or obj.name.startswith("joints") or "dummy" in obj.name.lower():
        bpy.data.objects.remove(obj, do_unlink=True)

# Resize all images to max 512x512 (crystal clear for 400px web card container)
for img in bpy.data.images:
    if img.size[0] > 512 or img.size[1] > 512:
        orig_w, orig_h = img.size[0], img.size[1]
        new_w = 512 if orig_w >= orig_h else int(512 * (orig_w / orig_h))
        new_h = 512 if orig_h >= orig_w else int(512 * (orig_h / orig_w))
        img.scale(max(new_w, 64), max(new_h, 64))

out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=75,
    export_anim_single_armature=True,
    export_draco_mesh_compression_enable=False
)

size_mb = os.path.getsize(out_glb) / (1024 * 1024)
print(f"HIGH-PERFORMANCE GLB EXPORTED: {size_mb:.2f} MB")
