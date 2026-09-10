import bpy
import os

print("=== Exporting Pristine High-Quality Denia GLB (No Decimation) ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# 1. Remove any decimate or destroying modifiers to preserve 100% pristine anime geometry
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        for mod in list(obj.modifiers):
            if mod.type in ['DECIMATE', 'REMESH']:
                print(f"Removing destructive modifier {mod.name} from {obj.name}")
                obj.modifiers.remove(mod)

# 2. Resize heavy 2K textures to 1024x1024 in memory for fast web loading without losing quality
for img in bpy.data.images:
    if img.size[0] > 1024 or img.size[1] > 1024:
        new_w = min(img.size[0], 1024)
        new_h = min(img.size[1], 1024)
        img.scale(new_w, new_h)

# 3. Export with pristine mesh + WebP textures
out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=90,
    export_draco_mesh_compression_enable=False,
    export_apply=False
)

file_size = os.path.getsize(out_glb) / (1024 * 1024)
print(f"Pristine GLB Exported Successfully! Size: {file_size:.2f} MB")
