"""
Script Otomatis: Konversi Video MP4 ke Image Sequence WebP/PNG menggunakan Blender Python
Cara Pakai:
1. Simpan video Anda dengan nama 'video.mp4' di folder 'portfolio-farid/' atau 'Downloads/'
2. Jalankan skrip ini, semua frame akan otomatis diekstrak dan dioptimalkan ke 'public/frames/'
"""

import bpy
import os
import sys

# Path input video
possible_paths = [
    r"C:\Users\PERSONAL\portfolio-farid\video.mp4",
    r"C:\Users\PERSONAL\Downloads\video.mp4",
]

video_path = None
for p in possible_paths:
    if os.path.exists(p):
        video_path = p
        break

if not video_path:
    print("❌ File 'video.mp4' belum ditemukan di folder portfolio-farid atau Downloads.")
    print("Silakan letakkan file video Anda di salah satu folder tersebut dengan nama 'video.mp4'.")
    sys.exit(0)

print(f"🎬 Memproses video: {video_path}")

# Bersihkan scene Blender
bpy.ops.wm.read_factory_settings(use_empty=True)

# Masuk ke mode Video Sequence Editor (VSE)
scene = bpy.context.scene
if not scene.sequence_editor:
    scene.sequence_editor_create()

seq = scene.sequence_editor.sequences.new_movie(
    name="SourceVideo",
    filepath=video_path,
    channel=1,
    frame_start=1
)

total_frames = seq.frame_duration
print(f"📊 Durasi Video: {total_frames} frame")

# Setup output frame
output_dir = r"C:\Users\PERSONAL\portfolio-farid\public\frames"
os.makedirs(output_dir, exist_ok=True)

scene.frame_start = 1
scene.frame_end = total_frames
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100

# Format WebP / PNG
scene.render.image_settings.file_format = 'WEBP'
scene.render.image_settings.quality = 85
scene.render.filepath = os.path.join(output_dir, "frame_")

print("⚙️ Memulai render ekstraksi frame sequence...")
bpy.ops.render.render(animation=True)
print("✅ SELESAI! Semua frame berhasil disimpan di: public/frames/")
