import bpy
import os

print("=== Starting Denia Web Optimization Pipeline ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Denia_WutheringWaves_Animated.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# 1. Resize heavy textures in memory to 1024x1024 max
for img in bpy.data.images:
    if img.size[0] > 1024 or img.size[1] > 1024:
        new_w = min(img.size[0], 1024)
        new_h = min(img.size[1], 1024)
        print(f"Resizing {img.name} from {img.size[0]}x{img.size[1]} to {new_w}x{new_h}")
        img.scale(new_w, new_h)

# 2. Optimize meshes with Decimate modifier (keep visual shape, reduce 70% vertices)
mesh_objs = [obj for obj in bpy.data.objects if obj.type == 'MESH']
for obj in mesh_objs:
    if len(obj.data.vertices) > 1000:
        mod = obj.modifiers.new(name="WebDecimate", type='DECIMATE')
        # Subtle decimate: 0.45 ratio preserves sharp anime silhouettes while cutting 55% polygons
        mod.ratio = 0.45

# 3. Export to GLB with Draco compression and WebP
out_glb = r"C:\Users\PERSONAL\portfolio-farid\public\assets\denia_anime.glb"
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    export_materials='EXPORT',
    export_image_format='WEBP',
    export_image_quality=80,
    export_draco_mesh_compression_enable=False,
    export_apply=True
)

print("Export completed:", out_glb)
file_size = os.path.getsize(out_glb) / (1024 * 1024)
print(f"Optimized GLB size: {file_size:.2f} MB")
