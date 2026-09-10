import subprocess
import os
import time

blender_exe = r"D:\Blender\blender.exe"
script_path = r"C:\Users\PERSONAL\portfolio-farid\scripts\create_and_render_cinematic_video.py"
blend_path = r"C:\Users\PERSONAL\Downloads\Denia\Cozy_Modern_LivingRoom_Animated.blend"
frames_dir = r"C:\Users\PERSONAL\Downloads\Denia\frames"
output_mp4 = r"C:\Users\PERSONAL\Downloads\Denia\LivingRoom_Cinematic_Flythrough.mp4"

print("1. Creating Animated Scene in Blender...")
subprocess.run([blender_exe, "-b", "--python", script_path], check=True)

print("2. Rendering 180 Frames via Blender Cycles GPU OptiX...")
# Render frames 1 to 180
subprocess.run([blender_exe, "-b", blend_path, "-s", "1", "-e", "180", "-a"], check=True)

print("3. Encoding Frames into Cinematic Full HD MP4 Video with FFmpeg...")
ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-framerate", "30",
    "-i", os.path.join(frames_dir, "frame_%04d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "17",
    "-preset", "slow",
    output_mp4
]
subprocess.run(ffmpeg_cmd, check=True)

print(f"🎉 CINEMATIC VIDEO CREATED SUCCESSFULLY: {output_mp4}")
