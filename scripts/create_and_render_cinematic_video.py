import bpy
import math
import os

print("=== Setting up Cinematic Camera Animation & Video Render for 3D Living Room ===")

blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_LuxuryComplete.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

scene = bpy.context.scene

# Set Render Settings for Video Animation
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'
scene.render.use_persistent_data = True  # Avoid rebuilding BVH per frame, 5x-10x speed boost!

# Resolution & Frame Rate (Full HD 1080p @ 30 FPS)
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 180  # 6 Seconds of smooth cinematic flythrough

# PNG Sequence Output Setup
frames_dir = r"C:\Users\PERSONAL\Downloads\Denia\frames"
os.makedirs(frames_dir, exist_ok=True)
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = os.path.join(frames_dir, "frame_")

# Create Dedicated Cinematic Camera
if "Cinematic_Cam" in bpy.data.objects:
    bpy.data.objects.remove(bpy.data.objects["Cinematic_Cam"], do_unlink=True)

cam_data = bpy.data.cameras.new("Cinematic_Cam")
cam_data.lens = 26  # 26mm Cinematic Wide Lens
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.8

cam_obj = bpy.data.objects.new("Cinematic_Cam", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Animate Camera Path (Smooth Bezier Keyframes)
keyframes_data = [
    # Frame 1: Wide Entrance Shot (Overlooking Sofa, Arc Lamp & Sunlight)
    (1, (-2.50, -1.90, 1.45), (math.radians(78), 0, math.radians(-42))),
    
    # Frame 60: Gliding past Sofa towards Coffee Table
    (60, (-1.80, -0.60, 1.25), (math.radians(74), 0, math.radians(-32))),
    
    # Frame 110: Low-Angle Macro Glide (Showcasing Candle, Diffuser & PS5 in Background)
    (110, (-0.85, 0.45, 0.92), (math.radians(70), 0, math.radians(-20))),
    
    # Frame 150: Ascending Arc towards TV Wall & Plant
    (150, (-1.55, -0.65, 1.28), (math.radians(75), 0, math.radians(-35))),
    
    # Frame 180: Grand Hero Wide View (Perfect Final Frame)
    (180, (-2.40, -1.80, 1.38), (math.radians(76), 0, math.radians(-34))),
]

for frame, loc, rot in keyframes_data:
    scene.frame_set(frame)
    cam_obj.location = loc
    cam_obj.rotation_euler = rot
    cam_obj.keyframe_insert(data_path="location", frame=frame)
    cam_obj.keyframe_insert(data_path="rotation_euler", frame=frame)

# Dynamic Animation: Scented Candle Flame Flicker
candle_light = scene.objects.get("Candle_Flame_Light")
if candle_light:
    for f in range(1, 181, 10):
        scene.frame_set(f)
        # Subtle flickering energy between 4.2W and 5.8W
        energy = 5.0 + 0.8 * math.sin(f * 0.45)
        candle_light.data.energy = energy
        candle_light.data.keyframe_insert(data_path="energy", frame=f)

# Dynamic Animation: PS5 Blue LED Glow Pulse
ps5_led_mat = bpy.data.materials.get("Mat_PS5_BlueLED")
if ps5_led_mat and ps5_led_mat.node_tree:
    bsdf = ps5_led_mat.node_tree.nodes.get("Principled BSDF")
    if bsdf and 'Emission Strength' in bsdf.inputs:
        for f in range(1, 181, 15):
            scene.frame_set(f)
            str_val = 7.5 + 2.0 * math.sin(f * 0.3)
            bsdf.inputs['Emission Strength'].default_value = str_val
            bsdf.inputs['Emission Strength'].keyframe_insert(data_path="default_value", frame=f)

# Save animated scene blend
out_animated_blend = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_Animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=out_animated_blend)
print(f"✅ Animated Scene Saved to: {out_animated_blend}")

print(f"🎬 Starting Cinematic Video Rendering to: {output_video_path} ...")
